> Resumo: este handoff registra a continuidade do Recap principal após a implementação do catálogo de 16 UCs, jornada automática por rodadas, controles docentes, recursos externos opcionais e validações locais.

# Handoff 003 - Recap principal com jornada automática

## 1. Escopo concluído nesta etapa

O Recap principal recebeu uma jornada local conduzida pelo professor. A sessão possui três rodadas persistidas; o professor seleciona a rodada no painel e cada equipe recebe automaticamente sua atividade correspondente. A atualização do participante consulta a sessão pública a cada cinco segundos.

O catálogo contém 16 atividades, uma para cada UC01 a UC16. As atividades permanecem `IN_REVIEW`: existe cobertura estrutural, mas a aprovação pedagógica final ainda depende do professor responsável.

## 2. Implementação disponível

### 2.1. Jornada de equipes

- Migração `migrations/0002_add_journey_round.sql` adiciona `journey_round` à sessão, com valores de 1 a 3.
- `SessionSummary`, serviço Recap, contrato de atualização e repositório D1 carregam, persistem e retornam a rodada.
- `PATCH /api/v1/sessions/:id` aceita `journeyRound` validado entre 1 e 3.
- O painel docente apresenta os botões `Rodada 1`, `Rodada 2` e `Rodada 3`.
- O portal participante atribui atividades pelo nome das seis equipes padrão e pela rodada atual.
- A distribuição cobre UC01 a UC16; UC01 e UC09 são revisões adicionais na terceira rodada.

### 2.2. Atividades e operação

- `content/activities/uc10-consulta-inventario.json` define a atividade UC10.
- `content/activities/coverage-all-units.json` define as outras 15 atividades e completa UC01 a UC16.
- `docs/05_operacao-aula/01_guia-operacao-local.md` descreve a abertura da sessão, as rodadas, a pontuação e a contingência.
- O professor ainda avalia a evidência apresentada pela equipe e registra pontos manualmente; a resposta do aluno não é persistida no servidor.

### 2.3. Reuso externo

- UC01 oferece link opcional para PC Anatomy.
- UC10 oferece link opcional para BuddySQL.
- Os dois recursos foram verificados como MIT e registrados em `docs/00_governanca/05_licencas.md`.
- Não foi copiado código dos repositórios externos. O Recap local continua operacional sem Internet.

## 3. Evidências verificadas

| ID | Estado | Afirmação | Evidência |
|---|---|---|---|
| PROVA-006 | [OK] | Transições de sessão, ranking e auditoria funcionam. | `docs/00_governanca/04_provas.md` |
| PROVA-007 | [OK] | Fluxo HTTP local de criação, entrada, pontuação, placar e encerramento funcionou. | `docs/00_governanca/04_provas.md` |
| PROVA-008 | [OK] | Rodada 2 foi persistida por `PATCH` e retornada pela consulta pública da sessão. | Criação 201, atualização 200 e consulta 200 em `http://127.0.0.1:8789`. |
| PROVA-009 | [OK] | O validador reconhece 16 atividades para UC01 a UC16. | `npm run content:validate`: 16 atividades válidas. |
| PROVA-010 | [OK] | Interface e serviço Recap isolados passaram nos testes aplicáveis. | `vitest run src/app/App.test.tsx src/modules/recap/application/recapService.test.ts`: 7 testes aprovados. |

## 4. Estado de qualidade

- [OK] TypeScript do Recap após a jornada automática foi validado antes da última alteração concorrente do simulador.
- [OK] Biome isolado dos arquivos Recap e validação de conteúdo passaram.
- [OK] Vite compilou o cliente atualizado com 132 módulos.
- [UNVERIFIED] O portão global final deve ser repetido depois que o agente do simulador estabilizar seus arquivos. Durante esta etapa houve mudanças concorrentes em `src/modules/simulado/`, incluindo erro de importação não utilizada em teste e formatação pendente; não alterar esses arquivos a partir deste handoff.
- [UNVERIFIED] A jornada visual deve ser testada em segundo dispositivo na rede local antes da aula.
- [UNVERIFIED] A resposta textual de equipe permanece apenas no navegador; não há submissão persistida, revisão por critério ou feedback salvo.

## 5. Pendências para completar o Recap principal

1. Criar persistência de submissão por sessão, equipe, atividade e rodada.
2. Exibir as submissões ao professor e salvar feedback por critério.
3. Registrar conclusão e progresso por equipe e atividade.
4. Revisar e aprovar pedagogicamente as 16 atividades.
5. Criar certificado simbólico e reconhecimento de conclusão.
6. Executar teste real em segundo dispositivo, acessibilidade automatizada e ensaio com 18 participantes.
7. Produzir exportação de progresso/evidências e concluir política de retenção.
8. Configurar publicação Cloudflare, autenticação docente de produção e D1 remoto quando houver credenciais e autorização.

## 6. Próxima sequência recomendada

Implementar submissões persistidas e feedback docente. A unidade deve adicionar uma migração append-only, contrato de API, validação de entrada, repositório D1, serviço de domínio, interface de equipe, interface de revisão docente e testes unitários/integrados. Não misturar essa unidade com mudanças do simulador.

## 7. Comandos de retomada

```powershell
./iniciar.bat
npm run db:migrate:local
npm run content:validate
npm test
npm run typecheck
npm run lint
npm run build
```

O launcher exibe o endereço local e o endereço IPv4 para os dispositivos participantes. Não compartilhar o segredo administrativo com alunos.
