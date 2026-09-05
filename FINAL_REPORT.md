### 1. O que foi entregue?
- App para registrar e acompanhar incidentes operacionais contendo: cadastro do reporte, lista de reportes, visualização e status da situação, filtros e dados gerais sobre o conteúdo.
- Usuário pode criar incidente (título, descrição, severidade, responsável), listar com filtros, ver detalhes, mudar status/severidade/responsável, adicionar atualizações — tudo isso registrado numa timeline única de histórico. Dashboard com contagem de abertos, críticos não resolvidos e resolvidos. 

### 2. O que não foi entregue?
-

### 3. O que você deliberadamente decidiu não fazer?
- Dentro do que foi solicitado, tudo foi implementado. Algumas decisões como banco de dados, questões de segurança, gerenciamento do usuário, páginas protegias, não foram desenvolvidas pois não fazia parte das solicitações, mas seriam requisitos básicos caso fosse algo em produção.

### 4. Quais foram as três principais decisões técnicas?
- Next.js: por ser um framework que atende tanto front quanto back, sem ter a necessidade de dividir em duas ferramentas
- Prisma: facilidade de estruturar e gerenciar um banco de dados
- MySQL: também por praticidade e que atendia o objetivo do desafio

### 5. Qual foi o maior erro produzido pela IA durante o desenvolvimento?
- Ocorreu uma única vez de não gerar tudo aquilo que foi solicitado

### 6. Como você identificou esse erro?
- Teste de usabilidade

### 7. Como você corrigiu e validou a correção?
- Execução e teste do projeto

### 8. Houve alguma regressão?
- Não

### 9. Em qual parte houve mais retrabalho?
- Regerar a aplicação para implementar coisas que a IA não identificou

### 10. Cite uma situação em que você rejeitou ou alterou uma abordagem sugerida pela IA.
- Inicialmente, ela sugeriu o uso do Postgree em um container do docker, achei mais trabalhoso e com alternativas mais práticas para a situação

### 11. Qual parte da aplicação você considera menos confiável?
- A camada de regras de negócio ligada ao histórico/status: um teste E2E quebrou por dessincronia entre a mensagem gerada e o texto esperado.

### 12. Se tivesse mais duas horas, quais seriam suas três prioridades?
- Corrigir status/teste E2E: dropdown de status permite opções inválidas na UI. Ajustaria isso fazendo uma validação
- Autenticação
- Componentizar o header pra evitar duplicidade de código

### 13. Como você avalia sua estratégia inicial?
- A estratégia inicial foi sólida no planejamento (escopo, riscos e testes bem definidos), mas otimista demais em achar que a primeira geração cobriria tudo: layout, histórico e banco precisaram de uma segunda rodada de ajustes.

### 14. Aproximadamente quantas interações relevantes com IA foram necessárias?
- Por volta de umas 6

### 15. Quais ferramentas de IA foram utilizadas?
- Codex e Claude Code