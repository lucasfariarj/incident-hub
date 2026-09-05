# Incident Hub

Aplicação para registrar, acompanhar e encerrar incidentes operacionais. A interface prioriza uma conversa/timeline simples, próxima a ferramentas de comunicação usadas por equipes.

## Pré-requisitos

- Node.js 20+ e npm.
- Não é necessário instalar Docker, PostgreSQL ou qualquer servidor de banco de dados — o projeto usa SQLite em arquivo local.

## Instalação

1. Instale as dependências:
   ```
   npm install
   ```
2. Gere o client tipado do Prisma a partir de `prisma/schema.prisma`:
   ```
   npx prisma generate
   ```
3. Crie as tabelas no banco SQLite local:
   ```
   npm run db:setup
   ```

## Execução

- Ambiente de desenvolvimento:
  ```
  npm run dev
  ```
  Acesse `http://localhost:3000`.
- Build de produção:
  ```
  npm run build
  npm run start
  ```

## Dados iniciais

O banco é o arquivo `prisma/dev.db`, criado no passo de instalação (`npm run db:setup`). Ele persiste os dados entre reinícios da aplicação.

- Para popular com incidentes de exemplo:
  ```
  npm run db:seed
  ```
  Roda `scripts/seed.cjs`, que insere alguns incidentes com diferentes severidades e status.
- Para resetar do zero: apague `prisma/dev.db` e rode novamente `npm run db:setup` (e, se quiser, `npm run db:seed` em seguida). Não há um comando único de reset — é necessário repetir os passos manualmente.

## Testes

- Testes unitários (Vitest), cobrindo validações e regras de negócio:
  ```
  npm test
  ```
  ou em modo watch: `npm run test:watch`.
- Testes end-to-end (Playwright), simulando o fluxo completo no navegador:
  ```
  npx playwright install --with-deps chromium   # uma vez
  npm run test:e2e
  ```
  O Playwright sobe a aplicação automaticamente (`npm run dev`) antes de rodar os testes.
- Checagem de tipos:
  ```
  npm run lint
  ```

## Arquitetura

- **Next.js (App Router)** com duas formas de acesso a dados:
  - **Server Components** (`app/incidents/page.tsx`, `app/incidents/[id]/page.tsx`, `app/dashboard/page.tsx`) chamam a camada de serviço diretamente, sem HTTP.
  - **Client Components** (`components/incident-form.tsx`, `components/incident-details.tsx`) usam `fetch` contra as rotas de API para ações interativas (criar incidente, mudar status, adicionar atualização).
- **API REST** em `app/api/incidents/route.ts` (`GET`/`POST`) e `app/api/incidents/[id]/route.ts` (`GET`/`PATCH`/`DELETE`).
- **Camada de serviço** (`services/incident.service.ts`) concentra as regras de negócio, como as transições de status permitidas (`canChangeStatus`), e é o único ponto que fala com o Prisma.
- **Validação** com Zod (`lib/validations/incident.ts`), compartilhada entre formulário (client), API (server) e usada como fonte dos tipos TypeScript.
- **Persistência**: Prisma + SQLite (`prisma/schema.prisma`, `prisma/dev.db`), com dois models — `Incident` e `IncidentUpdate` (histórico, relação 1-N com cascade delete).

## Limitações conhecidas

- **Sem autenticação/autorização**: qualquer requisição pode criar, editar ou excluir qualquer incidente; não há conceito de usuário logado.
- **SQLite local**: adequado para rodar sem infraestrutura, mas não para concorrência real ou produção. Um `docker-compose.yml` com PostgreSQL existiu no início do projeto mas foi removido por não estar em uso — migrar o `datasource` de volta para PostgreSQL exigiria reintroduzir essa infraestrutura.
- **`prisma migrate dev` pode não funcionar neste ambiente**: o schema engine do Prisma CLI não roda de forma confiável aqui, por isso `npm run db:setup` aplica o SQL de `prisma/migrations/.../migration.sql` manualmente via `scripts/setup-sqlite.cjs`, em vez do fluxo padrão do Prisma.
- **Testes E2E gravam no banco real** (`prisma/dev.db`), sem isolamento em banco de teste — rodar `npm run test:e2e` repetidamente acumula dados de teste.
- **Sem comando de reset**: limpar o banco exige apagar `prisma/dev.db` (ou remover as tabelas manualmente) e rodar `db:setup` novamente.
