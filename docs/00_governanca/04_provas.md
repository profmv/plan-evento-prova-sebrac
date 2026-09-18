> Resumo: este registro apresenta evidências reproduzíveis da unidade de transição de estados da sessão Recap, incluindo comandos, resultados e limitações conhecidas.

# Registro de provas

## PROVA-006 - Transições de sessão, visibilidade do ranking e auditoria

**Estado:** [OK]

**Afirmação:** o serviço Recap aceita somente as transições `DRAFT -> LOBBY/CLOSED`, `LOBBY -> ACTIVE/CLOSED`, `ACTIVE -> PAUSED/CLOSED` e `PAUSED -> ACTIVE/CLOSED`; uma sessão `CLOSED` não pode ser reaberta. Alterações reais de estado ou visibilidade do ranking usam atualização condicional no D1 e criam evento de auditoria `SESSION_UPDATED`. A rota administrativa `PATCH /api/v1/sessions/:id` valida a entrada com Zod e exige autorização docente.

**Procedimento:** em PowerShell, na raiz do projeto, foram executados `npm run typecheck`, `npm run lint`, `npm run content:validate`, `npm test` e `npm run build`.

**Resultado:** todos os comandos terminaram com código 0 em 2026-09-18. O Vitest executou 14 testes em 4 arquivos; os 3 testes de `recapService.test.ts` cobriram ciclo permitido, rejeição de transição inválida, rejeição de reabertura e alteração independente da visibilidade. O Biome verificou 35 arquivos sem correções pendentes. O build Vite transformou 20 módulos e produziu a distribuição.

**Evidências de implementação:**

- `src/modules/recap/application/recapService.ts`
- `src/modules/recap/application/recapService.test.ts`
- `src/modules/recap/application/ports.ts`
- `functions/_shared/d1RecapRepository.ts`
- `functions/api/v1/[[path]].ts`

**Limites:** [UNVERIFIED] a execução contra D1 local e a cobertura ponta a ponta da rota HTTP ainda não foram realizadas. A autenticação docente de produção depende de configuração externa e permanece fora desta prova.

## Critério de repetição

Esta prova deve ser repetida após qualquer alteração nas transições, no contrato do repositório, na rota administrativa, na autorização ou nas tabelas `sessions` e `admin_audit_events`. Uma falha retorna esta prova para [FAIL] e bloqueia a próxima unidade dependente.

## PROVA-009 - Entregas persistidas, feedback e exportação

**Estado:** [OK]

**Afirmação:** uma equipe autenticada por token temporário pode enviar uma resposta vinculada à sessão, equipe, atividade e rodada; o professor pode consultar a entrega, devolver feedback, aceitar ou pedir revisão, conceder pontos auditáveis e exportar o progresso em CSV ou JSON sem incluir segredos.

**Procedimento:** em PowerShell, na raiz do projeto, foram executados `npm run db:migrate:local`, `npm run validate` e `npm run test:e2e`.

**Resultado:** em 2026-09-18, as migrações `0001`, `0002` e `0003` foram aplicadas localmente com código 0. A validação global terminou com código 0: lint, tipos, conteúdo, 29 testes em 8 arquivos e build de produção. O Playwright terminou com código 0 e confirmou a abertura do portal, a entrada no simulado e a criação da primeira questão em Chromium.

**Evidências de implementação:**

- `migrations/0003_add_activity_submissions.sql`
- `src/modules/recap/domain/submissionSchemas.ts`
- `src/modules/recap/application/submissionService.ts`
- `src/modules/recap/application/submissionService.test.ts`
- `functions/_shared/d1SubmissionRepository.ts`
- `functions/api/v1/[[path]].ts`
- `src/app/App.tsx`
- `tests/e2e/simulado.spec.ts`
- `docs/05_operacao-aula/02_politica-retencao.md`

**Limites:** [UNVERIFIED] ainda não foi realizado o ensaio em segundo dispositivo e com 18 participantes reais. O descarte ao final de 30 dias permanece procedimento operacional, sem expurgo automático.

## PROVA-010 - Publicação estática no GitHub Pages

**Estado:** [OK]

**Afirmação:** o portal estático foi publicado no GitHub Pages com os assets resolvidos sob o caminho-base do repositório e sem expor credenciais.

**Procedimento:** foi configurado o workflow `.github/workflows/deploy-pages.yml`, o repositório foi tornado público, o GitHub Pages foi ativado para build por workflow e o workflow `Deploy GitHub Pages` foi executado manualmente após a ativação.

**Resultado:** em 2026-09-18, a execução `35388532368` terminou com `conclusion=success`. A URL `https://profmv.github.io/plan-evento-prova-sebrac/` respondeu HTTP 200, apresentou o título `Recap SENAC 2026` e contém referências a assets sob `/plan-evento-prova-sebrac/assets/`.

**Limites:** o GitHub Pages não executa Cloudflare Pages Functions nem D1. O modo publicado serve ao portal estático e ao simulado; o fluxo colaborativo de sessões requer a operação local/Cloudflare.

## PROVA-007 - Fluxo HTTP local da sessão Recap

**Estado:** [OK]

**Afirmação:** o ambiente local aceita o fluxo de criar sessão, ativar, entrar em equipe, registrar pontuação, consultar placar, encerrar e rejeitar reabertura.

**Procedimento:** a migração local foi verificada com `npm run db:migrate:local`; o runtime foi iniciado com `npm run cf:dev`. Um cliente HTTP local executou as rotas correspondentes sem revelar o segredo administrativo.

**Resultado:** em 2026-09-18, a migração terminou com código 0 e nenhuma migração pendente. O runtime iniciou em `http://127.0.0.1:8788`. As respostas foram: criação 201, ativação 200, entrada 201, pontuação 201, placar 200, encerramento 200 e tentativa de reabertura 409 com código `SESSION_CLOSED`. O placar retornou duas equipes e a equipe pontuada retornou 10 pontos.

**Limites:** [UNVERIFIED] ainda falta validar este fluxo em um segundo dispositivo pela rede local, com o navegador real do participante e com a interface visual do professor.

## PROVA-008 - Simulado formativo, retomada de erros e recuperação de sessão

**Estado:** [OK]

**Afirmação:** o módulo `simulado` permite configurar filtros de eixo e dificuldade, renderiza banners com fotos de estoque e degradação suave, avalia múltipla escolha, verdadeiro/falso e resposta curta, preserva integridade de alternativas embaralhadas, persiste progresso no localStorage a cada resposta, recupera a sessão ininterruptamente em recarga de página e permite refazer apenas as questões erradas em nova tentativa de reforço.

**Procedimento:** em PowerShell, na raiz do projeto, foram executados `npm run lint`, `npm run typecheck`, `npm run content:validate`, `npm test` e `npm run build`.

**Resultado:** em 2026-09-18, todos os comandos concluíram com código 0. A validação de conteúdo aprovou 15 questões nos 3 eixos e 16 UCs. O Vitest executou 27 testes em 7 arquivos sem falhas, incluindo o fluxo ponta a ponta em `SimuladoFlow.test.tsx` (configuração, resposta sequencial, gabarito comentado, emissão de certificado e recuperação de estado). O build Vite gerou o pacote de produção em `dist/`.

**Evidências de implementação:**
- `src/modules/simulado/domain/simuladoEngine.ts`
- `src/modules/simulado/domain/simuladoEngine.test.ts`
- `src/modules/simulado/application/simuladoService.ts`
- `src/modules/simulado/ui/SimuladoContainer.tsx`
- `src/modules/simulado/ui/SimuladoFlow.test.tsx`
- `content/questions/hardware-suporte.json`
- `content/questions/redes-servidores.json`
- `content/questions/desenvolvimento-aplicativos.json`

**Limites:** [UNVERIFIED] o banco completo de 300 questões (100 por eixo) ainda será expandido no marco subsequente; o teste com 18 alunos simultâneos em rede física permanece pendente da aplicação em sala de aula.
