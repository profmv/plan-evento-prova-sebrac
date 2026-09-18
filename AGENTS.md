> Resumo: este contrato orienta agentes que pesquisam, documentam, implementam, testam e operam o Recap SENAC 2026 e seu simulado, preservando escopo, rastreabilidade curricular, simplicidade tecnica e evidencias verificaveis.

# AGENTS.md

```xml
<contrato-projeto versao="1.0" idioma="pt-BR">
  <identidade>
    <nome>Recap SENAC 2026</nome>
    <raiz>C:\Repo\Ensino-Educacao\PLANEJAMENTO\plan-evento-prova-sebrac</raiz>
    <publico>Turma 001 do curso Tecnico em Informatica, inicialmente com 18 alunos</publico>
    <objetivo>Preparar os alunos para uma avaliacao geral por meio de atividades colaborativas, pratica de recuperacao, feedback explicativo e um simulado curricular.</objetivo>
    <prioridade-atual>Entregar primeiro o portal de atividades em equipe; entregar depois o simulado para aplicacao por outro professor.</prioridade-atual>
  </identidade>

  <fontes-autoridade ordem="decrescente">
    <fonte id="A01">Instrucoes de sistema e do ambiente de execucao.</fonte>
    <fonte id="A02">Solicitacao atual e decisoes explicitas do usuario.</fonte>
    <fonte id="A03">Este AGENTS.md e contratos locais mais especificos.</fonte>
    <fonte id="A04">docs/02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf.</fonte>
    <fonte id="A05">docs/01_prompt-inicial/prompt.md.</fonte>
    <fonte id="A06">Documentacao oficial das tecnologias selecionadas.</fonte>
    <fonte id="A07">Referencias externas, repositorios e materiais pedagogicos, sujeitos a validacao de autoria, atualidade e licenca.</fonte>
  </fontes-autoridade>

  <leis>
    <lei id="L-01" nome="Pensar antes de alterar">Declare premissas relevantes, exponha ambiguidades e compare consequencias antes de escolher uma interpretacao que altere arquitetura, escopo, dados, cronograma ou experiencia pedagogica.</lei>
    <lei id="L-02" nome="Simplicidade primeiro">Implemente a menor solucao capaz de cumprir os criterios de aceite. Nao crie abstracoes para um unico uso, extensibilidade especulativa, configuracoes sem consumidor ou camadas sem responsabilidade verificavel.</lei>
    <lei id="L-03" nome="Mudancas cirurgicas">Cada linha modificada deve ser rastreavel ao pedido atual, a um requisito aprovado ou a uma correcao necessaria para manter a alteracao funcional. Nao reformate, renomeie ou refatore codigo adjacente sem necessidade.</lei>
    <lei id="L-04" nome="Execucao orientada a objetivos">Antes de implementar, converta o pedido em resultados observaveis e respectivas verificacoes. Continue ate que cada resultado esteja comprovado, bloqueado por dependencia externa ou recusado explicitamente pelo usuario.</lei>
    <lei id="L-05" nome="Uma unidade por iteracao">Durante a Fase 3, gere somente um documento ou modulo por vez. Ao concluir e validar a unidade, informe o resultado e aguarde autorizacao para a proxima unidade.</lei>
    <lei id="L-06" nome="Limite do projeto">Escritas sao permitidas somente dentro da raiz declarada. Leituras externas sao permitidas quando necessarias para pesquisa, governanca, documentacao oficial ou descoberta de recursos reutilizaveis.</lei>
    <lei id="L-07" nome="Preservacao do trabalho existente">Considere arquivos e alteracoes preexistentes como propriedade do usuario. Nao descarte, sobrescreva ou reverta alteracoes que nao tenham sido produzidas pela tarefa corrente.</lei>
    <lei id="L-08" nome="Curriculo como restricao">Toda pergunta, explicacao e atividade deve apontar para pelo menos uma unidade curricular, um conhecimento, uma habilidade ou um indicador verificavel no plano do curso.</lei>
    <lei id="L-09" nome="Sem fabricacao">Nao invente conteudo curricular, resultado de teste, evidencia, licenca, fonte, comando executado ou comportamento da aplicacao. Use o estado [UNVERIFIED] quando a comprovacao ainda nao existir.</lei>
    <lei id="L-10" nome="Fontes e licencas">Antes de incorporar codigo, imagem, audio, questao ou atividade externa, registre origem, licenca, obrigacoes de atribuicao, compatibilidade de uso e decisao de adocao.</lei>
    <lei id="L-11" nome="Privacidade por padrao">Identifique participantes por equipe. Nomes individuais sao opcionais, limitados a finalidade pedagogica da sessao e nunca devem ser publicados em repositorios, artefatos de teste ou paginas acessiveis sem controle.</lei>
    <lei id="L-12" nome="Acessibilidade funcional">Toda tarefa essencial deve operar por teclado, possuir rotulo textual, indicar estado sem depender apenas de cor e permanecer utilizavel sem animacao, audio ou gesto de arrastar.</lei>
    <lei id="L-13" nome="Explicacao pedagogica">Toda questao objetiva deve possuir resposta esperada, explicacao do motivo, referencia curricular e justificativa para alternativas incorretas quando aplicavel.</lei>
    <lei id="L-14" nome="Aleatoriedade testavel">A ordem de perguntas e alternativas pode variar, mas o vinculo entre alternativa e correcao deve permanecer invariavel. Testes devem cobrir repeticao, distribuicao, reproducao por semente e preservacao da resposta correta.</lei>
    <lei id="L-15" nome="Pontuacao auditavel">Toda mudanca de pontos deve registrar sessao, equipe, atividade, motivo, valor, horario e origem automatica ou manual. Reenvios nao podem duplicar pontos.</lei>
    <lei id="L-16" nome="Contingencia real">O portal deve ter caminho de operacao em rede local e materiais de continuidade para indisponibilidade da Internet. Uma promessa de modo offline sem teste em condicao equivalente deve ser marcada [UNVERIFIED].</lei>
    <lei id="L-17" nome="Verificacao proporcional">Execute testes unitarios, integrados, ponta a ponta, acessibilidade, compilacao e verificacao de tipos conforme a superficie alterada. Uma unidade nao esta concluida enquanto a verificacao relevante nao tiver resultado registrado.</lei>
    <lei id="L-18" nome="Falha visivel">Nao suprima assercoes, nao transforme erro em sucesso e nao omita saida relevante. Depois de tres falhas consecutivas da mesma hipotese, registre [FAIL], preserve evidencias e devolva o controle ao usuario.</lei>
    <lei id="L-19" nome="Estado rastreavel">Decisoes, riscos, fatos, provas, resultados, aprendizados e handoffs devem ser registrados nos locais definidos neste contrato, com identificadores estaveis e ligacoes para evidencias.</lei>
    <lei id="L-20" nome="Comunicacao objetiva">Relate resultado, verificacao, risco residual e proxima decisao. Evite introducoes sociais, afirmacoes promocionais e detalhes de ferramenta que nao ajudem o usuario a verificar o trabalho.</lei>
  </leis>

  <arquitetura>
    <estilo>Monolito modular orientado a funcionalidades.</estilo>
    <frontend>React, TypeScript e Vite, com capacidade PWA.</frontend>
    <publicacao>Cloudflare Pages como destino principal.</publicacao>
    <backend>Cloudflare Pages Functions em TypeScript.</backend>
    <persistencia>D1 no ambiente publicado e persistencia local fornecida pelo Wrangler durante operacao em rede local.</persistencia>
    <validacao>Esquemas compartilhados entre cliente, API, conteudo e testes.</validacao>
    <modulos>
      <modulo nome="recap">Sessoes, equipes, rodadas, desafios, respostas e ranking.</modulo>
      <modulo nome="simulado">Banco de perguntas, tentativas, sorteio, correcao, explicacoes e retomada de erros.</modulo>
      <modulo nome="content">Taxonomia curricular, carregamento, validacao e versionamento de conteudo.</modulo>
      <modulo nome="reporting">Evidencias de aprendizagem e exportacoes CSV e JSON.</modulo>
      <modulo nome="administration">Controles reservados ao professor.</modulo>
      <modulo nome="shared">Contratos, componentes e utilitarios comprovadamente compartilhados.</modulo>
    </modulos>
    <padroes>
      <padrao>Feature Modules para limitar acoplamento entre dominios.</padrao>
      <padrao>Repository para isolar D1, persistencia local e dublês de teste.</padrao>
      <padrao>Service Layer para regras de pontuacao, progressao, sorteio e correcao.</padrao>
      <padrao>State Machine para estados de sessao, rodada, desafio e tentativa.</padrao>
      <padrao>Strategy para tipos de atividade que compartilham contrato de avaliacao.</padrao>
      <padrao>Adapter para manter a regra de negocio independente do ambiente publicado ou local.</padrao>
      <padrao>Event Log para auditoria de pontuacao e intervencoes do professor.</padrao>
    </padroes>
  </arquitetura>

  <cobertura-curricular>
    <eixo id="E01" nome="Suporte e manutencao" unidades="UC01,UC02,UC03,UC04" carga-horaria="272" minimo-questoes="100" />
    <eixo id="E02" nome="Redes e servidores" unidades="UC05,UC06,UC07,UC08" carga-horaria="308" minimo-questoes="100" />
    <eixo id="E03" nome="Desenvolvimento de aplicativos" unidades="UC09,UC10,UC11,UC12,UC13,UC14,UC15,UC16" carga-horaria="620" minimo-questoes="100" />
    <regra-cobertura>Dentro de cada eixo, distribua questoes e atividades pelas unidades curriculares e seus elementos de competencia. Nao considere o minimo quantitativo como prova de qualidade ou cobertura.</regra-cobertura>
  </cobertura-curricular>

  <estrutura-e-propriedade>
    <caminho nome=".agents/">Exclusivo para BRIEFING.md, DISPATCH.md, plan.md, progress.md e handoff.md. Nao armazene entregaveis ou logs neste diretorio.</caminho>
    <caminho nome="artifacts/">Entregaveis gerados, relatorios, resultados de validacao, logs transitorios e scripts temporarios de teste.</caminho>
    <caminho nome="data/course/">Representacao estruturada e rastreavel do plano de curso.</caminho>
    <caminho nome="data/question-bank/">Bancos versionados de questoes, separados de codigo executavel.</caminho>
    <caminho nome="data/activities/">Definicoes declarativas das atividades do portal.</caminho>
    <caminho nome="data/schemas/">Esquemas de intercambio e validacao dos dados de conteudo.</caminho>
    <caminho nome="docs/00_governanca/">Decisoes, riscos, rastreabilidade, provas e licencas.</caminho>
    <caminho nome="docs/01_pesquisa-planejamento/">Briefing, inventario curricular, referencias, reuso, desenho pedagogico e requisitos.</caminho>
    <caminho nome="docs/02_definicao-construcao/">Arquitetura, jornadas, especificacoes, conteudo, ranking, acessibilidade e privacidade.</caminho>
    <caminho nome="docs/03_implementacao-execucao/">Plano de implementacao, publicacao de conteudo e operacao local.</caminho>
    <caminho nome="docs/04_testes/">Estrategia, casos, resultados e aceite.</caminho>
    <caminho nome="docs/05_operacao-aula/">Roteiro, guias, contingencia e pos-aula.</caminho>
    <caminho nome="docs/handoff/">Handoffs preservados no formato handoff_NNN.md, usando o proximo numero disponivel.</caminho>
    <caminho nome="functions/">Rotas de API e middleware; nenhuma regra pedagogica central deve ficar presa ao adaptador HTTP.</caminho>
    <caminho nome="migrations/">Migracoes append-only do banco. Uma migracao aplicada nao deve ser reescrita.</caminho>
    <caminho nome="src/">Aplicacao dividida pelos modulos declarados na arquitetura.</caminho>
    <caminho nome="tests/">Testes unitarios, integrados, ponta a ponta e de acessibilidade.</caminho>
  </estrutura-e-propriedade>

  <governanca>
    <estado valor="[OK]">Criterio comprovado por evidencia reproduzivel.</estado>
    <estado valor="[FAIL]">Criterio executado e reprovado, com impacto registrado.</estado>
    <estado valor="[PENDING]">Trabalho previsto e ainda nao executado.</estado>
    <estado valor="[UNVERIFIED]">Afirmacao sem prova suficiente.</estado>
    <estado valor="[INFERENCIA]">Conclusao derivada de fatos identificados.</estado>
    <estado valor="[MEDIDO]">Valor obtido por instrumento ou comando identificado.</estado>
    <estado valor="[ESTIMADO]">Valor calculado por premissas declaradas.</estado>
    <registro tipo="FATO">Dado observado, com fonte, data e evidencia.</registro>
    <registro tipo="DECISAO">Escolha, contexto, alternativas, justificativa e consequencias.</registro>
    <registro tipo="RISCO">Evento, probabilidade, impacto, mitigacao, responsavel e estado.</registro>
    <registro tipo="PROVA">Afirmacao, procedimento de verificacao, resultado e local da evidencia.</registro>
    <registro tipo="LICAO">Conhecimento reutilizavel obtido de falha, correcao ou validacao.</registro>
  </governanca>

  <qualidade>
    <porta id="Q01">Todos os arquivos de texto em UTF-8 sem BOM e com terminacoes de linha consistentes.</porta>
    <porta id="Q02">TypeScript compila sem erros e sem supressoes injustificadas.</porta>
    <porta id="Q03">Lint e verificacao de formatacao passam.</porta>
    <porta id="Q04">Testes afetados passam; a ausencia de teste aplicavel e documentada.</porta>
    <porta id="Q05">Fluxos criticos passam em teste ponta a ponta: criar sessao, entrar em equipe, responder, pontuar, encerrar e exportar.</porta>
    <porta id="Q06">Acessibilidade automatizada e navegacao por teclado passam nos fluxos essenciais.</porta>
    <porta id="Q07">Build de producao termina com codigo zero.</porta>
    <porta id="Q08">Modo publicado e modo local usam os mesmos contratos de dominio.</porta>
    <porta id="Q09">Nenhum segredo, nome de aluno ou dado pessoal aparece no repositorio ou em artefatos publicos.</porta>
    <porta id="Q10">O registro PROVA aponta para comandos, saidas ou arquivos realmente existentes.</porta>
  </qualidade>

  <seguranca-e-dados>
    <regra>O professor controla abertura, inicio, pausa, encerramento e ajustes de pontuacao da sessao.</regra>
    <regra>Alunos entram por codigo de sessao e equipe; nao ha necessidade inicial de conta permanente.</regra>
    <regra>Entradas recebidas pela API devem ser validadas no limite do sistema.</regra>
    <regra>Operacoes de pontuacao devem ser autenticadas, autorizadas e idempotentes.</regra>
    <regra>Erros apresentados ao usuario nao devem revelar configuracao, consulta, stack trace ou segredo.</regra>
    <regra>Dados de sessao devem possuir politica explicita de retencao e exclusao.</regra>
  </seguranca-e-dados>

  <windows-e-execucao>
    <regra>Scripts interativos baseados em runtime interpretado devem possuir launcher .bat na raiz.</regra>
    <regra>Todo launcher .bat deve ser UTF-8 sem BOM, iniciar por @echo off e repassar argumentos com %*.</regra>
    <regra>Comandos fornecidos ao usuario devem usar PowerShell, salvo justificativa tecnica explicita.</regra>
    <regra>Nao reutilize HOME, home ou CODEX_HOME como variavel de tarefa.</regra>
  </windows-e-execucao>

  <fluxo-de-trabalho>
    <passo ordem="1">Ler o pedido, este contrato e as instrucoes mais proximas do arquivo-alvo.</passo>
    <passo ordem="2">Inspecionar estado do repositorio e preservar alteracoes existentes.</passo>
    <passo ordem="3">Localizar dados, documentacao oficial e skills aplicaveis antes de criar uma solucao equivalente.</passo>
    <passo ordem="4">Definir objetivo verificavel, arquivos afetados, riscos e testes.</passo>
    <passo ordem="5">Implementar uma unica unidade aprovada com mudancas minimas e completas.</passo>
    <passo ordem="6">Executar as portas de qualidade proporcionais a unidade.</passo>
    <passo ordem="7">Registrar decisoes, riscos, provas, resultados e licoes aplicaveis.</passo>
    <passo ordem="8">Informar resultado, falhas, risco residual e proxima unidade proposta.</passo>
  </fluxo-de-trabalho>

  <conclusao>
    <criterio>Uma tarefa so pode ser declarada concluida quando seus criterios de aceite estiverem ligados a evidencias, os testes aplicaveis tiverem sido executados e nenhum trabalho necessario permanecer oculto.</criterio>
    <criterio>Se uma dependencia externa impedir a conclusao, registre exatamente o que falta, o impacto e a menor acao necessaria do usuario.</criterio>
    <criterio>Nao confunda arquivo criado, comando executado ou build iniciado com resultado funcional validado.</criterio>
  </conclusao>
</contrato-projeto>
```
