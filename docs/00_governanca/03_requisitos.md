> Resumo: esta especificação transforma o prompt, as confirmações do usuário, o plano curricular e as decisões aprovadas em requisitos verificáveis para o portal Recap SENAC 2026 e para o simulado. Requisitos obrigatórios usam critérios observáveis; pontos ainda dependentes do professor permanecem parâmetros ou pendências explícitas.

# Especificação de requisitos

```json
{"id":"DOC-GOV-003","tipo":"especificacao-requisitos","versao":"1.0","estado":"ATIVO","idioma":"pt-BR","data_base":"2026-09-18","fontes":["../01_prompt-inicial/prompt.md","../02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf","00_visao-geral.md","01_decisoes.md","02_riscos.md"]}
```

Documentos relacionados: [prompt inicial](../01_prompt-inicial/prompt.md), [plano de curso](../02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf), [visão geral](./00_visao-geral.md), [decisões](./01_decisoes.md) e [riscos](./02_riscos.md).

## 1. Convenções normativas

`DEVE` e `NÃO DEVE` indicam obrigação necessária ao aceite. `DEVERIA` indica comportamento esperado que pode ser alterado pelo professor sem descaracterizar o produto. `PODE` indica capacidade opcional. Cada requisito possui identificador estável, origem, verificação e estado de evidência. O estado inicial `ESPECIFICADO` confirma apenas que a obrigação foi definida; não afirma implementação.

As origens são abreviadas como `PROMPT`, para o pedido original; `USUARIO`, para respostas posteriores; `PCN`, para o plano de curso fornecido; e `DECISAO-nnn`, para escolha registrada. Um requisito pode ter mais de uma origem. Critérios que dependem de rede, credencial ou decisão operacional possuem condição explícita e não serão declarados atendidos por simulação isolada.

O produto possui dois marcos. `M1-PORTAL` entrega uma experiência coletiva vertical do portal, incluindo sessão, equipe, desafio, pontuação, ranking, relatório e operação documentada. `M2-SIMULADO` acrescenta prática individual ou identificada por sessão, banco curricular completo e revisão de erros. A prioridade entre os marcos não reduz o escopo final.

## 2. Atores, contexto e parâmetros

| Ator | Responsabilidade e limite |
|---|---|
| Professor responsável | Configura sessão, equipes, conteúdo, regras visíveis, pontuação, exportação e encerramento. Não deve depender de edição direta no banco. |
| Professor aplicador | Executa roteiro preparado por outra pessoa, observa a turma, aciona contingência e exporta evidências. Não deve precisar conhecer a implementação. |
| Aluno participante | Entra em sessão por código, atua em equipe no portal e realiza prática no simulado. Não recebe privilégio administrativo. |
| Equipe | Identidade competitiva principal do portal e unidade padrão do ranking projetado. |
| Revisor curricular | Confirma vínculo com eixo e UC, clareza, resposta e explicação antes de o item ser considerado válido. |
| Responsável técnico | Mantém aplicação, migrações, implantação, testes e diagnóstico, sem decidir sozinho políticas pedagógicas ou de retenção. |

Parâmetros iniciais confirmados: turma com 18 alunos, duração de três horas, três eixos profissionais, 16 UCs, ranking prioritariamente por equipe e publicação na Internet com contingência local. Seis equipes de três participantes constituem uma configuração inicial derivada, não uma imposição: o professor DEVE poder alterar quantidade, nomes e distribuição antes de iniciar a sessão.

Continuam dependentes de definição operacional: mecanismo final de autenticação do professor, prazo de retenção, regra padrão de desempate, política de bônus por tempo, limite de tentativas, duração do simulado e data confirmada da aplicação por outro professor. A implementação poderá oferecer campos e opções seguras, mas não deverá gravar como regra institucional um valor que não foi aprovado.

## 3. Requisitos funcionais do portal

| ID | Requisito obrigatório | Origem | Verificação |
|---|---|---|---|
| RF-PORTAL-001 | O sistema DEVE permitir ao professor criar uma sessão e receber código curto de entrada sem expor segredo administrativo. | PROMPT, DECISAO-012 | Teste de integração cria sessão e confirma separação dos códigos. |
| RF-PORTAL-002 | O professor DEVE poder configurar equipes antes do início, com nome exibido, cor acompanhada de texto e estado ativo. | USUARIO, DECISAO-003 | Teste de interface cria, altera e desativa equipe sem ambiguidade por cor. |
| RF-PORTAL-003 | O aluno DEVE entrar com código de sessão e equipe; identificação pessoal será opcional e limitada à sessão. | USUARIO, DECISAO-012 | Fluxo ponta a ponta funciona com e sem identificação. |
| RF-PORTAL-004 | A tela pública DEVE exibir equipes e NÃO DEVE exibir desempenho individual. | USUARIO, DECISAO-003 | Inspeção automatizada e manual da tela projetada. |
| RF-PORTAL-005 | O professor DEVE selecionar desafios por eixo, UC, tipo e dificuldade antes ou durante a sessão. | PROMPT, PCN | Teste filtra catálogo e inicia desafio escolhido. |
| RF-PORTAL-006 | Cada desafio DEVE apresentar objetivo, instruções, tempo sugerido, materiais, evidência esperada e regra de pontuação. | PROMPT | Validação de esquema rejeita desafio incompleto. |
| RF-PORTAL-007 | O catálogo DEVE admitir quiz, resolução de problema, pequeno projeto, apresentação rápida e atividade interativa. | PROMPT | Um exemplo válido de cada tipo passa pelo esquema e é renderizado. |
| RF-PORTAL-008 | O portal DEVE incluir ao menos um caminho utilizável de hardware, um de redes, um de banco de dados e um de lógica ou desenvolvimento no primeiro marco. | PROMPT, PCN | Teste de catálogo e execução dos quatro caminhos. |
| RF-PORTAL-009 | A aplicação DEVE registrar início, submissão, avaliação e encerramento de desafio com sessão, equipe e horário. | DECISAO-013 | Consulta e exportação reconstroem o histórico. |
| RF-PORTAL-010 | Pontos automáticos ou manuais DEVEM ser eventos idempotentes; ajuste manual DEVE exigir motivo. | DECISAO-013 | Reenvio não duplica efeito e ajuste aparece na trilha. |
| RF-PORTAL-011 | O ranking DEVE derivar dos eventos válidos e ordenar equipes por regra determinística e visível. | USUARIO, RISCO-016 | Testes de empate e reconstrução do total. |
| RF-PORTAL-012 | O professor DEVE poder ocultar e reexibir o ranking sem interromper a sessão. | RISCO-004 | Teste de interface preserva pontuação com ranking oculto. |
| RF-PORTAL-013 | Atualizações do ranking DEVEM chegar aos participantes sem recarregar a sessão inteira ou perder respostas. | PROMPT | Teste com dois clientes observa atualização e reconciliação. |
| RF-PORTAL-014 | O professor DEVE poder pausar entrada, encerrar rodada e encerrar sessão. | Operação | Testes negativos impedem novas ações no estado correspondente. |
| RF-PORTAL-015 | O sistema DEVE fornecer feedback da rodada e ligação explícita com eixo e UCs trabalhadas. | PCN | Interface e exportação exibem classificações corretas. |
| RF-PORTAL-016 | O professor DEVE poder conceder reconhecimento simbólico de participação ou destaque por equipe. | PROMPT, RISCO-021 | Artefato é gerado sem alegar certificação formal. |
| RF-PORTAL-017 | O reconhecimento DEVE funcionar sem nome de aluno e ser desativável. | DECISAO-003, RISCO-021 | Teste gera versão por equipe e sessão. |
| RF-PORTAL-018 | O portal DEVE manter indicação inequívoca de ambiente local ou publicado e versão da aplicação. | RISCO-022 | Cabeçalho administrativo mostra ambiente e versão. |
| RF-PORTAL-019 | O professor DEVE poder reiniciar uma atividade sem reutilizar indevidamente eventos da tentativa anterior. | Integridade | Teste confirma novo identificador de rodada e totais coerentes. |
| RF-PORTAL-020 | A aplicação DEVE preservar a sessão após atualização do navegador dentro de sua validade. | Operação | Teste ponta a ponta atualiza os clientes e recupera estado. |

## 4. Requisitos funcionais do simulado

| ID | Requisito obrigatório | Origem | Verificação |
|---|---|---|---|
| RF-SIM-001 | O simulado DEVE criar tentativa vinculada a uma sessão e a uma identificação temporária ou pseudônima. | PROMPT, DECISAO-012 | Fluxo funciona sem conta permanente. |
| RF-SIM-002 | O professor DEVE configurar quantidade de questões, eixos, UCs, dificuldade e tipos permitidos. | PROMPT | Testes de seleção respeitam todos os filtros. |
| RF-SIM-003 | O banco inicial DEVE conter ao menos 100 questões válidas por eixo, total mínimo de 300. | PROMPT, DECISAO-006 | Relatório de cobertura conta somente versões aprovadas e não duplicadas. |
| RF-SIM-004 | Toda questão DEVE possuir identificador e versão estáveis, eixo, uma ou mais UCs, dificuldade, tipo, enunciado, correção, explicação e fonte curricular. | DECISAO-011 | Esquema rejeita campo ausente ou referência inválida. |
| RF-SIM-005 | O motor DEVE suportar múltipla escolha com uma resposta correta declarada. | PROMPT | Casos corretos e incorretos produzem avaliação esperada. |
| RF-SIM-006 | O motor DEVE suportar verdadeiro ou falso com justificativa. | PROMPT | Testes dos dois valores e explicação. |
| RF-SIM-007 | O motor DEVE suportar resposta curta por variantes e normalizações declaradas, preservando a entrada original. | PROMPT, DECISAO-014 | Testes positivos, negativos e limítrofes. |
| RF-SIM-008 | Resposta curta fora das regras PODE ficar pendente de revisão; NÃO DEVE ser julgada por correspondência sem critério visível. | RISCO-015 | Caso ambíguo não altera pontuação automaticamente. |
| RF-SIM-009 | A seleção de questões DEVE ser aleatória dentro dos filtros e não repetir item na mesma tentativa. | PROMPT | Teste por semente confirma unicidade e reprodutibilidade. |
| RF-SIM-010 | A ordem das alternativas DEVE variar por tentativa sem alterar a resposta correta. | PROMPT | Teste de propriedade compara permutações e correção. |
| RF-SIM-011 | A ordem das questões DEVE variar quando configurada e ser registrada para auditoria. | PROMPT | Exportação permite reconstruir a apresentação. |
| RF-SIM-012 | O sistema DEVE registrar resposta, resultado e duração por questão sem confiar na pontuação calculada pelo cliente. | Integridade | Teste manipula cliente e confirma autoridade do servidor. |
| RF-SIM-013 | Ao concluir, o aluno DEVE ver corretas, incorretas e pendentes, com explicação de cada item. | PROMPT | Teste ponta a ponta cobre os três estados. |
| RF-SIM-014 | A revisão NÃO DEVE revelar respostas de questões não respondidas se a tentativa ainda puder continuar. | Integridade pedagógica | Teste de estado impede acesso prematuro. |
| RF-SIM-015 | O aluno DEVE poder iniciar nova tentativa contendo somente questões erradas elegíveis da tentativa encerrada. | PROMPT | Teste cria conjunto exato de erros, sem corretas. |
| RF-SIM-016 | A tentativa de reforço DEVE manter referência à tentativa de origem e registrar melhora sem sobrescrever o histórico. | Aprendizagem | Relatório mostra cadeia de tentativas. |
| RF-SIM-017 | O resumo DEVE apresentar acertos por eixo e UC, sem afirmar certificação ou avaliação institucional. | PCN | Teste do cálculo e revisão textual. |
| RF-SIM-018 | O professor DEVE poder invalidar questão problemática para análises futuras sem apagar a resposta histórica. | RISCO-003 | Questão inativa permanece na tentativa antiga e sai de novos sorteios. |
| RF-SIM-019 | O professor aplicador DEVE conseguir iniciar, acompanhar e encerrar o simulado por roteiro documentado. | USUARIO, DECISAO-020 | Teste de seguimento por pessoa que não implementou. |
| RF-SIM-020 | O simulado DEVE operar depois do marco do portal e reutilizar conteúdo, identidade de sessão, relatórios e administração sem duplicar regras. | USUARIO, DECISAO-002 | Análise de dependências e testes compartilhados. |

## 5. Conteúdo, administração e relatórios

| ID | Requisito obrigatório | Origem | Verificação |
|---|---|---|---|
| RF-CONT-001 | Conteúdo DEVE residir em fontes estruturadas versionadas e validadas antes da importação. | DECISAO-011 | Validador falha com diagnóstico preciso. |
| RF-CONT-002 | Os três eixos DEVEM mapear as 16 UCs do plano de curso sem deixar UC órfã. | PCN, DECISAO-006 | Teste da taxonomia e relatório de cobertura. |
| RF-CONT-003 | Mudança de enunciado, correção ou explicação após uso DEVE criar nova versão lógica. | Auditoria | Tentativa histórica continua apontando para versão original. |
| RF-CONT-004 | Item gerado automaticamente NÃO DEVE ser marcado como aprovado sem revisão. | RISCO-002, RISCO-003 | Estado do fluxo impede publicação direta. |
| RF-CONT-005 | Material externo DEVE registrar origem, versão, licença e atribuição exigida antes de incorporação. | DECISAO-018 | Inventário de terceiros e validação de licença. |
| RF-ADM-001 | Operações de professor DEVEM exigir autorização distinta do acesso do aluno. | RISCO-011 | Matriz de testes negativos por rota. |
| RF-ADM-002 | O painel DEVE tornar visíveis ambiente, versão, sessão ativa e estado de persistência. | Operação | Inspeção da tela nos dois ambientes. |
| RF-ADM-003 | Operações destrutivas DEVEM pedir confirmação e respeitar política de retenção aprovada. | RISCO-012 | Teste impede exclusão acidental e registra ação. |
| RF-REL-001 | O professor DEVE exportar sessão em CSV UTF-8 sem BOM com cabeçalhos documentados. | DECISAO-017 | Arquivo abre com acentos e corresponde ao contrato. |
| RF-REL-002 | O professor DEVE exportar sessão em JSON versionado com relações e metadados necessários à auditoria. | DECISAO-017 | Validação por esquema e teste de leitura. |
| RF-REL-003 | Exportações públicas por padrão NÃO DEVEM conter identificação pessoal opcional. | RISCO-020 | Busca automatizada e caso com nome cadastrado. |
| RF-REL-004 | Totais exportados DEVEM ser reconciliáveis com eventos autorizados. | DECISAO-013 | Soma programática coincide com ranking. |
| RF-REL-005 | Relatórios DEVEM distinguir resultado inicial de reforço e item invalidado. | Aprendizagem | Cenários de relatório preservam os estados. |

## 6. Requisitos não funcionais

### 6.1. Acessibilidade e experiência

| ID | Requisito | Critério de aceite |
|---|---|---|
| RNF-ACE-001 | Todos os fluxos essenciais DEVEM ser concluídos por teclado. | Ordem de foco coerente, foco visível e ausência de armadilha em teste manual. |
| RNF-ACE-002 | Informação NÃO DEVE depender apenas de cor, posição, áudio ou animação. | Cada estado possui texto, símbolo ASCII ou semântica adicional. |
| RNF-ACE-003 | Controles DEVEM usar nome acessível, semântica nativa e mensagens associadas ao campo. | Verificação automática sem violação crítica e inspeção por leitor de tela quando disponível. |
| RNF-ACE-004 | Contraste e ampliação DEVEM preservar leitura e operação. | Fluxos críticos funcionam em 200 por cento de ampliação e largura reduzida definida no teste. |
| RNF-ACE-005 | Limite de tempo DEVE ser configurável, pausável ou acompanhado de alternativa equivalente. | Professor consegue ajustar sem editar código. |
| RNF-UX-001 | Entrada do aluno DEVERIA exigir no máximo código, escolha de equipe e identificação opcional. | Fluxo não solicita e-mail, senha permanente ou dado não necessário. |
| RNF-UX-002 | Erros DEVEM explicar o que ocorreu e como recuperar sem apagar dados já aceitos. | Cenários de rede e validação apresentam ação possível. |

### 6.2. Segurança e privacidade

| ID | Requisito | Critério de aceite |
|---|---|---|
| RNF-SEG-001 | O servidor DEVE validar toda entrada e autorização; o cliente não é autoridade. | Testes enviam payload inválido e ação privilegiada sem credencial. |
| RNF-SEG-002 | Segredos NÃO DEVEM estar em código, conteúdo, log, exportação ou repositório. | Varredura de arquivos e inspeção de build. |
| RNF-SEG-003 | Códigos temporários DEVEM ter validade, entropia e limitação de tentativa adequadas ao evento. | Testes de expiração e abuso conforme política técnica documentada. |
| RNF-SEG-004 | A aplicação DEVE minimizar dados pessoais e separar dados de teste de dados reais. | Fixtures anônimas e inventário de campos. |
| RNF-SEG-005 | A política de retenção DEVE ser aprovada antes de coletar nome ou resposta individual em produção. | Portão de publicação falha enquanto a política estiver indefinida. |
| RNF-SEG-006 | Logs DEVEM permitir diagnóstico sem registrar segredo ou conteúdo pessoal desnecessário. | Testes e inspeção de amostra de log. |

### 6.3. Confiabilidade, desempenho e portabilidade

| ID | Requisito | Critério de aceite |
|---|---|---|
| RNF-CON-001 | Comandos que alteram pontuação DEVEM ser idempotentes. | Dez reenvios iguais produzem um efeito. |
| RNF-CON-002 | O sistema DEVE suportar ao menos 18 participantes ativos e margem de teste documentada. | Teste concorrente com reconciliação integral e sem erro de servidor. |
| RNF-CON-003 | Falha transitória NÃO DEVE perder resposta já confirmada. | Teste de reconexão compara recibo e evento persistido. |
| RNF-CON-004 | Ranking DEVE ser determinístico para o mesmo conjunto de eventos. | Reprocessamentos produzem ordem idêntica ou empate explícito. |
| RNF-DES-001 | A interface de aluno DEVERIA responder em até dois segundos no percentil 95 sob a carga de teste, excluído primeiro carregamento de rede externa. | Medição local e publicada documentada; limite poderá ser revisto com evidência. |
| RNF-DES-002 | Atualização do placar DEVERIA aparecer em até cinco segundos sob a carga de teste. | Teste com relógio controlado; degradação mostra estado de atualização. |
| RNF-POR-001 | A mesma base DEVE gerar build publicado e operação local suportada. | Pipeline e launcher executam versões equivalentes. |
| RNF-POR-002 | Migrações DEVEM funcionar em D1 remoto e na persistência local do Wrangler. | Banco limpo e banco atualizado passam pelo teste. |
| RNF-POR-003 | Exportações DEVEM permanecer legíveis fora do provedor. | CSV e JSON passam por validadores independentes. |

### 6.4. Manutenibilidade e qualidade

| ID | Requisito | Critério de aceite |
|---|---|---|
| RNF-MAN-001 | O código DEVE respeitar os seis módulos e contratos públicos aprovados. | Regra de lint ou teste de arquitetura detecta importação proibida. |
| RNF-MAN-002 | TypeScript DEVE operar em modo estrito e sem supressão não justificada. | Compilação sem erro; exceção registrada com motivo. |
| RNF-MAN-003 | Conteúdo DEVE ser validado em runtime por esquema versionado. | Testes de contrato e diagnósticos por campo. |
| RNF-QLD-001 | Regras puras DEVEM possuir testes unitários; componentes críticos, testes de interação; API e banco, integração; fluxos principais, ponta a ponta. | Matriz requisito-teste sem lacuna crítica. |
| RNF-QLD-002 | Verificações de acessibilidade DEVEM integrar a suíte e ser complementadas por roteiro manual. | Relatório automático e checklist versionado. |
| RNF-QLD-003 | Build, testes e validação de conteúdo DEVEM falhar de forma visível; não podem mascarar erro para obter código zero. | Injeção controlada de erro comprova falha. |
| RNF-DOC-001 | Todo documento DEVE começar com resumo e manter links, IDs e codificação válidos. | Validador de documentação. |
| RNF-DOC-002 | A operação Windows interpretada DEVE possuir launcher `.bat` na raiz, iniciado por `@echo off` e repassando `%*`. | Inspeção do arquivo e execução com argumento de ajuda. |

## 7. Regras de negócio

`RB-001`: uma equipe pertence a uma sessão; eventos de sessões diferentes nunca se somam. `RB-002`: uma rodada pertence a uma atividade e a uma sessão. `RB-003`: o total da equipe é a soma dos eventos válidos, incluindo compensações, e não um valor editável isoladamente. `RB-004`: a mesma chave idempotente dentro do mesmo escopo produz a mesma resposta e um único efeito. `RB-005`: questão invalidada não entra em novo sorteio, mas continua explicável em tentativa histórica. `RB-006`: revisão de erros cria nova tentativa relacionada e não modifica a original. `RB-007`: somente conteúdo em estado aprovado participa de sorteio ou atividade publicada. `RB-008`: nome individual opcional nunca substitui a equipe na tela pública do portal. `RB-009`: exportação possui versão e horário; qualquer importação futura deve verificar ambos. `RB-010`: empate sem regra aprovada permanece empate.

O tempo pode influenciar dinâmica ou relatório, mas bônus ou desempate temporal permanecem desativados até regra aprovada. A pontuação máxima e critérios de avaliação devem estar visíveis antes do desafio. Ajuste manual deve ser compensatório, motivado e atribuível ao papel administrativo. O sistema não deve afirmar que um aluno dominou uma competência apenas por acertar uma questão; relatórios representam evidências da atividade, não certificação profissional.

## 8. Cenários de aceite prioritários

### CA-001 - Portal publicado com duas equipes

O professor cria sessão, configura duas equipes e inicia um quiz. Dois clientes entram sem conta permanente. Cada equipe envia resposta, recebe feedback e um único evento de pontuação. A tela pública mostra apenas equipes, o ranking atualiza e o professor exporta CSV e JSON. Recarregar um cliente não duplica resposta nem perde sessão.

### CA-002 - Reenvio idempotente

O mesmo comando de pontuação é enviado dez vezes, inclusive em paralelo. A API retorna resultado coerente, o armazenamento possui um efeito, o total coincide com os eventos e a trilha permite identificar a operação. Chaves diferentes produzem efeitos separados apenas quando autorizados.

### CA-003 - Contingência local sem Internet

Com a Internet indisponível, o professor inicia o launcher na raiz. Outro dispositivo da mesma rede abre a aplicação, entra na sessão, conclui atividade e observa ranking. Após reinício controlado, a sessão permanece. O professor exporta os resultados sem baixar dependência durante o ensaio.

### CA-004 - Simulado e reforço

Uma tentativa sorteia questões de tipos diferentes sem repetição, varia a ordem, registra respostas e encerra. O resumo explica corretas, incorretas e pendentes. O aluno inicia reforço somente com erros elegíveis; a nova tentativa aponta para a original e o relatório separa os resultados.

### CA-005 - Privacidade e autorização

Um aluno tenta chamar todas as rotas administrativas e recebe negação sem revelar segredo. Um nome opcional inserido na sessão não aparece no placar projetado nem na exportação pública padrão. Logs e erros não contêm o nome ou a credencial. O professor autorizado consegue a exportação administrativa conforme perfil.

### CA-006 - Conteúdo inválido

O pipeline recebe item sem UC, alternativa duplicada, resposta incompatível, licença ausente para material externo e identificador repetido. Cada caso falha com diagnóstico localizável. Nenhum item inválido entra no catálogo ou conta para o mínimo de 300.

### CA-007 - Acessibilidade essencial

Aluno entra, navega, responde e recebe feedback usando teclado e ampliação. O foco permanece perceptível, mensagens são anunciáveis, tempo pode ser ajustado e nenhuma informação depende apenas de cor. Uma atividade de arrastar possui alternativa por seleção ou teclado com efeito equivalente.

### CA-008 - Transferência para outro professor

Uma pessoa que não implementou o produto segue o guia para iniciar, acompanhar, encerrar, exportar e acionar contingência. Dúvidas observadas geram correção documental. O cenário só passa quando não houver instrução oral indispensável.

## 9. Matriz de cobertura por marco

| Capacidade | M1-PORTAL | M2-SIMULADO | Evidência mínima |
|---|---|---|---|
| Sessão e acesso temporário | Completa | Reutilizada | CA-001 e testes de autorização |
| Equipes e ranking | Completa | Opcional na visão reservada | CA-001 e CA-002 |
| Catálogo curricular | Subconjunto vertical | Banco completo de 300 | Validação e relatório de cobertura |
| Tipos interativos | Pelo menos quatro caminhos temáticos | Três tipos de questão | Testes de esquema e interface |
| Feedback explicativo | Por desafio | Por questão | Teste de conteúdo e CA-004 |
| Exportação | CSV e JSON | Acrescida de tentativas | Reconciliação e validação de formato |
| Operação local | Completa para o portal | Estendida ao simulado | CA-003 |
| Documentação do aplicador | Guia do portal | Guia completo do simulado | CA-008 |

## 10. Rastreabilidade e porta de saída

Cada requisito implementado deverá apontar para código, teste e prova. A matriz de rastreabilidade poderá começar em documento próprio, mas não pode depender de memória do implementador. Requisitos de conteúdo apontarão também para eixo e UC; requisitos operacionais apontarão para ensaio; requisitos de segurança apontarão para caso negativo.

Esta especificação estará pronta para orientar implementação quando: todos os IDs forem únicos; origens e verificações estiverem presentes; links resolverem; metadados forem válidos; codificação estiver correta; os pontos não decididos continuarem identificados; e não existir contradição com as decisões ativas. Estar pronta para implementação não significa que os requisitos foram atendidos. O estado de atendimento será alterado somente por evidência executada.

## 11. Provas de integridade desta especificação

| ID | Estado | Afirmação | Evidência esperada |
|---|---|---|---|
| PROVA-REQ-001 | [OK] | Todos os IDs de requisitos são únicos. | Extração programática encontrou 101 definições e 101 identificadores únicos. |
| PROVA-REQ-002 | [OK] | Metadados JSON e cinco links relacionados são válidos. | Parse e resolução de cinco caminhos executados em 2026-09-18. |
| PROVA-REQ-003 | [OK] | O arquivo usa UTF-8 sem BOM, LF e não contém pictogramas. | Inspeção de bytes e caracteres executada em 2026-09-18. |
| PROVA-REQ-004 | [OK] | A especificação possui pelo menos 1.500 palavras e começa com resumo. | Contagem inicial encontrou 3.911 palavras e resumo na primeira linha. |
| PROVA-REQ-005 | [OK] | O diff não contém erro de espaço em branco. | `git diff --check` concluído com código 0 em 2026-09-18. |
