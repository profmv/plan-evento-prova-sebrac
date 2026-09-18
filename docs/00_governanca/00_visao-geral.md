> Resumo: o Recap SENAC 2026 e uma solucao educacional completa para revisar as competencias do curso Tecnico em Informatica por meio de atividades colaborativas e de um simulado com feedback explicativo. O portal de equipes e a primeira entrega operacional; o simulado sera entregue em seguida para aplicacao por outro professor na segunda-feira, 21 de setembro de 2026.

# Visao geral do projeto Recap SENAC 2026

```json
{"id":"DOC-GOV-000","tipo":"visao-geral","versao":"1.0","estado":"APROVADO_COM_VALIDACOES_PENDENTES","idioma":"pt-BR","data_base":"2026-09-18","publico_inicial":"Turma 001, 18 alunos","responsavel_negocio":"Professor solicitante","fontes_primarias":["../01_prompt-inicial/prompt.md","../02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf","../../AGENTS.md"]}
```

## 1. Finalidade do documento

Este documento estabelece a visao comum do projeto antes da producao das especificacoes funcionais, do conteudo curricular e do codigo. Ele fixa o problema a resolver, os resultados esperados, os limites do escopo, os participantes, as restricoes conhecidas, os criterios de sucesso e as decisoes ja aprovadas. As especificacoes posteriores podem detalhar esta visao, mas nao podem contradize-la sem uma nova decisao registrada.

A visao geral nao substitui o plano de curso, o documento de requisitos, a arquitetura tecnica, a estrategia de testes ou o roteiro da aula. Sua funcao e conectar esses artefatos a uma finalidade unica: aumentar a preparacao dos alunos para uma prova de conhecimentos gerais, cobrindo o percurso formativo do curso com atividades acessiveis, verificaveis e pedagogicamente justificadas.

## 2. Contexto

O solicitante atua como professor no SENAC e ministra aulas para a turma 001 do curso Tecnico em Informatica. A turma possui 18 alunos e se encontra aproximadamente em 70% do percurso do curso. Os alunos serao submetidos a uma avaliacao geral que cobre conhecimentos diversos, de forma comparavel a avaliacoes amplas de aproveitamento, mas direcionada ao ensino tecnico.

O problema imediato e preparar a turma em uma aula de tres horas. Uma revisao exclusivamente expositiva teria dificuldade para cobrir a amplitude curricular e manter a participacao de estudantes com diferentes niveis de dominio. O projeto, portanto, adota duas frentes complementares:

1. Um portal de atividades colaborativas, denominado Recap SENAC 2026, no qual equipes resolvem desafios e apresentam solucoes.
2. Um simulado individual ou configuravel pelo professor, com sorteio de perguntas e alternativas, correcao explicativa e nova tentativa concentrada nos erros.

O portal tem prioridade operacional porque deve apoiar a dinamica presencial. O simulado pode ser concluido depois do portal, desde que esteja pronto para aplicacao por outro professor na segunda-feira, 21 de setembro de 2026. A solucao solicitada e completa; a priorizacao nao reduz o escopo final, apenas ordena as entregas para proteger o uso pedagogico mais proximo.

## 3. Problema educacional

O conteudo do curso e amplo e combina conhecimentos conceituais, procedimentos tecnicos, resolucao de problemas e atitudes profissionais. Uma unica atividade homogenea nao consegue avaliar adequadamente montagem e manutencao de computadores, operacao de redes, configuracao de servidores, desenvolvimento de algoritmos, banco de dados, testes, desenvolvimento desktop, desenvolvimento web e producao visual.

O projeto deve resolver quatro necessidades simultaneas:

- Recuperar conhecimentos distribuidos ao longo do curso, evitando concentracao somente nos assuntos mais recentes.
- Fornecer feedback que explique o raciocinio correto e transforme o erro em oportunidade de aprendizagem.
- Criar participacao ativa, cooperacao e responsabilidade entre os alunos durante a aula presencial.
- Produzir evidencias que permitam ao professor identificar lacunas por equipe, tema e unidade curricular.

O produto nao sera apenas um jogo de pontuacao. A gamificacao e um mecanismo de engajamento subordinado aos objetivos de aprendizagem. Pontos, ranking, tempo e premiacao simbolica nao podem premiar velocidade em detrimento de precisao, inclusao, colaboracao ou compreensao.

## 4. Fundamento curricular

O [Plano de Curso Tecnico em Informatica](../02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf) possui 59 paginas, carga horaria total de 1.200 horas e 16 unidades curriculares. Para organizar atividades e questoes sem perder a rastreabilidade, o projeto utiliza os tres eixos profissionais presentes na organizacao do curso:

| Eixo | Unidades curriculares | Carga horaria | Participacao na carga total |
|---|---|---:|---:|
| Suporte e manutencao de computadores | UC01 a UC04 | 272 h | 22,7% |
| Operacao de redes e servidores | UC05 a UC08 | 308 h | 25,7% |
| Desenvolvimento de aplicativos | UC09 a UC16 | 620 h | 51,6% |
| Total | UC01 a UC16 | 1.200 h | 100% |

Cada atividade ou questao deve possuir ligacao explicita com ao menos uma unidade curricular e um elemento verificavel do plano: indicador, conhecimento, habilidade ou atitude. O uso de tres eixos simplifica a navegacao e a distribuicao inicial do banco, mas nao elimina a classificacao pelas 16 unidades curriculares.

O plano tambem orienta uma avaliacao que acompanha o desenvolvimento das competencias e considera momentos diagnosticos, formativos e somativos. O portal enfatizara diagnostico e formacao durante a aula; o simulado fornecera diagnostico, consolidacao e uma medida estruturada de desempenho. Nenhum resultado do sistema substitui a avaliacao institucional ou a decisao profissional do professor.

## 5. Visao do produto

O Recap SENAC 2026 sera uma aplicacao web responsiva, acessivel por computadores e celulares, com duas experiencias conectadas pelo mesmo modelo curricular.

### 5.1. Experiencia do portal de equipes

O professor cria uma sessao, define ou confirma as equipes, seleciona as atividades e controla o andamento das rodadas. Os alunos entram usando um codigo curto e a identificacao da equipe. A interface apresenta uma atividade por vez, registra respostas, informa estados de envio e oferece feedback conforme a regra pedagogica da rodada.

As atividades podem combinar classificacao, associacao, ordenacao, diagnostico de falhas, interpretacao de cenarios, elaboracao de solucao curta, apresentacao oral e avaliacao manual pelo professor. O formato deve ser escolhido de acordo com a competencia. Por exemplo, reconhecer componentes pode usar associacao visual; diagnosticar uma rede exige analisar sintomas e configuracoes; modelar dados exige relacionar entidades, atributos e regras; algoritmos podem ser avaliados por rastreamento, ordenacao de passos ou identificacao de erros.

O ranking principal sera por equipe. Nomes individuais poderao ser usados durante a sessao quando o professor considerar necessario, mas nao serao requisito para participacao nem aparecerao em publicacoes abertas. A composicao recomendada para 18 alunos e de seis equipes com tres integrantes, marcada como [INFERENCIA] ate que o professor confirme a distribuicao real.

### 5.2. Experiencia do simulado

O professor configura e inicia uma tentativa escolhendo eixos, unidades curriculares, quantidade de perguntas, dificuldade e duracao. O sistema sorteia perguntas e, quando aplicavel, a posicao das alternativas. A aleatorizacao nao altera a resposta correta, a explicacao ou a rastreabilidade curricular.

Ao finalizar, o participante recebe a relacao de acertos e erros, a resposta esperada e uma explicacao pedagogica. Quando houver alternativas incorretas construidas para representar erros comuns, a explicacao indicara por que elas nao satisfazem o enunciado. O participante podera iniciar uma nova tentativa composta somente pelas perguntas erradas, mantendo a referencia a tentativa original.

O banco inicial tera no minimo 100 questoes para cada um dos tres eixos, totalizando 300 questoes. A quantidade e um piso de cobertura, nao um criterio suficiente de qualidade. Duplicacoes superficiais, variacoes meramente lexicais e perguntas sem fonte curricular nao contam para o minimo.

## 6. Participantes e responsabilidades

| Participante | Responsabilidades principais |
|---|---|
| Professor responsavel | Aprovar escopo, validar conteudo, configurar sessoes, mediar a aula e decidir intervencoes pedagogicas. |
| Professor aplicador do simulado | Configurar a tentativa, orientar os alunos e consultar resultados sem depender do autor original. |
| Aluno | Participar da equipe, responder atividades, revisar feedback e respeitar as regras da sessao. |
| Equipe | Construir respostas coletivas, distribuir participacao e apresentar solucoes quando solicitado. |
| Administrador tecnico | Publicar a aplicacao, configurar armazenamento, executar migracoes e verificar disponibilidade. |
| Agente de implementacao | Produzir uma unidade aprovada por vez, executar verificacoes e registrar evidencias sem ampliar o escopo silenciosamente. |

O professor permanece como autoridade sobre conteudo e avaliacao. O sistema automatiza tarefas repetitivas, organiza evidencias e aplica regras aprovadas; ele nao decide sozinho se um aluno desenvolveu uma competencia profissional.

## 7. Escopo incluido

O escopo final inclui:

- Aplicacao web responsiva denominada Recap SENAC 2026.
- Operacao publicada na Internet por Cloudflare Pages.
- API em Cloudflare Pages Functions e persistencia publicada em D1.
- Execucao alternativa em rede local no computador do professor.
- Entrada simplificada de alunos por sessao e equipe.
- Painel do professor para conduzir atividades e acompanhar pontuacao.
- Atividades que representem os tres eixos e as 16 unidades curriculares.
- Ranking por equipe, com ajustes manuais registrados.
- Exportacao de resultados em CSV e JSON.
- Simulado configuravel, aleatorizado e acompanhado de explicacoes.
- Banco inicial de pelo menos 300 questoes validas.
- Nova tentativa composta pelos erros anteriores.
- Documentacao para preparacao, aplicacao, contingencia e manutencao.
- Testes unitarios, integrados, ponta a ponta e de acessibilidade para os fluxos essenciais.
- Evidencias de build, validacao e execucao suficientes para outro professor operar o sistema.

## 8. Escopo excluido

Nao fazem parte da entrega inicial:

- Substituir o sistema academico, o diario de classe ou a avaliacao formal do SENAC.
- Manter historico permanente de notas individuais sem politica institucional aprovada.
- Criar contas permanentes para alunos.
- Integrar automaticamente com ambientes LMS, servicos de identidade ou sistemas administrativos.
- Usar reconhecimento facial, biometria, rastreamento comportamental ou coleta de dados sensiveis.
- Gerar perguntas automaticamente durante a avaliacao sem revisao previa do professor.
- Aplicar penalidades academicas com base exclusiva no ranking do jogo.
- Garantir operacao sem rede entre varios dispositivos quando nao houver infraestrutura local disponivel.
- Incorporar codigo ou recursos de terceiros antes da verificacao de licenca e atribuicao.
- Transformar o projeto em uma plataforma generica para cursos nao contemplados pelo plano fornecido.

Uma necessidade excluida pode entrar em versao futura somente por decisao registrada, avaliacao de impacto e novos criterios de aceite.

## 9. Restricoes

### 9.1. Restricoes pedagogicas

- A aula presencial possui duracao total de tres horas, incluindo organizacao, instrucoes, transicoes e encerramento.
- As atividades devem acomodar diferentes niveis de conhecimento.
- O feedback deve favorecer aprendizagem e nao expor publicamente alunos com maior dificuldade.
- A competicao deve permanecer subordinada a colaboracao, seguranca psicologica e participacao.
- O conteudo deve usar terminologia consistente com o plano de curso.

### 9.2. Restricoes tecnicas

- A publicacao principal depende de conta e configuracao Cloudflare ainda nao comprovadas neste repositorio.
- A operacao local depende de um computador do professor capaz de executar o runtime selecionado e de uma rede acessivel aos dispositivos dos alunos.
- O modo PWA pode preservar interface e conteudo previamente carregados, mas nao cria comunicacao entre dispositivos quando toda conectividade estiver indisponivel.
- O sistema deve funcionar nas versoes atuais de Chrome e Edge; outros navegadores exigem validacao especifica antes de serem declarados suportados.
- Segredos, identificadores de banco e credenciais nao podem ser adicionados ao repositorio.

### 9.3. Restricoes de processo

- A implementacao segue execucao faseada e produz um documento ou modulo por iteracao aprovada.
- Todos os arquivos devem permanecer dentro da raiz do projeto.
- Documentos com afirmacoes verificaveis devem indicar fontes ou estados de evidencia.
- Mudancas devem preservar arquivos e alteracoes preexistentes do usuario.

## 10. Criterios de sucesso

### 10.1. Portal de atividades

O portal sera considerado funcional quando um professor puder criar uma sessao, registrar ou confirmar equipes, liberar uma atividade, receber respostas, aplicar pontuacao, acompanhar o ranking, encerrar a sessao e exportar os resultados. O fluxo deve ser concluido sem edicao manual do banco de dados e sem exigir conta permanente dos alunos.

Pelo menos um conjunto de atividades deve representar cada eixo curricular. Cada atividade entregue deve conter objetivo, regras, tempo esperado, criterio de avaliacao, referencia curricular, resposta ou rubrica, feedback e alternativa acessivel ao mecanismo principal.

### 10.2. Simulado

O simulado sera considerado funcional quando o professor puder configurar uma tentativa e quando o aluno puder responder, finalizar, consultar correcao explicativa e refazer somente os erros. Testes automatizados devem provar que o sorteio nao rompe a correcao e que uma tentativa repetida conserva o vinculo entre pergunta, resposta e explicacao.

O banco sera aceito quando possuir pelo menos 300 questoes unicas e revisadas, distribuidas nos tres eixos, classificadas pelas unidades curriculares e acompanhadas das informacoes obrigatorias. O numero de questoes nao dispensa revisao de clareza, dificuldade, ambiguidade, atualidade ou aderencia ao plano.

### 10.3. Operacao e qualidade

O projeto sera operacionalmente aceito quando houver build reproduzivel, launcher Windows, orientacao de publicacao, procedimento de execucao local, plano de contingencia, testes dos fluxos essenciais e documentacao suficiente para um segundo professor aplicar o simulado.

O projeto nao sera declarado pronto apenas porque a interface abre. Criacao de sessao, persistencia, concorrencia entre equipes, pontuacao idempotente, exportacao, acessibilidade e comportamento sob falhas devem possuir evidencia proporcional ao risco.

## 11. Indicadores de resultado

Os indicadores iniciais combinam produto, operacao e aprendizagem:

| ID | Indicador | Meta inicial | Metodo de verificacao |
|---|---|---:|---|
| IND-001 | Alunos com acesso funcional a sessao | 100% dos presentes | Contagem de entradas confirmadas pelo professor |
| IND-002 | Equipes que concluem todas as rodadas obrigatorias | Pelo menos 80% | Registro de conclusao por rodada |
| IND-003 | Atividades com rastreabilidade curricular completa | 100% | Validacao dos campos obrigatorios |
| IND-004 | Questoes com resposta e explicacao | 100% | Validacao automatizada do banco |
| IND-005 | Fluxos essenciais aprovados em teste ponta a ponta | 100% | Relatorio Playwright |
| IND-006 | Violacoes criticas de acessibilidade nos fluxos essenciais | Zero | Auditoria automatizada e verificacao por teclado |
| IND-007 | Alteracoes de pontuacao sem trilha de auditoria | Zero | Consulta ao registro de eventos |
| IND-008 | Segredos ou nomes de alunos publicados no repositorio | Zero | Varredura de arquivos e revisao de artefatos |

Metas de aprendizagem que dependam de comparacao entre diagnostico e resultado final serao definidas no desenho pedagogico. Sem uma linha de base medida, qualquer percentual de ganho deve permanecer [UNVERIFIED].

## 12. Premissas e pontos ainda nao comprovados

| ID | Estado | Declaracao | Consequencia |
|---|---|---|---|
| PRE-001 | [INFERENCIA] | Seis equipes de tres alunos oferecem distribuicao equilibrada para 18 participantes. | A composicao deve permanecer configuravel. |
| PRE-002 | [UNVERIFIED] | A sala possui rede local que permite acesso dos dispositivos ao computador do professor. | O modo local precisa de teste no ambiente real. |
| PRE-003 | [UNVERIFIED] | Existe conta Cloudflare disponivel para publicar Pages, Functions e D1. | A publicacao depende de configuracao externa. |
| PRE-004 | [UNVERIFIED] | Todos os alunos terao um dispositivo individual ou compartilhado. | A interface deve aceitar operacao por equipe em um unico dispositivo. |
| PRE-005 | [INFERENCIA] | O ranking por equipe reduz exposicao individual e favorece colaboracao. | A apresentacao padrao ocultara classificacao nominal. |

Esses pontos nao impedem a documentacao e a construcao da base, mas devem ser verificados antes da declaracao de prontidao operacional.

## 13. Riscos iniciais

| ID | Risco | Probabilidade | Impacto | Tratamento inicial |
|---|---|---|---|---|
| RISCO-001 | Falha de Internet durante a aula | Media | Alto | Disponibilizar operacao em rede local e roteiro alternativo. |
| RISCO-002 | Cobertura curricular superficial devido ao volume | Alta | Alto | Usar matriz por UC, revisao docente e validacao obrigatoria do conteudo. |
| RISCO-003 | Banco numeroso com perguntas repetitivas ou ambiguas | Alta | Alto | Separar geracao, revisao, validacao e aceite; impedir duplicacoes por similaridade. |
| RISCO-004 | Competicao desmotivar alunos com menor dominio | Media | Alto | Priorizar equipes, progresso, feedback e oportunidades de recuperacao. |
| RISCO-005 | Pontuacao duplicada por reenvio | Media | Medio | Adotar idempotencia e registro de eventos. |
| RISCO-006 | Dependencia excessiva de um unico professor | Media | Alto | Criar guias, configuracao declarativa e fluxo de aplicacao reproduzivel. |
| RISCO-007 | Exposicao de nomes e resultados individuais | Baixa | Alto | Usar equipes por padrao e limitar retencao de dados pessoais. |
| RISCO-008 | Prazo reduzir verificacao dos fluxos | Alta | Alto | Priorizar caminho critico, automatizar testes e nao declarar como pronto o que estiver sem prova. |

## 14. Fatos consolidados

| ID | Fato | Fonte | Estado |
|---|---|---|---|
| FATO-001 | O solicitante atua como professor no SENAC e ministra aulas para a turma 001. | Prompt inicial | [OK] |
| FATO-002 | A turma informada possui 18 alunos. | Confirmacao do usuario em 18 de setembro de 2026 | [OK] |
| FATO-003 | Os alunos se encontram aproximadamente em 70% do curso Tecnico em Informatica. | Prompt inicial | [OK] |
| FATO-004 | A aula preparatoria possui duracao de tres horas. | Prompt inicial | [OK] |
| FATO-005 | O arquivo curricular disponibilizado possui 59 paginas, 16 unidades curriculares e 1.200 horas totais. | Plano de curso e verificacao programatica | [OK] |
| FATO-006 | O usuario aprovou uma solucao completa, com o portal antes do simulado. | Confirmacao do usuario em 18 de setembro de 2026 | [OK] |
| FATO-007 | O simulado deve permitir aplicacao por outro professor na segunda-feira, 21 de setembro de 2026. | Confirmacao do usuario e calendario derivado da data-base | [OK] |
| FATO-008 | Nomes individuais sao permitidos, mas a exibicao por equipes e preferida. | Confirmacao do usuario em 18 de setembro de 2026 | [OK] |

Fatos registrados nao sao automaticamente requisitos. A passagem de um fato para uma obrigacao do produto deve aparecer em um requisito, criterio de aceite ou decisao aprovada. Se uma fonte mudar, o fato afetado deve ser revalidado antes que documentos dependentes sejam atualizados.

## 15. Decisoes aprovadas

| ID | Decisao | Justificativa | Consequencia |
|---|---|---|---|
| DECISAO-001 | Construir a solucao completa. | O pedido nao se limita a um prototipo de aula. | Portal, simulado, conteudo, testes e operacao permanecem no escopo. |
| DECISAO-002 | Entregar o portal antes do simulado. | O portal atende a necessidade presencial mais imediata. | O simulado forma uma segunda frente priorizada para 21 de setembro de 2026. |
| DECISAO-003 | Mostrar ranking principalmente por equipes. | O usuario autorizou nomes, mas prefere equipes. | Identidade individual sera opcional e protegida. |
| DECISAO-004 | Publicar preferencialmente na Internet e manter modo local. | A Internet amplia acesso; a rede local reduz risco operacional. | A arquitetura deve suportar Cloudflare e execucao local. |
| DECISAO-005 | Usar Cloudflare Pages, Pages Functions e D1 como destino principal. | O ranking compartilhado exige backend e persistencia, ausentes em hospedagem puramente estatica. | GitHub Pages pode hospedar somente uma demonstracao estatica ou cliente desacoplado. |
| DECISAO-006 | Organizar o banco em tres eixos e classificar por 16 UCs. | A organizacao acompanha as qualificacoes do plano sem perder granularidade. | O banco inicial tera no minimo 300 questoes. |

## 16. Evidencias e provas iniciais

| ID | Estado | Afirmacao | Procedimento | Evidencia |
|---|---|---|---|---|
| PROVA-001 | [OK] | O prompt inicial existe e define duas frentes, aula de tres horas e quatro ondas de execucao. | Leitura integral em UTF-8. | [Prompt inicial](../01_prompt-inicial/prompt.md) |
| PROVA-002 | [OK] | O plano de curso possui 59 paginas. | Abertura com leitor PDF e contagem programatica de paginas. | [Plano de curso](../02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf) |
| PROVA-003 | [OK] | O plano declara carga horaria total de 1.200 horas. | Extracao textual e conferencia visual da matriz curricular. | Plano de curso, pagina 8 |
| PROVA-004 | [OK] | O plano detalha 16 unidades curriculares. | Extracao dos identificadores UC01 a UC16 e conferencia das paginas 8 a 31. | Plano de curso, paginas 8 a 31 |
| PROVA-005 | [OK] | O contrato do projeto contem regras de escopo, curriculo, privacidade, qualidade e governanca. | Validacao estrutural do XML e contagem das leis L-01 a L-20. | [Contrato dos agentes](../../AGENTS.md) |
| PROVA-006 | [UNVERIFIED] | A publicacao Cloudflare esta operacional. | Exige conta, configuracao, build e teste externo. | Evidencia ainda inexistente |
| PROVA-007 | [UNVERIFIED] | O modo local funciona na rede da sala. | Exige execucao no computador do professor e acesso por outro dispositivo. | Evidencia ainda inexistente |

## 17. Portao de saida desta visao

Esta visao estara completamente estabilizada quando:

- As decisoes de produto permanecerem aprovadas pelo professor.
- As premissas sobre dispositivos, rede local e conta Cloudflare forem verificadas ou receberem contingencia aceita.
- O inventario curricular ligar as 16 unidades a temas, atividades e cobertura do banco.
- Os requisitos funcionais e nao funcionais transformarem os objetivos em criterios testaveis.
- Os riscos possuirem responsavel e acompanhamento nos documentos de governanca.
- Nenhuma especificacao posterior contradizer escopo, prioridade ou privacidade sem uma nova decisao.

O estado atual e `APROVADO_COM_VALIDACOES_PENDENTES`: a finalidade, o publico, as duas frentes, a prioridade, o modelo de ranking e a direcao de implantacao estao aprovados; infraestrutura da sala e credenciais de publicacao ainda precisam de prova operacional.
