> Resumo: a execução foi interrompida por solicitação do usuário após consolidar o primeiro fluxo vertical do portal. O repositório valida com código 0, possui 11 testes aprovados e build funcional; sessão, equipes, entrada temporária, pontuação idempotente e ranking funcionam contra D1 local. A próxima sessão deve retomar pelos controles do professor, ciclo de vida da sessão e exportações, sem considerar o portal ou o simulado concluídos.

# Handoff 002 - Interrupção solicitada e retomada em nova sessão

```json
{"id":"HANDOFF-002","data":"2026-09-18","estado":"INTERROMPIDO_POR_SOLICITACAO","marco":"M1-PORTAL","validacao_final":{"comando":"npm run validate","codigo_saida":0,"testes":11,"arquivos_teste":3},"continuacao":"nova sessão"}
```

## 1. Motivo e limite deste handoff

O usuário determinou: `PARE. Gere o handoff. Continuamos em nova sessão`. Nenhuma nova funcionalidade foi implementada depois dessa instrução. Foram executadas somente uma verificação final de leitura e teste e a criação deste registro. O trabalho deve permanecer parado nesta sessão.

Este documento complementa, sem substituir, o [handoff 001](./handoff_001.md). A governança canônica permanece em [visão geral](../00_governanca/00_visao-geral.md), [decisões](../00_governanca/01_decisoes.md), [riscos](../00_governanca/02_riscos.md), [requisitos](../00_governanca/03_requisitos.md) e [arquitetura](../03_arquitetura/00_arquitetura.md).

## 2. Estado verificado na interrupção

O comando `npm run validate` foi executado imediatamente antes deste handoff e terminou com código `0`. O resultado consolidado foi:

- Biome verificou 34 arquivos sem correção pendente.
- A taxonomia confirmou três eixos, 16 UCs e 1.200 horas.
- O validador encontrou zero atividades e zero questões; essa lacuna permanece explicitamente `[PENDING]`.
- Vitest executou 11 testes distribuídos por três arquivos; todos passaram.
- O build transformou 20 módulos e gerou os arquivos de distribuição.
- TypeScript em modo estrito e o build Vite não apresentaram erros.

O ensaio HTTP real realizado antes da interrupção continua sendo a principal prova operacional. Wrangler iniciou Pages Functions com D1 local e segredo carregado de `.dev.vars`. A rota de saúde respondeu corretamente. Uma sessão `LOBBY` foi criada com duas equipes de ensaio, consultada pelo código público e acessada por uma participação temporária. Um evento de dez pontos foi enviado duas vezes com a mesma chave idempotente: a primeira chamada retornou `applied=true`, a segunda retornou `applied=false`, e o ranking permaneceu em dez pontos. O servidor retornou os códigos HTTP esperados.

## 3. Implementação disponível

### 3.1. Fundação e interface

O projeto usa React 19, TypeScript 7, Vite 8, Zod 4, Vitest 5, Wrangler 4 e D1. A interface possui página inicial, apresentação dos três eixos, entrada de participante, painel do professor e estado informativo do simulado. O PWA está configurado de forma conservadora e não é tratado como substituto da rede local.

O painel do professor aceita o segredo administrativo local e cria uma sessão inicial com seis equipes de três participantes como configuração derivada para a turma de 18 alunos. A interface exibe o código público e a lista de equipes. A tela do aluno localiza uma sessão, permite escolher a equipe e armazena o token temporário somente em `sessionStorage`.

### 3.2. API e segurança

O adaptador `functions/api/v1/[[path]].ts` atende:

- criação administrativa de sessão;
- consulta pública por código;
- entrada temporária em equipe;
- consulta do ranking quando visível;
- criação administrativa de evento de pontuação com chave idempotente.

A autorização do professor usa `Authorization: Bearer`, segredo externo ao código e comparação de hashes em tempo constante. Ausência de configuração resulta em erro explícito, não em acesso aberto. O script `scripts/ensure-local-env.ps1` gera um segredo aleatório de 32 bytes em `.dev.vars`, codificado em UTF-8 sem BOM. O arquivo é ignorado pelo Git. O segredo não deve ser copiado para documentação, fixture, log ou commit.

### 3.3. Domínio e persistência

O domínio possui esquemas de criação de sessão, entrada, pontuação, atualização de sessão e identificadores. O serviço de aplicação gera código público sem caracteres ambíguos, cria equipes, limita validade da participação temporária, calcula hash do comando idempotente, rejeita reutilização conflitante e classifica equipes de forma determinística. Empates conservam a mesma posição; nenhum desempate não aprovado foi inventado.

A migração `migrations/0001_portal_core.sql` cria sessões, equipes, participações, versões de atividade, rodadas, eventos de pontuação, auditoria, índices e a visão `team_score_totals`. A migração foi aplicada ao D1 local. O estado local contém dados do ensaio HTTP; uma nova sessão pode preservar esses dados para diagnóstico ou remover apenas o banco local de desenvolvimento mediante decisão explícita. Não executar limpeza destrutiva por padrão.

### 3.4. Conteúdo curricular

`content/taxonomy/course.json` contém as 16 UCs com títulos, cargas, eixos, pré-requisitos e correquisitos extraídos do plano fornecido. O esquema valida soma de 1.200 horas, distribuição 272/308/620 e classificação sem UC órfã. Questões suportam múltipla escolha, verdadeiro ou falso e resposta curta. Conteúdo externo exige licença e atribuição. Atividades suportam quiz, problema, projeto, apresentação e interação.

O script `scripts/validate-content.ts` valida arquivos, IDs e versões, vínculos curriculares, eixo da UC e quantidade de questões aprovadas. A opção `--require-complete-bank` existe para o portão final, mas ainda não é executada pelo marco atual porque não há banco produzido. Não alterar esse estado para `[OK]` até existirem 100 questões revisadas por eixo.

## 4. Última alteração antes da parada

A última alteração funcional foi a inclusão de `updateSessionCommandSchema` em `src/modules/recap/domain/recapSchemas.ts`. O esquema aceita alteração opcional de estado entre `LOBBY`, `ACTIVE`, `PAUSED` e `CLOSED` e/ou `rankingVisible`, exigindo ao menos um campo. Essa alteração passou na validação final, mas ainda não possui serviço, repositório, rota, interface ou teste específico. Ela é o ponto natural de retomada.

## 5. Próxima sequência recomendada

1. Implementar transições de sessão no serviço, respeitando uma máquina de estados explícita e rejeitando reabertura de sessão `CLOSED` sem nova decisão.
2. Adicionar método de persistência e auditoria para estado e visibilidade do ranking.
3. Expor `PATCH /api/v1/sessions/:id` com autorização docente e validação Zod.
4. Completar o cliente frontend para conceder pontos, consultar ranking, pausar, ativar, encerrar e ocultar ou mostrar o placar.
5. Implementar exportação JSON versionada e CSV UTF-8 sem BOM, com testes de reconciliação e ausência de dados pessoais por padrão.
6. Adicionar testes do serviço de aplicação com repositório em memória e integração real contra D1 local.
7. Criar uma atividade curricular vertical aprovada e conectar rodada, submissão, feedback e pontuação.
8. Somente depois fechar Playwright, acessibilidade automatizada, carga de 18 participantes e ensaio em segundo dispositivo.

O simulado e o banco de 300 questões continuam depois do portal conforme DECISAO-002. Não iniciar geração em massa antes de validar esquema, fluxo de revisão e relatório de cobertura com uma amostra pequena.

## 6. Comandos de retomada

No PowerShell, a partir da raiz do projeto:

```powershell
npm ci
npm run db:migrate:local
npm run validate
.\iniciar.bat
```

`iniciar.bat` preserva `.dev.vars`, mostra o segredo local no console, aplica migrações, compila e inicia em `http://127.0.0.1:8788`, ouvindo também na interface local configurada. Confirmar o IPv4 correto antes de orientar outro dispositivo. Alteração de firewall depende de autorização e não deve ser automatizada silenciosamente.

## 7. Estado do Git e cautelas

`git status --short` retornou 26 entradas, todas não rastreadas. Não existe commit de checkpoint. A nova sessão deve preservar todos os arquivos e não executar `git clean`, `git reset --hard`, `git checkout --` ou remoção recursiva. O PDF e o prompt inicial são entradas do usuário e não podem ser modificados.

O arquivo `.dev.vars` não apareceu no status porque está corretamente ignorado. `node_modules`, `dist` e `.wrangler` também são locais. `package-lock.json` deve ser preservado para reproduzir as versões aprovadas. O aviso transitivo de `glob` foi rastreado a `vite-plugin-pwa -> workbox-build`; `npm audit` retornou zero vulnerabilidades no momento da instalação.

## 8. Pendências e bloqueios reais

- A conta Cloudflare, o identificador remoto do D1 e a autorização de publicação não foram fornecidos.
- Autenticação docente de produção e política de retenção continuam abertas.
- Não há regra aprovada de desempate, bônus temporal ou prazo de retenção.
- Não há atividades aprovadas, questões, simulado funcional, certificado simbólico, relatórios ou guia operacional final.
- Não há prova de LAN por segundo dispositivo, Playwright, auditoria automatizada de acessibilidade ou teste de carga.
- Repositórios externos encontrados permanecem apenas referências; nenhuma licença foi validada para incorporação.

## 9. Critério de retomada segura

A nova sessão deve ler este handoff, o handoff anterior, `AGENTS.md` e os documentos de governança antes de editar. Depois deve executar `npm run validate` e confirmar código 0. A continuidade permanece autônoma, sem pedir aprovação por arquivo, mas deve parar diante de credencial externa, política de dados, publicação ou outra escolha que amplie autoridade. O estado atual é `M1-PORTAL_EM_EXECUCAO`, não `CONCLUIDO`.
