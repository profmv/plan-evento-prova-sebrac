> Resumo: este registro controla ameaças ao valor pedagógico, ao prazo, à privacidade e à operação do Recap SENAC 2026. Cada risco possui causa, consequência, sinais de ocorrência, responsável, prevenção, contingência e prova de encerramento; risco sem prova permanece aberto.

# Registro de riscos

```json
{"id":"DOC-GOV-002","tipo":"registro-riscos","versao":"1.0","estado":"ATIVO","idioma":"pt-BR","data_base":"2026-09-18","escala":"probabilidade e impacto de 1 a 5","documentos_relacionados":["00_visao-geral.md","01_decisoes.md","../../AGENTS.md","../01_prompt-inicial/prompt.md"]}
```

Documentos relacionados: [visão geral](./00_visao-geral.md), [decisões](./01_decisoes.md), [contrato do projeto](../../AGENTS.md) e [prompt inicial](../01_prompt-inicial/prompt.md).

## 1. Finalidade e política

Este registro existe para impedir que uma suposição seja confundida com uma condição comprovada. Um risco descreve um evento incerto que pode prejudicar a aula, o aprendizado, os dados, a implantação ou a manutenção. Uma pendência descreve trabalho conhecido e deve aparecer no planejamento; um defeito descreve comportamento já observado e deve ser tratado no rastreamento técnico; uma decisão escolhe entre alternativas e pertence ao [registro de decisões](./01_decisoes.md). Quando um risco ocorrer, ele deixa de ser apenas possibilidade e deve gerar incidente, defeito ou mudança de plano identificável.

Os estados admitidos são:

- `ABERTO`: ainda não existe tratamento executado ou a exposição permanece integral.
- `EM_TRATAMENTO`: ações de prevenção ou redução estão em execução.
- `MITIGADO`: controles foram implementados e testados, mas permanece risco residual.
- `ACEITO`: a autoridade indicada aceitou explicitamente o risco residual por prazo e contexto definidos.
- `OCORRIDO`: o evento se materializou e exige resposta operacional.
- `ENCERRADO`: a causa foi removida ou o contexto deixou de existir, com prova registrada.

Nenhum risco será encerrado apenas porque o recurso foi implementado. A saída exige a prova indicada na matriz. A aceitação não equivale a encerramento e precisa registrar autoridade, justificativa, validade e exposição residual. A ausência de resposta do usuário não será interpretada como aceitação.

## 2. Método de avaliação

Probabilidade e impacto usam escala ordinal de 1 a 5. A pontuação inerente é `probabilidade x impacto`, antes dos controles. O nível orienta prioridade, sem substituir julgamento:

| Faixa | Nível | Conduta mínima |
|---|---|---|
| 1 a 4 | Baixo | Monitorar e tratar junto ao fluxo normal. |
| 5 a 9 | Moderado | Definir responsável, gatilho e controle verificável. |
| 10 a 16 | Alto | Tratar antes do marco afetado e ensaiar contingência. |
| 17 a 25 | Crítico | Impedir uso no marco afetado até mitigação ou aceite explícito. |

Impacto considera a consequência mais grave entre aprendizagem, operação, privacidade, integridade e reputação. A exposição residual só será calculada depois de controles testados. Antes disso, o valor inerente permanece a referência. Os riscos RISCO-001 a RISCO-008 preservam os identificadores e os significados publicados na visão geral.

## 3. Matriz executiva

| ID | Risco | P | I | Pontos | Nível | Estado | Responsável primário |
|---|---|---:|---:|---:|---|---|---|
| RISCO-001 | Falha de Internet durante a aula | 3 | 4 | 12 | Alto | ABERTO | Responsável técnico |
| RISCO-002 | Cobertura curricular superficial devido ao volume | 4 | 4 | 16 | Alto | ABERTO | Revisor curricular |
| RISCO-003 | Banco numeroso com questões repetitivas ou ambíguas | 4 | 4 | 16 | Alto | ABERTO | Revisor curricular |
| RISCO-004 | Competição desmotivar alunos com menor domínio | 3 | 4 | 12 | Alto | ABERTO | Professor responsável |
| RISCO-005 | Pontuação duplicada por reenvio | 3 | 3 | 9 | Moderado | ABERTO | Responsável técnico |
| RISCO-006 | Dependência excessiva de um único professor | 3 | 4 | 12 | Alto | ABERTO | Professor responsável |
| RISCO-007 | Exposição de nomes e resultados individuais | 2 | 4 | 8 | Moderado | ABERTO | Professor responsável |
| RISCO-008 | Prazo reduzir a verificação dos fluxos | 4 | 4 | 16 | Alto | EM_TRATAMENTO | Responsável técnico |
| RISCO-009 | Conta ou credenciais Cloudflare indisponíveis | 3 | 4 | 12 | Alto | ABERTO | Professor responsável |
| RISCO-010 | Rede local, firewall ou descoberta impedirem acesso | 3 | 5 | 15 | Alto | ABERTO | Responsável técnico |
| RISCO-011 | Autorização administrativa insuficiente | 3 | 5 | 15 | Alto | ABERTO | Responsável técnico |
| RISCO-012 | Retenção de dados ficar indefinida | 3 | 4 | 12 | Alto | ABERTO | Professor responsável |
| RISCO-013 | Dispositivo ou navegador da sala ser incompatível | 3 | 4 | 12 | Alto | ABERTO | Responsável técnico |
| RISCO-014 | Cota, indisponibilidade ou latência do provedor | 2 | 4 | 8 | Moderado | ABERTO | Responsável técnico |
| RISCO-015 | Correção de resposta curta produzir falso erro ou falso acerto | 4 | 4 | 16 | Alto | ABERTO | Revisor curricular |
| RISCO-016 | Desempate, bônus ou ajuste manual parecerem injustos | 3 | 4 | 12 | Alto | ABERTO | Professor responsável |
| RISCO-017 | Recurso externo sem licença compatível ser incorporado | 3 | 5 | 15 | Alto | EM_TRATAMENTO | Responsável técnico |
| RISCO-018 | Segunda-feira presumida divergir da data real do simulado | 2 | 4 | 8 | Moderado | ABERTO | Professor responsável |
| RISCO-019 | Fluxo essencial excluir participante | 3 | 5 | 15 | Alto | ABERTO | Responsável técnico |
| RISCO-020 | Exportação revelar dados além do necessário | 3 | 5 | 15 | Alto | ABERTO | Professor responsável |
| RISCO-021 | Certificado simbólico ser omitido ou sugerir certificação formal | 3 | 3 | 9 | Moderado | ABERTO | Professor responsável |
| RISCO-022 | Estado local divergir do ambiente publicado | 3 | 4 | 12 | Alto | ABERTO | Responsável técnico |
| RISCO-023 | Resultado local ser perdido antes da exportação | 3 | 4 | 12 | Alto | ABERTO | Professor aplicador |
| RISCO-024 | Concorrência dos 18 alunos corromper sessão ou ranking | 3 | 5 | 15 | Alto | ABERTO | Responsável técnico |

## 4. Tratamentos dos riscos pedagógicos e de conteúdo

### RISCO-002 - Cobertura curricular superficial

**Causa e consequência:** produzir grande volume sem matriz de cobertura pode concentrar itens nos assuntos mais fáceis e apresentar falsa abrangência das 16 UCs. O aluno recebe prática desequilibrada e o relatório não representa o plano de curso.

**Sinais e gatilho:** UC sem itens, objetivo curricular sem correspondência, distribuição muito diferente das horas ou revisão que encontre enunciado sem referência. Qualquer UC com cobertura zero bloqueia o aceite do banco inicial.

**Prevenção e contingência:** definir cotas por eixo e UC, vincular cada item a uma referência curricular, revisar amostras estratificadas e publicar lacunas. Se a revisão completa não terminar, liberar somente subconjunto aprovado e identificá-lo como parcial; não completar quantidade com duplicações.

**Prova de mitigação:** relatório de cobertura com 16 UCs, 300 itens válidos, justificativa para distribuição e aprovação registrada do revisor curricular.

### RISCO-003 - Questões repetitivas ou ambíguas

**Causa e consequência:** metas numéricas incentivam paráfrases, alternativas obviamente erradas ou respostas dependentes de contexto ausente. Isso prejudica aprendizagem, sorteio e confiança no resultado.

**Sinais e gatilho:** alta similaridade textual, mesma resposta em padrões previsíveis, duas alternativas defensáveis, explicação que não resolve a dúvida ou taxa anormal de contestação.

**Prevenção e contingência:** usar esquema obrigatório, verificação de duplicidade, revisão pedagógica, distribuição de dificuldade e teste de leitura. Itens contestados serão desativados por versão sem apagar resultados históricos; a sessão poderá recalcular apenas quando houver regra registrada.

**Prova de mitigação:** relatório de validação estrutural e de similaridade, amostra revisada por UC e ausência de item ativo marcado como ambíguo.

### RISCO-004 - Competição desmotivar participantes

**Causa e consequência:** placar permanente, diferença crescente ou exposição individual podem transformar revisão em constrangimento. Participantes com menor domínio podem desistir ou deixar colegas responderem por eles.

**Sinais e gatilho:** abandono de atividade, equipe sem participação, comentários de constrangimento, foco apenas na posição ou diferença de pontos que elimina chance percebida de recuperação.

**Prevenção e contingência:** destacar progresso, colaboração, feedback e rodadas recuperáveis; mostrar equipes, não indivíduos; permitir ocultar temporariamente o ranking; oferecer papéis rotativos. O professor poderá suspender a pontuação sem interromper a aprendizagem.

**Prova de mitigação:** roteiro pedagógico, controle de visibilidade testado e observação pós-aula documentada sem identificação desnecessária.

### RISCO-015 - Correção inadequada de resposta curta

**Causa e consequência:** comparação literal rejeita variações legítimas; regras amplas aceitam respostas incorretas. Ambos distorcem feedback e pontuação.

**Sinais e gatilho:** contestação plausível, taxa de erro muito diferente de itens equivalentes, variantes não previstas ou normalização que altera significado técnico.

**Prevenção e contingência:** declarar respostas, variantes e normalizações permitidas por item; preservar a resposta original; evitar avaliação semântica opaca. Respostas fora das regras podem ficar `PENDENTE_REVISAO` sem conceder ou retirar ponto automaticamente.

**Prova de mitigação:** testes positivos, negativos e limítrofes por regra, além de revisão de amostra pelo responsável curricular.

### RISCO-016 - Regras competitivas parecerem injustas

**Causa e consequência:** desempate por tempo, bônus oculto ou ajuste manual sem motivo pode alterar posições de modo inexplicável e reduzir confiança.

**Sinais e gatilho:** totais iguais com ordem instável, pontuação divergente entre tela e exportação ou ajuste sem autor, motivo e horário.

**Prevenção e contingência:** publicar regra de desempate antes da sessão, registrar eventos imutáveis, exigir motivo para ajustes e permitir visão explicativa. Em disputa não resolvida, declarar empate em vez de inventar critério posterior.

**Prova de mitigação:** testes determinísticos de empate, reconstrução do total a partir dos eventos e exportação que explique cada ajuste.

### RISCO-021 - Certificado simbólico inadequado

**Causa e consequência:** o prompt pede certificado simbólico, mas ele pode ser esquecido ou interpretado como documento oficial de conclusão. Isso gera expectativa incorreta.

**Sinais e gatilho:** ausência do artefato no fluxo final, uso de carga horária, selo ou formulação institucional não autorizada, ou emissão vinculada a dado pessoal desnecessário.

**Prevenção e contingência:** rotular claramente como reconhecimento lúdico de participação, usar equipe ou identificação opcional, evitar linguagem de certificação profissional e permitir que o professor desative a emissão.

**Prova de mitigação:** texto aprovado pelo professor, teste de geração sem nome e revisão visual que confirme a natureza simbólica.

## 5. Tratamentos dos riscos técnicos e operacionais

### RISCO-001 - Falha de Internet

**Causa e consequência:** indisponibilidade do provedor, enlace da escola ou autenticação pode impedir que os dispositivos alcancem a aplicação publicada durante a aula.

**Sinais e gatilho:** falha de resolução, resposta repetida de erro, latência que impeça a rodada ou perda de conectividade em dois dispositivos de teste. O gatilho operacional deve possuir tempo curto definido no roteiro para evitar consumir a aula tentando recuperar a Internet.

**Prevenção e contingência:** preparar modo local com os mesmos contratos essenciais, banco carregado e launcher Windows; ensaiar troca antes da aula; manter roteiro impresso mínimo. A contingência não dependerá de baixar pacotes durante o incidente.

**Prova de mitigação:** sessão completa em rede local por pelo menos dois dispositivos, com Internet desligada, persistência, ranking e exportação verificados.

### RISCO-005 - Pontuação duplicada

**Causa e consequência:** repetição de clique, reconexão ou retentativa HTTP pode registrar a mesma resposta mais de uma vez.

**Sinais e gatilho:** dois eventos com a mesma intenção, total maior que o máximo possível ou divergência entre eventos e agregado.

**Prevenção e contingência:** chave idempotente por comando, restrição de unicidade, transação e total derivado. Se ocorrer, registrar evento compensatório autorizado e preservar o histórico; não editar silenciosamente o total.

**Prova de mitigação:** teste de concorrência e reenvio com múltiplas requisições idênticas que resulte em um único efeito.

### RISCO-009 - Conta ou credenciais Cloudflare indisponíveis

**Causa e consequência:** o agente não possui autorização implícita para criar conta, domínio, banco ou segredo. Sem acesso do responsável, a aplicação não poderá ser publicada nem ter prova real de produção.

**Sinais e gatilho:** ausência de conta autorizada, falha de login, falta de permissão D1 ou segredo não configurado até o portão de publicação.

**Prevenção e contingência:** documentar pré-requisitos, manter infraestrutura declarativa e validar localmente. Sem credencial, entregar pacote publicável e operar localmente; nunca inserir segredo no repositório.

**Prova de mitigação:** implantação autorizada, URL acessível, migração aplicada, segredo verificado por nome e teste funcional sem expor seu valor.

### RISCO-010 - Rede local ou firewall impedir acesso

**Causa e consequência:** isolamento entre clientes, perfil público do Windows, porta bloqueada ou endereço incorreto pode tornar o servidor local inacessível.

**Sinais e gatilho:** o servidor abre no computador do professor, mas não em outro dispositivo; `ping` ou conexão à porta falha; o endereço muda após reconexão.

**Prevenção e contingência:** launcher com endereço e porta visíveis, escuta controlada na interface da LAN, verificação prévia por segundo dispositivo e instrução de firewall dependente de autorização. Se a rede isolar clientes, usar a versão publicada ou dinâmica em dispositivo compartilhado e material impresso.

**Prova de mitigação:** ensaio na própria sala ou ambiente equivalente, com registro de dispositivo, navegador, endereço, porta e resultado.

### RISCO-013 - Incompatibilidade de dispositivo ou navegador

**Causa e consequência:** versões antigas, tela reduzida, teclado diferente ou política de execução podem quebrar interação essencial.

**Sinais e gatilho:** erro de JavaScript, layout que encobre controles, foco inacessível, armazenamento indisponível ou tempo de carregamento incompatível.

**Prevenção e contingência:** declarar navegadores suportados, usar APIs com suporte amplo, layout responsivo e teste em perfis representativos. Dispositivo incompatível poderá participar por terminal compartilhado sem perder a identidade da equipe.

**Prova de mitigação:** matriz de compatibilidade executada em pelo menos dois motores ou nos navegadores institucionais confirmados, incluindo largura reduzida e teclado.

### RISCO-014 - Cota, indisponibilidade ou latência do provedor

**Causa e consequência:** limites de requisição, banco ou build podem interromper sessões mesmo com Internet disponível.

**Sinais e gatilho:** resposta `429`, erro de binding, latência crescente, falha de consulta ou painel indicando consumo próximo do limite.

**Prevenção e contingência:** reduzir chamadas redundantes, definir índices, paginar relatórios, monitorar limites da conta e manter modo local. Não assumir cotas a partir apenas de documentação genérica; validar a conta usada.

**Prova de mitigação:** teste de carga proporcional a 18 alunos, inspeção das métricas e ensaio da troca para operação local.

### RISCO-022 - Divergência entre estado local e publicado

**Causa e consequência:** bases separadas podem ter conteúdo, migrações ou sessões diferentes. Alternar ambientes sem indicação pode misturar resultados ou apresentar versão obsoleta.

**Sinais e gatilho:** versão de esquema distinta, identificador ausente, contagem diferente de itens ou exportação incompatível.

**Prevenção e contingência:** versionar esquema e conteúdo, mostrar ambiente e versão no painel, bloquear importação incompatível e tratar transferência como operação explícita. Não prometer sincronização automática na primeira versão.

**Prova de mitigação:** migração limpa nos dois ambientes e teste de exportação e importação entre versões suportadas.

### RISCO-023 - Perda de resultado local

**Causa e consequência:** desligamento, encerramento do processo ou falha de disco antes da exportação pode apagar o resultado da aula.

**Sinais e gatilho:** banco criado em diretório temporário, launcher sem caminho estável, erro de gravação ou encerramento inesperado.

**Prevenção e contingência:** persistência em diretório documentado, verificação de espaço, exportação durante e ao final do evento e cópia autorizada para local seguro. Dados pessoais não devem ser mantidos apenas para facilitar backup.

**Prova de mitigação:** reinício controlado com recuperação da sessão e restauração de uma exportação de teste.

### RISCO-024 - Concorrência corromper sessão ou ranking

**Causa e consequência:** 18 alunos podem responder quase simultaneamente. Atualizações sem transação ou ordenação determinística podem perder eventos, gerar totais inconsistentes ou oscilar o ranking.

**Sinais e gatilho:** total irreproduzível, erro de bloqueio, resposta perdida, posições diferentes para o mesmo conjunto de eventos ou aumento acentuado de latência.

**Prevenção e contingência:** operações atômicas, índices, idempotência, paginação ou atualização moderada do placar e teste com carga concorrente acima da turma prevista. Em degradação, reduzir frequência de atualização sem rejeitar respostas.

**Prova de mitigação:** teste automatizado com pelo menos 18 participantes simulados, reconciliação integral dos eventos e orçamento de latência definido.

## 6. Tratamentos de segurança, privacidade, inclusão e continuidade

### RISCO-006 - Dependência de um único professor

**Tratamento:** produzir guia de aplicação, configuração, sinais de sucesso, recuperação e encerramento; testar o guia com pessoa que não implementou o sistema. **Gatilho:** aplicador não consegue iniciar sessão ou exportar resultado sem suporte direto. **Contingência:** roteiro simplificado e atividade sem pontuação compartilhada. **Prova:** execução observada pelo professor substituto, com dúvidas incorporadas ao guia.

### RISCO-007 - Exposição de nomes e resultados individuais

**Tratamento:** equipes por padrão, identificação opcional e temporária, acesso reservado a qualquer detalhe individual, anonimização de dados de teste e prazo de retenção. **Gatilho:** nome ou resposta individual aparecer em tela projetada, URL, log ou exportação padrão. **Contingência:** ocultar a visualização, revogar a exportação e registrar incidente. **Prova:** testes de autorização e inspeção de telas, logs e arquivos.

### RISCO-011 - Autorização administrativa insuficiente

**Tratamento:** separar código de aluno de credencial administrativa, limitar tentativas, expirar sessão e proteger operações de ajuste, exportação e exclusão. O mecanismo exato ainda depende de decisão técnica e de operação; até lá, permanece aberto. **Gatilho:** aluno consegue acessar ação administrativa ou segredo aparece no cliente. **Contingência:** encerrar sessão, trocar segredo e preservar trilha do incidente. **Prova:** testes negativos de autorização para cada rota privilegiada.

### RISCO-012 - Retenção de dados indefinida

**Tratamento:** inventariar campos, finalidade, autoridade de acesso, prazo e método de descarte antes da publicação. Preferir equipe e identificador técnico a nome. **Gatilho:** dado sem finalidade ou prazo entra no esquema. **Contingência:** interromper coleta, exportar apenas o necessário e excluir mediante procedimento auditável. **Prova:** tabela de retenção aprovada e teste de expurgo. A política ainda não está decidida e não será inventada pelo código.

### RISCO-017 - Reuso externo sem licença

**Tratamento:** aplicar DECISAO-018, registrar origem, commit, licença e avisos antes de copiar qualquer material. **Gatilho:** dependência, trecho, imagem ou questão sem licença identificável. **Contingência:** remover o material e substituir por implementação própria. **Prova:** inventário de terceiros e verificação de licenças. Os repositórios encontrados na pesquisa continuam apenas candidatos.

### RISCO-018 - Data do simulado não confirmada

**Tratamento:** tratar 21 de setembro de 2026 apenas como inferência da expressão `segunda-feira`, planejar o simulado depois do portal e não prometer implantação externa nessa data sem confirmação. **Gatilho:** cronograma ou guia apresentar a data inferida como compromisso. **Contingência:** fornecer pacote e roteiro com data parametrizável. **Prova:** confirmação do aplicador ou calendário formal.

### RISCO-019 - Exclusão em fluxo essencial

**Tratamento:** aplicar DECISAO-016, testar teclado, foco, contraste, ampliação, mensagens, tempo e alternativas a áudio, cor e arrastar. **Gatilho:** participante não consegue concluir atividade por característica da interface. **Contingência:** modo equivalente operado por teclado ou mediado pelo professor, sem penalidade. **Prova:** checklist manual e teste automatizado sem violações críticas conhecidas.

### RISCO-020 - Exportação excessiva

**Tratamento:** definir perfil de exportação, minimizar colunas, exigir autorização de professor, evitar nomes por padrão e impedir cache público. **Gatilho:** arquivo inclui segredo, identificador desnecessário ou resposta individual não autorizada. **Contingência:** revogar acesso, substituir arquivo e registrar incidente. **Prova:** testes de contrato, inspeção de amostra e busca por campos proibidos.

### RISCO-021 - Template processual obrigatório indisponível

**Estado:** [UNVERIFIED]. **Probabilidade:** média. **Impacto:** médio. **Tratamento:** procurar o resolvedor e o template somente nos caminhos obrigatórios definidos pelo contrato; enquanto estiverem indisponíveis, aplicar o contrato do projeto, registrar a limitação e não declarar conformidade com o template ausente. **Gatilho:** uma nova unidade exigir o template ou o resolvedor continuar ausente. **Contingência:** restaurar os arquivos prescritos ou fornecer o caminho oficial antes da próxima revisão processual. **Prova:** verificação de existência em `C:\Repo\codex-workspace\utils\resolve_workspace.ps1`, `.codex-workspace\utils\resolve_workspace.ps1` e nos dois caminhos possíveis de `prompt_processual_template.md`, executada em 2026-09-18, sem correspondências.

## 7. Risco de prazo e controle do caminho crítico

### RISCO-008 - Prazo reduzir a verificação

O tratamento já começou pela execução sequencial, governança antes do código e prioridade do portal. O caminho crítico é: modelo curricular mínimo, sessão e equipe, uma atividade vertical, pontuação idempotente, ranking, exportação, operação publicada ou local e ensaio. O simulado reutiliza contratos comprovados depois desse marco.

O risco aumenta quando muitos arquivos são iniciados sem porta de saída, quando conteúdo em massa antecede o esquema validado ou quando a publicação é confundida com funcionamento. Para cada unidade, a porta mínima inclui estrutura, codificação, links, teste aplicável e prova. Se um teste crítico falhar, novos recursos não compensam a falha. Após três tentativas consecutivas da mesma hipótese ou correção, a governança deve registrar `[FAIL]` e devolver o bloqueio ao usuário.

A contingência é reduzir o conjunto liberado, nunca falsificar conclusão. Uma atividade completa e um subconjunto curricular explicitamente parcial podem ser usados com honestidade; uma solução rotulada como completa sem persistência, correção ou prova não pode. A mitigação será comprovada quando o caminho vertical do portal passar pelos testes, a documentação operacional for seguida e os itens restantes estiverem explicitamente rastreados.

## 8. Cadência de revisão e autoridade

O responsável técnico revisará riscos de implementação ao fechar cada unidade e antes de build, teste de carga e publicação. O professor responsável revisará riscos pedagógicos, de privacidade e de operação antes da aula. O revisor curricular controla cobertura, ambiguidade e correção. O professor aplicador valida o guia e a contingência. Uma pessoa pode exercer mais de um papel, mas a prova deve indicar qual papel foi exercido.

Riscos altos ou críticos não podem ser silenciosamente transportados para o evento. O professor pode aceitar risco pedagógico ou operacional residual informado; o responsável técnico pode recomendar, mas não aceitar em nome do professor exposição de dados, perda de resultados ou indisponibilidade conhecida. Risco relacionado a licença sem evidência não será aceito para incorporação.

Após a aula, devem ser registrados incidentes, quase incidentes, dúvidas dos alunos, itens contestados, desempenho da rede, tempo de entrada e capacidade do aplicador. Essa revisão pode reduzir ou elevar probabilidade, criar novos riscos e transformar controles temporários em requisitos permanentes.

## 9. Provas de integridade deste registro

| ID | Estado | Afirmação | Evidência esperada |
|---|---|---|---|
| PROVA-RISCO-001 | [OK] | RISCO-001 a RISCO-008 preservam significado e identidade da visão geral. | Comparação programática e revisão textual executadas em 2026-09-18. |
| PROVA-RISCO-002 | [OK] | A matriz contém 24 identificadores únicos, pontuação coerente e responsável. | Validação estrutural da tabela: 24 linhas, 24 IDs e pontuações calculadas. |
| PROVA-RISCO-003 | [OK] | O documento possui resumo, metadados JSON válidos e links resolvidos. | Validação de estrutura e cinco caminhos executada em 2026-09-18. |
| PROVA-RISCO-004 | [OK] | O arquivo usa UTF-8 sem BOM, LF e não contém pictogramas. | Inspeção de bytes e caracteres executada em 2026-09-18. |
| PROVA-RISCO-005 | [OK] | Não há espaço em branco inválido no diff do arquivo. | `git diff --check` concluído com código 0 em 2026-09-18. |

As cinco verificações foram executadas após a criação do registro. Qualquer alteração posterior deve repeti-las; falha de uma prova recoloca o documento em revisão e impede tratá-lo como registro íntegro.
