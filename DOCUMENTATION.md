# Documentação técnica — Incident Hub

Central operacional para registrar, acompanhar e encerrar incidentes. Este documento complementa o [README.md](README.md) (voltado a setup rápido) com uma visão mais detalhada de comandos, responsabilidades de cada módulo e funcionalidades implementadas.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Linguagem | TypeScript |
| Estilo | CSS puro (`app/globals.css`) + CSS Modules pontuais (`dashboard.module.css`) |
| Validação | Zod (`lib/validations/incident.ts`) |
| ORM / Banco | Prisma + SQLite (`prisma/dev.db`) |
| Componentes de UI | Radix UI (`@radix-ui/react-select`), `lucide-react` para ícones |
| Testes unitários | Vitest |
| Testes E2E | Playwright |

## Comandos

Definidos em [package.json](package.json):

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor Next.js em modo desenvolvimento (`http://localhost:3000`) |
| `npm run build` | Executa `prisma generate` e depois `next build` (build de produção) |
| `npm run start` | Sobe o servidor com o build de produção já gerado |
| `npm run lint` | Checagem de tipos via `tsc --noEmit` (não há ESLint configurado) |
| `npm test` | Roda os testes unitários (Vitest) uma vez |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:e2e` | Roda os testes end-to-end (Playwright); sobe a aplicação automaticamente antes |
| `npm run db:setup` | Executa `scripts/setup-sqlite.cjs`, que cria as tabelas SQLite manualmente a partir de `prisma/migrations/.../migration.sql` |
| `npm run db:seed` | Executa `scripts/seed.cjs`, populando o banco com incidentes de exemplo |

Comandos auxiliares não presentes nos scripts, mas usados no fluxo de setup/manutenção:
- `npx prisma generate` — gera o client tipado do Prisma a partir de `prisma/schema.prisma` (necessário após instalar dependências ou alterar o schema).
- `npx playwright install --with-deps chromium` — instala o navegador usado pelos testes E2E (rodar uma vez).

> Não existe comando de reset do banco. Para zerar os dados: apague `prisma/dev.db` e rode `npm run db:setup` (e `npm run db:seed`, se quiser dados de exemplo) novamente.

## Estrutura e responsabilidades

```
app/                    rotas (App Router) — páginas e API
  layout.tsx            layout raiz (html/body, metadata)
  page.tsx              "/" → redireciona para "/dashboard"
  dashboard/page.tsx     "/dashboard" — resumo + últimos incidentes
  incidents/page.tsx     "/incidents" — listagem com filtros
  incidents/new/page.tsx "/incidents/new" — formulário de criação
  incidents/[id]/page.tsx "/incidents/:id" — detalhes de um incidente
  api/incidents/route.ts        GET (listar) / POST (criar)
  api/incidents/[id]/route.ts   GET (detalhe) / PATCH (atualizar) / DELETE (remover)

components/             componentes de UI
  incident-card.tsx      card resumido de um incidente (usado nas listagens)
  incident-details.tsx   client component: exibe e edita um incidente (status, severidade, responsável, timeline)
  incident-form.tsx      client component: formulário de criação de incidente
  incident-filters.tsx   filtros de status/severidade da listagem
  incident-badge.tsx     badge visual de status/severidade
  dashboard-summary.tsx  cards de estatísticas do dashboard
  ui/                    primitivos (button, input, textarea, badge, select) — wrappers estilizados sobre HTML/Radix

services/incident.service.ts
                        única camada que fala com o Prisma; concentra regras de negócio:
                        - transições de status permitidas (canChangeStatus)
                        - consultas (listIncidents, getIncident, getDashboardStats)
                        - mutações (createIncident, patchIncident, addUpdate, removeIncident)

lib/
  prisma.ts             instância singleton do PrismaClient
  validations/incident.ts  schemas Zod (create/update de incidente, criação de update/comentário)
  utils.ts               utilitários genéricos (ex.: merge de classNames)

prisma/
  schema.prisma          modelos Incident e IncidentUpdate
  migrations/             SQL de criação das tabelas
  dev.db                  arquivo do banco SQLite (gerado localmente, não versionado)

scripts/
  setup-sqlite.cjs        aplica a migration SQL diretamente no SQLite (substitui `prisma migrate dev`, que não roda de forma confiável neste ambiente)
  seed.cjs                insere incidentes de exemplo

tests/incident.service.test.ts   testes unitários das regras de negócio do serviço
e2e/incident.spec.ts             teste E2E do fluxo principal (criar → visualizar → atualizar)
```

## Modelo de dados

Dois models Prisma ([prisma/schema.prisma](prisma/schema.prisma)):

- **Incident**: `id`, `title`, `description`, `severity` (`LOW|MEDIUM|HIGH|CRITICAL`), `status` (`OPEN|INVESTIGATING|RESOLVED|CLOSED`, default `OPEN`), `assignee`, `createdAt`, `updatedAt`, relação 1-N com `updates`.
- **IncidentUpdate**: `id`, `content`, `author`, `createdAt`, `incidentId` (FK com `onDelete: Cascade`) — histórico/timeline de um incidente.

Regras de transição de status ([services/incident.service.ts:10](services/incident.service.ts#L10)):

```
OPEN          → INVESTIGATING | RESOLVED | CLOSED
INVESTIGATING → OPEN | RESOLVED | CLOSED
RESOLVED      → OPEN | CLOSED
CLOSED        → OPEN
```

Toda mudança de status gera automaticamente um `IncidentUpdate` de sistema (ex.: "Status alterado para Resolvido.").

## Como as páginas são renderizadas

O projeto usa o **App Router** do Next.js, misturando dois modelos de renderização:

1. **Server Components (páginas)** — `dashboard/page.tsx`, `incidents/page.tsx`, `incidents/[id]/page.tsx` são `async function` executadas **no servidor a cada requisição**. Elas chamam `services/incident.service.ts` diretamente (sem HTTP, sem passar pela API REST) e devolvem HTML já pronto com os dados do Prisma.
   - Todas essas páginas exportam `export const dynamic = "force-dynamic"`, o que desativa a cache estática do Next e força **SSR (Server-Side Rendering) sob demanda** em toda visita — necessário porque os dados (lista/status dos incidentes) mudam a todo momento.
   - `incidents/new/page.tsx` é um Server Component simples (sem fetch de dados) que apenas renderiza o formulário client-side.
   - `app/page.tsx` não renderiza nada: só executa um `redirect("/dashboard")` no servidor.
2. **Client Components (interatividade)** — marcados com `"use client"`: `incident-form.tsx` e `incident-details.tsx`. Rodam no navegador e usam `fetch` contra as rotas de API (`/api/incidents`, `/api/incidents/[id]`) para criar incidentes, mudar status/severidade/responsável e adicionar atualizações.
   - Após uma mutação bem-sucedida, chamam `router.refresh()` (ou `router.push()` seguido de `refresh()`), o que faz o Next re-executar o Server Component da página atual no servidor e trazer o HTML atualizado — sem recarregar a página inteira nem duplicar lógica de fetch no cliente.
3. **API REST** (`app/api/incidents/**/route.ts`) — Route Handlers que validam o corpo com os mesmos schemas Zod usados no formulário, chamam o `incident.service.ts` e devolvem JSON. É a única porta de entrada usada pelos Client Components; os Server Components nunca passam por ela.

Resumindo o fluxo de uma edição: `IncidentDetails` (client) → `fetch PATCH /api/incidents/[id]` → `route.ts` valida (Zod) → `incident.service.ts` aplica a regra de transição e grava no Prisma → resposta JSON → `router.refresh()` → o Server Component da página busca os dados atualizados direto do Prisma e re-renderiza no servidor.

## Funcionalidades implementadas

- Criar incidente (título, descrição, severidade, responsável; status inicial `OPEN`), com validação client e server-side.
- Listar incidentes, com filtro por status e por severidade, e contagem de "abertos" vs. total.
- Dashboard com estatísticas agregadas (abertos, críticos em aberto, resolvidos) e os 5 incidentes mais recentes.
- Página de detalhes de um incidente: descrição, badges de status/severidade, edição inline de status/severidade/responsável.
- Timeline de atualizações por incidente, com criação de novas mensagens (autor + conteúdo) e mensagens automáticas de sistema a cada troca de status.
- Regras de transição de status centralizadas no backend (não é possível pular para qualquer status arbitrariamente).
- Persistência local via SQLite (dados sobrevivem a reinícios da aplicação).
- Testes automatizados: unitários das regras de negócio (Vitest) e E2E do fluxo principal (Playwright).

## Limitações conhecidas

- Sem autenticação/autorização — qualquer requisição pode criar, editar ou excluir qualquer incidente.
- SQLite local: adequado para rodar sem infraestrutura, mas não para concorrência real ou produção.
- `prisma migrate dev` não é usado por não rodar de forma confiável neste ambiente; `db:setup` aplica o SQL manualmente.
- Testes E2E gravam no banco real (`prisma/dev.db`), sem banco de teste isolado.
- Sem comando único de reset do banco.
