# AI_LOG

Registro das interações com IA consideradas relevantes para entender como o Incident Hub foi construído. Nem toda conversa está aqui, apenas os marcos que moldaram a estrutura, as regras de negócio ou o histórico de decisões do projeto.

Ferramentas utilizadas: Codex (estruturação inicial da aplicação) e Claude Code (scripts auxiliares e documentação).

---

## 1. Estrutura inicial da aplicação

**Ferramenta:** Codex

### Objetivo
Criar a aplicação descrita no `PLAN.md`, respeitando os critérios de aceite ali definidos, sem uma referência visual explícita no desafio para a interface.

### Contexto
- `PLAN.md` (entendimento geral, escopo, decisões técnicas, critérios de aceite e riscos já definidos previamente).
- Decisão de usar uma interface inspirada em ferramentas de comunicação em equipe (estilo WhatsApp), por ser um padrão familiar que reduz a curva de aprendizado de quem for avaliar/usar a aplicação.
- Estrutura de pastas definida antecipadamente:
  - `app/` — páginas e API (`app/incidents/page.tsx` para listagem, `app/incidents/new/page.tsx` para criação, `app/incidents/[id]/page.tsx` para detalhe, `app/api/incidents/route.ts` e `app/api/incidents/[id]/route.ts` para a API REST).
  - `components/` — componentes reutilizáveis (ex.: `IncidentCard`).
  - `services/` — regras de negócio (ex.: `incident.service.ts`).
  - `lib/validations/` — schemas Zod compartilhados entre formulário e API.
  - `lib/prisma.ts` — client Prisma singleton.

### Instrução
Gerar a aplicação completa seguindo essa estrutura de pastas, as ferramentas listadas nas decisões técnicas do `PLAN.md` (Next.js, React, TypeScript, Prisma, Zod, Vitest, Playwright) e os critérios de aceite (criação, listagem, detalhe, atualização de status/severidade/responsável, histórico, encerramento, validação de entradas, testes automatizados).

### Resultado
Aplicação Next.js (App Router) gerada com a estrutura combinada: páginas Server Components consumindo a camada de serviço diretamente, rotas de API para as ações client-side, validação Zod compartilhada, e persistência via Prisma. Modelos `Incident` e `IncidentUpdate` criados no banco (inicialmente pensado como PostgreSQL no `PLAN.md`, adaptado para SQLite local — ver limitação registrada no `README.md`).

### Validação
Revisão manual dos arquivos gerados comparando com a estrutura pedida e com os critérios de aceite do `PLAN.md`; conferência de que cada rota/página esperada existe no caminho correto.

### Decisão
Aceitar a estrutura gerada como base do projeto e seguir com os ajustes incrementais (layout, histórico, dashboard, seed) em cima dela.

---

## 2. Migração do layout para shadcn/ui

**Ferramenta:** Codex

### Objetivo
Substituir o layout inicial, considerado básico demais, por componentes de UI mais consistentes.

### Contexto
Componentes existentes até então (formulário de incidente, filtro, campos de status/severidade) usando HTML puro estilizado via CSS.

### Instrução
Adotar a biblioteca shadcn/ui e atualizar os componentes do projeto para usar as novas primitivas disponíveis — em especial os campos de filtro, inputs, indicador de status, textarea e selects.

### Resultado
Projeto passou a ter `components.json` (configuração do shadcn/ui, estilo "new-york", ícones via `lucide-react`) e uma pasta `components/ui/` com `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx` e `badge.tsx`, usados nos formulários (`incident-form.tsx`, `incident-details.tsx`) e nos filtros da listagem.

### Validação
Conferência visual da aplicação rodando localmente (`npm run dev`), comparando o antes/depois dos componentes de formulário e filtro; checagem de que os componentes shadcn substituíram corretamente os elementos HTML antigos sem quebrar os formulários existentes.

### Decisão
Manter shadcn/ui como padrão de UI para os próximos componentes (ex.: dashboard).

---

## 3. Histórico de mudanças de status

**Ferramenta:** Codex

### Objetivo
Resolver uma pendência do escopo: manter um histórico de quando um incidente foi aberto, teve seu status alterado, foi resolvido e fechado — não apenas o status atual.

### Contexto
`services/incident.service.ts` já continha a regra de negócio de transições de status (`canChangeStatus`); model `IncidentUpdate` já existia para comentários/atualizações do tratamento.

### Instrução
Em vez de criar uma entidade de histórico separada, aproveitar o próprio relacionamento de atualizações (`IncidentUpdate`) do incidente para registrar também as mudanças de status, lado a lado com os comentários da equipe.

### Resultado
`statusHistoryMessage()` gera uma mensagem automática (ex.: "Status alterado para Fechado.") e `createIncident`/`patchIncident` criam uma `IncidentUpdate` com autor "Sistema" sempre que o incidente é criado ou tem o status alterado, aparecendo na mesma timeline exibida em `components/incident-details.tsx`.

### Validação
Teste unitário cobrindo `statusHistoryMessage` (`tests/incident.service.test.ts`); verificação manual na tela de detalhes do incidente, checando se a mudança de status realmente aparece na timeline junto com os comentários.

### Decisão
Não criar uma tabela dedicada de histórico — reutilizar `IncidentUpdate` para reduzir complexidade, já que o requisito era apenas exibir a linha do tempo, não consultar o histórico de forma estruturada separadamente.

---

## 4. Dashboard resumo

**Ferramenta:** Codex

### Objetivo
Atender ao requisito de uma visão resumida com: quantidade de incidentes abertos, quantidade de incidentes críticos ainda não resolvidos e quantidade de incidentes resolvidos.

### Contexto
Camada de serviço já expunha `listIncidents`; banco já continha os campos `status` e `severity` necessários para os agregados.

### Instrução
Criar uma página de dashboard que calcule e exiba esses três indicadores, reaproveitando os componentes shadcn/ui já adotados.

### Resultado
`getDashboardStats()` em `services/incident.service.ts` calcula os três números em uma única `prisma.$transaction` (abertos = status fora de `RESOLVED`/`CLOSED`; críticos abertos = severidade `CRITICAL` e status não resolvido/fechado; resolvidos = status `RESOLVED`). Exibido em `app/dashboard/page.tsx` via `components/dashboard-summary.tsx`, junto com uma lista dos incidentes mais recentes.

### Validação
Conferência manual comparando os números exibidos no dashboard com a lista de incidentes cadastrados no banco naquele momento.

### Decisão
Manter os três indicadores como uma única consulta agregada (transação) em vez de três chamadas separadas, por simplicidade e consistência dos números exibidos.

---

## 5. Script de seed do banco local

**Ferramenta:** Claude Code

### Objetivo
Ter uma forma rápida e repetível de popular o banco local com dados de exemplo, sem precisar cadastrar incidentes manualmente pela interface a cada teste.

### Contexto
Banco SQLite local (`prisma/dev.db`) já criado via `npm run db:setup`; ausência de qualquer script de seed até então.

### Instrução
Criar um script para popular o banco com 3 incidentes específicos:
- Payment API instability — Critical — Ana — Open
- Reconciliation delay — High — Bruno — In Progress
- Incorrect customer notification — Medium — Carla — Resolved

### Resultado
Criado `scripts/seed.cjs` (executado via `npm run db:seed`), inserindo os 3 incidentes via Prisma Client. Como o enum `IncidentStatus` do schema só possui `OPEN / INVESTIGATING / RESOLVED / CLOSED` (sem "In Progress"), o status do incidente do Bruno foi mapeado para `INVESTIGATING`.

### Validação
Execução do script (`npm run db:seed`) e conferência via consulta direta ao SQLite de que os 3 registros foram inseridos com os valores esperados.

### Decisão
Manter o mapeamento "In Progress" → `INVESTIGATING`, por ser o status do enum mais próximo semanticamente ("incidente em análise/tratamento"). Ajuste flexível caso surja um nome de status mais específico no futuro.

---

## 6. Documentação técnica do projeto

**Ferramenta:** Gemini

### Objetivo
Ter uma documentação técnica além do `README.md` (focado em setup), cobrindo comandos disponíveis, responsabilidades de cada módulo/pasta e as funcionalidades já implementadas — incluindo uma explicação de como as páginas são renderizadas (Server vs. Client Components).

### Contexto
Projeto já com `README.md` (instalação, execução, testes, arquitetura resumida e limitações conhecidas) e código-fonte completo (`app/`, `components/`, `services/`, `lib/`, `prisma/`). Dúvida pontual do usuário sobre o modelo de renderização das páginas do App Router.

### Instrução
Explicar como as páginas são renderizadas e gerar uma documentação do projeto contendo comandos, responsabilidades de cada parte do código e funcionalidades.

### Resultado
Leitura do código (`package.json`, páginas em `app/`, `components/`, `services/incident.service.ts`, `lib/validations/incident.ts`, `prisma/schema.prisma`) para criar `DOCUMENTATION.md`, com: tabela de stack, tabela de comandos (scripts do `package.json` + comandos auxiliares como `prisma generate`), estrutura de pastas com a responsabilidade de cada arquivo, modelo de dados e regras de transição de status, uma seção específica sobre o modelo de renderização (Server Components com `force-dynamic` para leitura de dados direto do Prisma; Client Components usando `fetch` contra a API REST e `router.refresh()` para atualizar a tela) e a lista de funcionalidades implementadas.

### Validação
Conferência cruzada entre o conteúdo gerado e o código-fonte de cada página/serviço citado (ex.: presença de `export const dynamic = "force-dynamic"` nas três páginas de leitura, fluxo de `patch`/`router.refresh()` em `incident-details.tsx`).

### Decisão
Manter `DOCUMENTATION.md` como arquivo separado do `README.md`, já que este último é voltado a onboarding/setup rápido e o novo documento é uma referência técnica mais detalhada.

# Pontos a se Ressaltar
- a IA produziu algo incorreto?
Inicialmente, deixou de gerar algumas solicitações. Tiveram que ser incrementadas posteriormente

- Uma abordagem precisou ser abandonada:
Inicialmente, pensei em usar Postgree, mas optei pelo sql pela facilidade e sem a necessidade de um docker


