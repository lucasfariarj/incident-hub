# Entendimento geral

- O Incident Hub é uma aplicação web para centralizar o registro e acompanhamento de incidentes operacionais.

- Objetivo da aplicação é registrar os acidentes operacionais, acompanhar o ciclo de vida do reporte contendo nome, descrição, severidade, status, responsável, data de criação

- Objetivo final é fornecer uma solução simples, confiável e fácil de utilizar, acompanhamento e solucionando incidentes.

# Escopo

- Criar um incidente informando, no mínimo:

-- título;
-- descrição;
-- severidade;
-- status;
-- responsável;
-- data de criação.


- Listar os incidentes cadastrados.
- Visualizar os detalhes de um incidente.
- Atualizar o status de um incidente.
- Alterar responsável e severidade.
- Registrar atualizações/histórico do tratamento do incidente.
- Permitir identificar rapidamente incidentes abertos e sua severidade.
- Permitir marcar um incidente como resolvido/fechado.
- Persistir os dados de forma que permaneçam disponíveis após reiniciar a aplicação.
- Validar os dados de entrada.
- Possuir testes automatizados para as principais regras e fluxos.

# Decisões técnicas

- Next.js: Framework baseado em React full-stack para criação de páginas, rotas, API e integração entre frontend e backend.
- React: Biblioteca utilizada para construir a interface da aplicação por meio de componentes reutilizáveis e interativos.
- TypeScript: Tipagem dos dados
- PostgreSQL: Banco de dados relacional para o registro geral da aplicação: usuários, histórico de alterações e demais informações da aplicação.
- Prisma: ORM utilizado para facilitar a comunicação entre a aplicação e o PostgreSQL, através de tipagem, migrations e uma API para consultas ao banco.
- Zod: Biblioteca de validação de dados utilizada para garantir que informações recebidas pela aplicação
- Vitest: ramework de testes utilizado para testes unitários e de regras de negócio, garantindo que partes isoladas da aplicação funcionem conforme esperado.
- Playwright: Framework para testes end-to-end (E2E), permitindo simular o comportamento de um usuário real no navegador e validar os principais fluxos da aplicação

# Estrutura geral

A aplicação será organizada em camadas, buscando manter as responsabilidades separadas:

- Frontend
-- páginas;
-- componentes;
-- gerenciamento de estado;
-- comunicação com a API.

- Backend
-- rotas/controllers;
-- serviços/regras de negócio;
-- acesso a dados;
-- validação;
-- tratamento de erros.
-- database
-- incidentes;
-- usuários/responsáveis;
-- atualizações/histórico.

Um incidente terá um ciclo de vida definido através de seu status, evitando alterações arbitrárias e mantendo as regras de negócio centralizadas no backend.

Testes

A estratégia será baseada principalmente em testes de unidade para regras de negócio e testes de integração/E2E para os fluxos mais importantes.

Os cenários prioritários serão:

- Criação de incidente;
- Validação de campos obrigatórios;
- Alteração de status;
- Atribuição de responsável;
- Alteração de severidade;
- Registro de atualização;
- Encerramento de incidente;

Os testes E2E deverão validar principalmente o comportamento observado pelo usuário, enquanto os testes unitários deverão cobrir regras específicas do domínio.

# Decomposição

- Preparação
-- Criar estrutura do projeto.
-- Configurar TypeScript, lint e formatação.
-- Configurar ambiente de desenvolvimento.
-- Definir estrutura inicial do banco.
-- Modelagem
-- Definir entidades e relacionamentos.
-- Criar migrations.
-- Definir regras de status e severidade.
-- Definir contratos da API.

- Backend
-- Implementar criação de incidentes.
-- Implementar listagem.
-- Implementar consulta por ID.
-- Implementar atualização.
-- Implementar alteração de status.
-- Implementar histórico.
-- Implementar validações e tratamento de erros.

- Frontend
-- Criar layout principal.
-- Criar listagem de incidentes.
-- Criar formulário de criação.
-- Criar página de detalhes.
-- Implementar atualização de incidentes.
-- Implementar histórico.
-- Implementar filtros, caso o tempo permita.

- Testes
-- Criar testes das regras de negócio.
-- Criar testes dos endpoints principais.
-- Criar testes E2E dos fluxos críticos.

- Refinamento
-- Melhorar estados de loading e erro.
-- Revisar validações.
-- Melhorar acessibilidade e responsividade.
-- Revisar tratamento de casos extremos.
-- Executar lint, testes e build.

# Critérios de aceite

A primeira versão será considerada concluída quando:

- Um usuário conseguir criar um incidente preenchendo os campos obrigatórios.
- O incidente criado permanecer persistido após reiniciar a aplicação.
- Usuários conseguirem visualizar uma lista dos incidentes cadastrados.
- Cada incidente possuir uma página ou visualização detalhada.
- For possível identificar claramente o status e a severidade de cada incidente.
- For possível atribuir e alterar o responsável.
- For possível atualizar o status do incidente.
- For possível registrar informações sobre o tratamento do incidente.
- O histórico das atualizações permanecer associado ao incidente.
- For possível concluir/fechar um incidente.
- Entradas inválidas forem rejeitadas com mensagens apropriadas.
- Os principais fluxos possuírem cobertura de testes automatizados.
- A aplicação puder ser executada seguindo as instruções presentes na documentação.
- O projeto passar por lint, testes e build sem erros.

# Riscos

- Escopo excessivo
Existe o risco de investir tempo demais em funcionalidades secundárias antes de concluir o fluxo principal.

Possivel resolução: priorizar criação, acompanhamento e resolução de incidentes. Funcionalidades desejáveis serão implementadas somente após o MVP estar funcional.

- Complexidade desnecessária
Uma arquitetura excessivamente complexa pode consumir tempo sem trazer benefícios proporcionais para o tamanho do desafio.

Possivel resoulução: utilizar uma arquitetura simples, modular e com responsabilidades bem definidas, evitando abstrações prematuras.

- Falta de cobertura dos fluxos principais
É possível terminar a interface sem garantir que as regras de negócio estejam corretamente implementadas.

Possivel resolução: desenvolver testes junto com as funcionalidades críticas e utilizar testes E2E para validar os principais fluxos do usuário.

- Problemas de integração entre frontend e backend
Diferenças entre os contratos esperados pelo frontend e os retornados pela API podem gerar retrabalho.

Possivel resolução: definir os contratos da API antecipadamente e utilizar tipos/DTOs e validações consistentes.

# Estratégia de IA

Uso da IA para gerar toda a aplicação, porém, sem perder o entendimento do que está sendo implementado e mantendo revisão do que foi entregue, de modo, que seja compreensível toda funcionalidade e analisando se o que foi entregue, atende os requisitos do que foi pedido na aplicação.