> Resumo: este registro consolida as decisões de produto, pedagogia, arquitetura, dados, segurança, operação e processo do Recap SENAC 2026. Cada decisão apresenta contexto, alternativas, justificativa, consequências e condição de revisão para impedir escolhas implícitas ou contraditórias.

# Registro de decisões

```json
{"id":"DOC-GOV-001","tipo":"registro-decisoes","versao":"1.0","estado":"ATIVO","idioma":"pt-BR","data_base":"2026-09-18","autoridade":"Professor solicitante e contrato do projeto","documentos_relacionados":["00_visao-geral.md","../../AGENTS.md","../01_prompt-inicial/prompt.md","../02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf"]}
```

Documentos relacionados: [visão geral](./00_visao-geral.md), [contrato do projeto](../../AGENTS.md), [prompt inicial](../01_prompt-inicial/prompt.md) e [plano de curso](../02_PlanoCurso/PCN-Tecnico-em-informatica-MF2023.pdf).

## 1. Política do registro

Uma decisão existe quando duas ou mais alternativas plausíveis produzem consequências diferentes para o produto, a experiência pedagógica, a operação, os dados ou a manutenção. A escolha deve permanecer identificável mesmo depois que o código ou a documentação evoluírem. Este arquivo é o registro canônico das decisões transversais; decisões técnicas muito específicas poderão receber documentos próprios, desde que apontem para o identificador correspondente neste registro.

Os estados admitidos são:

- `PROPOSTA`: alternativa formulada, mas ainda sem autoridade para execução.
- `APROVADA`: decisão autorizada e aplicável às próximas unidades de trabalho.
- `SUBSTITUIDA`: decisão preservada historicamente, mas revogada por outra decisão identificada.
- `REJEITADA`: alternativa deliberada e explicitamente não adotada.
- `EM_REVISAO`: decisão temporariamente reaberta por nova evidência ou mudança de contexto.

Uma decisão aprovada não se torna permanente por inércia. Ela deve ser revista quando sua premissa principal deixar de ser verdadeira, quando um teste revelar impacto incompatível com os critérios de aceite ou quando o professor alterar uma prioridade de negócio. A revisão deve criar uma nova decisão ou atualizar o estado sem apagar o histórico.

## 2. Índice executivo

| ID | Decisão | Estado | Âmbito |
|---|---|---|---|
| DECISAO-001 | Construir a solução completa | APROVADA | Produto |
| DECISAO-002 | Entregar o portal antes do simulado | APROVADA | Priorização |
| DECISAO-003 | Usar equipes como identidade competitiva principal | APROVADA | Pedagogia e privacidade |
| DECISAO-004 | Preferir publicação na Internet e manter operação local | APROVADA | Operação |
| DECISAO-005 | Usar Cloudflare Pages, Pages Functions e D1 | APROVADA | Hospedagem e dados |
| DECISAO-006 | Organizar conteúdo em três eixos, 16 UCs e 300 questões mínimas | APROVADA | Currículo |
| DECISAO-007 | Adotar monólito modular orientado a funcionalidades | APROVADA | Arquitetura |
| DECISAO-008 | Usar React, TypeScript e Vite no frontend | APROVADA | Tecnologia |
| DECISAO-009 | Usar D1 publicado e persistência local do Wrangler | APROVADA | Persistência |
| DECISAO-010 | Separar a aplicação em seis módulos funcionais | APROVADA | Modularidade |
| DECISAO-011 | Separar conteúdo curricular do código executável | APROVADA | Conteúdo |
| DECISAO-012 | Não exigir conta permanente de aluno | APROVADA | Identidade |
| DECISAO-013 | Tornar pontuação idempotente e auditável | APROVADA | Integridade |
| DECISAO-014 | Implementar os comportamentos obrigatórios do simulado | APROVADA | Simulado |
| DECISAO-015 | Aplicar verificação automatizada em quatro níveis | APROVADA | Qualidade |
| DECISAO-016 | Garantir alternativas acessíveis nos fluxos essenciais | APROVADA | Acessibilidade |
| DECISAO-017 | Exportar evidências em CSV e JSON | APROVADA | Relatórios |
| DECISAO-018 | Reutilizar recursos externos somente após validação de licença | APROVADA | Reuso |
| DECISAO-019 | Executar uma unidade por vez sem aprovação intermediária obrigatória | APROVADA | Processo |
| DECISAO-020 | Documentar operação para outro professor | APROVADA | Continuidade |

## 3. Decisões de produto e prioridade

### DECISAO-001 - Construir a solução completa

**Estado:** `APROVADA`

**Contexto:** a necessidade imediata poderia ser tratada por um conjunto descartável de atividades para uma única aula. O usuário, porém, confirmou que deseja a solução completa descrita no prompt: portal de atividades, simulado, banco de conteúdo, operação publicada e local, testes e documentação.

**Alternativas consideradas:** produzir somente materiais manuais; produzir um protótipo sem persistência; entregar apenas o portal; construir a solução completa de forma faseada.

**Decisão:** construir a solução completa de forma incremental, preservando entregas utilizáveis ao final de cada frente.

**Justificativa:** a entrega precisa atender tanto a aula presencial quanto aplicações posteriores por outro professor. Um artefato descartável reduziria o tempo inicial, mas não satisfaria reutilização, rastreabilidade curricular ou manutenção.

**Consequências:** o escopo inclui produto, conteúdo, implantação, contingência e qualidade. A conclusão não poderá ser declarada com base apenas em uma interface demonstrável. O cronograma deverá proteger o caminho crítico e registrar itens ainda não comprovados.

**Revisão:** reabrir se o usuário reduzir explicitamente o escopo ou se uma dependência externa impedir parte da solução e uma alternativa limitada for aceita.

### DECISAO-002 - Entregar o portal antes do simulado

**Estado:** `APROVADA`

**Contexto:** as duas frentes possuem valor, mas respondem a momentos operacionais diferentes. O portal serve à dinâmica presencial imediata; o simulado poderá ser aplicado por outro professor na segunda-feira subsequente ao pedido. A associação ao dia 21 de setembro de 2026 é uma inferência de calendário, não uma data formalmente confirmada pelo usuário.

**Alternativas consideradas:** desenvolver ambos simultaneamente; começar pelo simulado; começar pelo portal; produzir primeiro apenas o banco de perguntas.

**Decisão:** priorizar um fluxo vertical completo do portal e iniciar o simulado depois que o portal possuir caminho utilizável e validado.

**Justificativa:** a ordem reduz risco de perder a atividade coletiva mais próxima e evita duas implementações parcialmente funcionais. Modelos de conteúdo, validação e relatórios serão compartilhados quando isso reduzir duplicação real.

**Consequências:** decisões comuns devem considerar o simulado, mas funcionalidades exclusivas dele não podem atrasar o portal. O banco de 300 questões permanece obrigatório para a entrega final, não para o primeiro marco operacional do portal.

**Revisão:** reabrir se a data de aplicação do simulado for antecipada ou se o portal deixar de ser necessário para a primeira aula.

## 4. Decisões curriculares e pedagógicas

### DECISAO-006 - Organizar conteúdo em três eixos, 16 unidades curriculares e 300 questões mínimas

**Estado:** `APROVADA`

**Contexto:** o plano de curso possui 16 unidades curriculares e 1.200 horas. A navegação direta por 16 categorias seria granular para a interface inicial, enquanto categorias genéricas perderiam rastreabilidade.

**Alternativas consideradas:** uma categoria por tema livre; 16 categorias principais; três eixos profissionais sem detalhamento; três eixos com classificação obrigatória por UC.

**Decisão:** apresentar três eixos principais, manter em cada atividade ou questão a ligação com uma ou mais UCs e produzir no mínimo 100 questões válidas por eixo, totalizando 300 itens iniciais.

**Justificativa:** os eixos correspondem às qualificações de suporte e manutenção, operação de redes e desenvolvimento de aplicativos. A dupla classificação equilibra simplicidade de uso e precisão curricular.

**Consequências:** o modelo de conteúdo deverá exigir `eixo`, `unidadesCurriculares` e referências curriculares. Relatórios poderão agregar resultados por eixo e detalhar por UC. Nenhuma questão será aceita somente com uma categoria ampla, e variações meramente lexicais não contarão para o mínimo.

**Revisão:** reabrir se o inventário curricular demonstrar que uma quarta categoria é necessária para evitar agrupamento artificial, preservando a classificação por UC.

### DECISAO-003 - Usar equipes como identidade competitiva principal

**Estado:** `APROVADA`

**Contexto:** o usuário autorizou nomes reais, mas prefere que a apresentação dos resultados destaque as equipes. A dinâmica deve promover colaboração e evitar exposição desnecessária de alunos com desempenho inferior.

**Alternativas consideradas:** ranking individual nominal; ranking por apelidos individuais; ranking somente por equipe; ausência de ranking.

**Decisão:** exibir ranking por equipe como padrão. Nome ou apelido individual será opcional e limitado à sessão. O desempenho individual poderá existir apenas em visões reservadas e quando houver finalidade pedagógica definida.

**Justificativa:** o formato favorece cooperação, reduz tratamento desnecessário de dados pessoais e se alinha ao portal de desafios coletivos. A ausência total de ranking retiraria um mecanismo solicitado de engajamento.

**Consequências:** o modelo de sessão deve funcionar sem cadastro nominal. Telas projetadas para a turma não podem revelar resultados individuais. Critérios de desempate e ajustes do professor precisam ser transparentes.

**Revisão:** reabrir se a atividade exigir avaliação individual formal, mediante definição de privacidade, acesso e retenção.

### DECISAO-020 - Documentar operação para outro professor

**Estado:** `APROVADA`

**Contexto:** o simulado será aplicado por um professor diferente. Conhecimento apenas oral ou dependente do desenvolvedor cria risco de falha operacional.

**Alternativas consideradas:** treinamento informal; guia resumido sem verificação; documentação operacional testada por alguém que não implementou o recurso.

**Decisão:** produzir guia do professor, roteiro de aplicação, configuração, solução de problemas e plano de contingência, submetidos a teste de seguimento.

**Justificativa:** a transferência é parte da entrega funcional. Uma aplicação tecnicamente correta, mas incompreensível para o aplicador, não atende o objetivo.

**Consequências:** instruções não podem depender de conhecimento oculto. Parâmetros, credenciais, sequências e sinais de sucesso ou falha devem estar explicitados sem expor segredos.

**Revisão:** reabrir apenas se o mesmo professor assumir formalmente todas as aplicações, mantendo documentação mínima de manutenção.

## 5. Decisões de hospedagem e operação

### DECISAO-005 - Usar Cloudflare Pages, Pages Functions e D1

**Estado:** `APROVADA`

**Contexto:** uma publicação na Internet melhora acesso e reduz dependência da configuração da sala. O produto, entretanto, precisa de API e persistência compartilhada para sessões, equipes e ranking.

**Alternativas consideradas:** somente rede local; GitHub Pages; Cloudflare Pages somente estático; Cloudflare Pages com Functions e D1; provedor ainda não definido.

**Decisão:** usar Cloudflare Pages como destino principal, integrado a Pages Functions e D1. GitHub Pages poderá hospedar somente demonstração estática, documentação pública ou cliente desacoplado.

**Justificativa:** a plataforma suporta ativos estáticos, funções e vínculo com banco D1 em uma implantação coerente. A carga prevista para 18 alunos é pequena em relação aos limites publicados, embora a cota real da conta deva ser verificada antes da aula.

**Consequências:** haverá configuração Wrangler, migrações D1, ambientes de desenvolvimento e produção e documentação de publicação. Identificadores e credenciais permanecerão fora do repositório. A prova de publicação dependerá de acesso à conta Cloudflare.

**Revisão:** reabrir se a conta não estiver disponível, se políticas institucionais impedirem o serviço ou se testes demonstrarem incompatibilidade operacional.

### DECISAO-004 - Preferir publicação na Internet e manter operação local

**Estado:** `APROVADA`

**Contexto:** a Internet pode falhar durante uma aula, mas os dispositivos ainda podem compartilhar a rede local. O usuário indicou a rede local como primeira ideia e considerou a publicação na Internet preferível.

**Alternativas consideradas:** depender exclusivamente da Internet; operar somente no computador do professor; distribuir cópias independentes; manter servidor local compatível com os mesmos contratos.

**Decisão:** preferir a publicação na Internet para o uso normal e oferecer um modo local iniciado no computador do professor, acessível pelos demais dispositivos da sala quando a rede permitir.

**Justificativa:** a contingência protege o evento sem criar uma aplicação diferente. O ambiente local do Wrangler permite executar Functions e persistência local com contratos próximos do ambiente publicado.

**Consequências:** o projeto terá launcher Windows e procedimento para descobrir o endereço local, liberar firewall quando autorizado, testar por outro dispositivo e exportar resultados. PWA não será apresentada como substituta de rede entre dispositivos.

**Revisão:** reabrir se a infraestrutura da sala não permitir comunicação local; nesse caso, a contingência deverá usar atividades impressas ou operação em um dispositivo compartilhado.

### DECISAO-016 - Garantir alternativas acessíveis nos fluxos essenciais

**Estado:** `APROVADA`

**Contexto:** a atividade será usada por uma turma heterogênea, em computadores possivelmente diferentes e sob pressão de tempo. Interações dependentes apenas de cor, animação, áudio, precisão motora ou atualização automática podem excluir participantes e impedir a conclusão do fluxo.

**Alternativas consideradas:** tratar acessibilidade somente após a primeira versão; limitar a conformidade a contraste visual; aplicar critérios de acessibilidade desde os componentes básicos e oferecer alternativas equivalentes nos fluxos essenciais.

**Decisão:** implementar navegação por teclado, foco visível, semântica compatível com tecnologia assistiva, contraste verificável, mensagens textuais e alternativas não temporizadas ou controláveis para os fluxos essenciais do portal e do simulado.

**Justificativa:** uma alternativa acessível preserva o objetivo pedagógico sem criar uma experiência paralela inferior. A correção precoce em componentes compartilhados custa menos que adaptar telas concluídas.

**Consequências:** atividades que usem áudio, arrastar e soltar, limite de tempo, animação ou codificação por cor deverão declarar a alternativa equivalente. Testes automatizados serão complementados por verificação manual de teclado, foco, ampliação e leitura de mensagens.

**Revisão:** os critérios poderão ser ampliados após avaliação com usuários, mas não reduzidos sem registrar uma impossibilidade técnica e uma acomodação pedagógica equivalente.

## 6. Decisões de arquitetura e tecnologia

### DECISAO-007 - Adotar monólito modular orientado a funcionalidades

**Estado:** `APROVADA`

**Contexto:** portal e simulado compartilham currículo, identidade de sessão, validação, relatórios e componentes. O volume inicial e a equipe de manutenção não justificam serviços independentes.

**Alternativas consideradas:** aplicação monolítica sem módulos; microsserviços; repositórios separados; monólito modular com limites internos.

**Decisão:** manter uma implantação principal com limites internos explícitos entre domínio, aplicação, infraestrutura e interface.

**Justificativa:** o modelo reduz custo operacional e ainda preserva responsabilidades claras. A separação por funcionalidade aproxima regras, componentes e testes que mudam juntos.

**Consequências:** dependências entre módulos devem passar por contratos explícitos. O diretório `shared` não pode se tornar depósito genérico. Não haverá mensageria distribuída ou consistência entre serviços na primeira versão.

**Revisão:** reabrir somente com evidência de escala, autonomia de equipes ou requisitos de implantação independente.

### DECISAO-008 - Usar React, TypeScript e Vite no frontend

**Estado:** `APROVADA`

**Contexto:** a aplicação exige estado interativo, múltiplas experiências, componentes acessíveis, testes e build estático compatível com Pages.

**Alternativas consideradas:** HTML e JavaScript sem framework; React com ferramenta de build; framework com renderização no servidor; aplicação desktop instalada.

**Decisão:** usar React para composição de interface, TypeScript para contratos e Vite para desenvolvimento e build.

**Justificativa:** a combinação atende o nível de interação sem introduzir servidor de renderização. TypeScript reduz divergência entre conteúdo, API e interface quando usado com validação em runtime.

**Consequências:** versões serão fixadas no arquivo de dependências e verificadas antes da instalação. Componentes devem priorizar semântica nativa e não esconder regras de domínio em hooks de apresentação.

**Revisão:** reabrir se uma implementação sem framework demonstrar redução material de prazo sem perda de testes, acessibilidade e manutenção.

### DECISAO-009 - Usar D1 publicado e persistência local do Wrangler

**Estado:** `APROVADA`

**Contexto:** sessões e pontuações precisam ser compartilhadas entre dispositivos e persistir além do armazenamento de um único navegador.

**Alternativas consideradas:** `localStorage`; arquivo JSON no cliente; servidor Node dedicado; serviço de banco externo; Pages Functions com D1.

**Decisão:** implementar rotas HTTP em Pages Functions, persistir dados relacionais no D1 publicado e usar a persistência local do Wrangler em desenvolvimento e contingência.

**Justificativa:** a escolha acompanha a hospedagem principal, fornece SQL adequado ao domínio e evita operar um servidor permanente. O mesmo modelo poderá ser executado localmente durante desenvolvimento e contingência.

**Consequências:** serão necessárias migrações compatíveis, validação de entrada, autorização do professor, transações adequadas, exportação e contratos de repositório. `localStorage` poderá guardar preferências e rascunhos, mas não será a autoridade do ranking compartilhado. A restauração entre ambientes será deliberada, não uma sincronização implícita.

**Revisão:** reabrir se testes de concorrência, disponibilidade, portabilidade ou política institucional invalidarem o D1 ou a execução local do Wrangler.

### DECISAO-010 - Separar a aplicação em seis módulos funcionais

**Estado:** `APROVADA`

**Contexto:** portal e simulado compartilham infraestrutura, mas possuem regras e ritmos de entrega distintos. Uma divisão apenas por tipo técnico espalharia cada funcionalidade por muitos diretórios e dificultaria verificar o escopo.

**Alternativas consideradas:** separar somente em `components`, `services` e `utils`; criar pacotes independentes; manter um único diretório sem limites; organizar por seis funcionalidades explícitas.

**Decisão:** estruturar a aplicação nos módulos `recap`, `simulado`, `content`, `reporting`, `administration` e `shared`, cada um com contratos públicos mínimos e testes próximos às regras que protege.

**Justificativa:** os seis módulos correspondem a capacidades do produto e permitem entregar o portal antes do simulado sem duplicar conteúdo, relatórios ou administração.

**Consequências:** importações cruzadas não poderão contornar contratos públicos. `shared` conterá apenas elementos realmente usados por mais de um módulo e não regras específicas disfarçadas de utilidades.

**Revisão:** reabrir se análise de dependências demonstrar outro limite funcional mais coeso, preservando rastreabilidade e implantação única.

### DECISAO-011 - Separar conteúdo curricular do código executável

**Estado:** `APROVADA`

**Contexto:** professores precisam revisar e ampliar questões e atividades sem alterar componentes da aplicação. Conteúdo curricular possui ciclo de aprovação diferente do código.

**Alternativas consideradas:** conteúdo embutido em componentes; tabelas editadas diretamente no banco; arquivos estruturados versionados; sistema completo de autoria na primeira versão.

**Decisão:** manter fontes de conteúdo em arquivos estruturados validados por esquema e oferecer processo de importação para o ambiente operacional.

**Justificativa:** arquivos versionados favorecem revisão, comparação, rastreabilidade e testes. Um editor completo aumentaria o escopo inicial; edição direta no banco reduziria auditabilidade.

**Consequências:** cada item deverá possuir identificador estável, versão, eixo, UC, dificuldade, tipo, enunciado, regra de correção, feedback e fonte. Mudanças após uso exigirão nova versão para preservar resultados históricos.

**Revisão:** reabrir quando o custo de manutenção manual justificar um módulo de autoria.

## 7. Decisões de identidade, integridade e qualidade

### DECISAO-012 - Não exigir conta permanente de aluno

**Estado:** `APROVADA`

**Contexto:** a atividade deve começar rapidamente em uma aula de três horas. Cadastro, confirmação de e-mail e recuperação de senha aumentariam atrito e tratamento de dados.

**Alternativas consideradas:** conta individual permanente; autenticação institucional; código de sessão com equipe; acesso totalmente anônimo.

**Decisão:** alunos entram com código de sessão, equipe e identificação opcional. O professor utiliza credencial ou segredo de sessão apropriado ao painel administrativo.

**Justificativa:** o modelo reduz tempo de entrada e coleta de dados, preservando controle suficiente para o evento.

**Consequências:** códigos devem possuir entropia e validade adequadas. Ações administrativas nunca podem ser autorizadas apenas pelo código usado por alunos.

**Revisão:** reabrir se houver integração institucional ou necessidade comprovada de histórico longitudinal individual.

### DECISAO-013 - Tornar pontuação idempotente e auditável

**Estado:** `APROVADA`

**Contexto:** conexões instáveis e cliques repetidos podem reenviar respostas. Ajustes manuais do professor precisam ser explicáveis.

**Alternativas consideradas:** atualizar somente um total; confiar no cliente; registrar eventos de pontuação com chave idempotente.

**Decisão:** tratar o total como resultado derivado de eventos autorizados. Cada operação recebe identificador idempotente e registra sessão, equipe, atividade, valor, motivo, origem e horário.

**Justificativa:** o registro evita duplicidade, permite reconstrução e fornece transparência para correções.

**Consequências:** relatórios podem explicar cada total. Exclusão destrutiva de eventos não será usada para corrigir pontos; ajustes compensatórios preservarão o histórico.

**Revisão:** reabrir apenas se o modelo de eventos se mostrar incompatível com limites técnicos comprovados.

### DECISAO-014 - Implementar os comportamentos obrigatórios do simulado

**Estado:** `APROVADA`

**Contexto:** o simulado precisa servir à prática orientada, e não apenas calcular uma nota. O prompt requer tipos variados, sorteio, explicação, nova tentativa dos erros e registro de progresso.

**Alternativas consideradas:** prova linear com correção apenas no final; sequência fixa com respostas de múltipla escolha; motor de sessão com tipos variados, aleatorização controlada, correção explicada e revisão dos erros.

**Decisão:** suportar múltipla escolha, verdadeiro ou falso e resposta curta com regra de correção explícita; permitir sorteio por eixo e UC, ordem aleatória quando configurada, feedback explicativo após resposta, nova tentativa focada nos erros e resumo por eixo e UC.

**Justificativa:** os comportamentos transformam erro em oportunidade de aprendizagem e permitem que outro professor aplique uma sessão coerente sem montar manualmente cada sequência.

**Consequências:** cada tipo de questão deverá possuir esquema e testes próprios. Respostas curtas aceitarão somente normalizações e variantes previamente declaradas; casos ambíguos serão marcados para revisão do professor, sem avaliação semântica opaca. Sorteios deverão ser reproduzíveis por identificador ou semente quando necessário para auditoria.

**Revisão:** reabrir se a aplicação deixar de usar prática formativa ou se evidência pedagógica recomendar outro momento de feedback.

### DECISAO-015 - Aplicar verificação automatizada em quatro níveis

**Estado:** `APROVADA`

**Contexto:** erros em correção, sorteio ou pontuação afetam diretamente a experiência pedagógica. Teste apenas manual não oferece repetibilidade suficiente.

**Alternativas consideradas:** teste manual; somente testes ponta a ponta; testes unitários e manuais; combinação de unidade, integração, ponta a ponta e acessibilidade.

**Decisão:** usar Vitest para regras, React Testing Library para componentes, testes de integração para API e persistência, Playwright para fluxos reais e verificações automatizadas de acessibilidade.

**Justificativa:** cada nível cobre uma classe de risco. A pirâmide reduz dependência de testes lentos e mantém prova dos fluxos críticos.

**Consequências:** toda funcionalidade deve declarar quais níveis são aplicáveis. Ausência de teste exige justificativa registrada, não uma aprovação silenciosa.

**Revisão:** reabrir ferramentas específicas se incompatibilidades surgirem; manter os quatro níveis como requisito conceitual.

## 8. Decisões de continuidade e processo

### DECISAO-017 - Exportar evidências em CSV e JSON

**Estado:** `APROVADA`

**Contexto:** resultados precisam sobreviver à sessão, ser inspecionáveis fora da aplicação e apoiar análise pedagógica. Um único formato atende mal tanto leitura tabular quanto restauração ou integração.

**Alternativas consideradas:** relatório somente na tela; exportação apenas em PDF; CSV; JSON; exportação complementar em CSV e JSON.

**Decisão:** permitir ao professor exportar dados autorizados da sessão em CSV para análise tabular e em JSON versionado para preservação estruturada, diagnóstico e eventual reimportação controlada.

**Justificativa:** CSV é amplamente utilizável em planilhas; JSON mantém relações, tipos e metadados que se perderiam em uma tabela plana. A combinação reduz dependência do serviço publicado.

**Consequências:** os formatos terão versão, dicionário de campos, codificação UTF-8 sem BOM e testes com acentos. Dados pessoais opcionais serão minimizados e não aparecerão em exportação pública por padrão.

**Revisão:** reabrir quando houver requisito institucional de outro formato ou quando um processo de restauração exigir pacote assinado ou criptografado.

### DECISAO-018 - Reutilizar recursos externos somente após validação de licença

**Estado:** `APROVADA`

**Contexto:** foram identificados projetos externos potencialmente úteis para laboratório de montagem, redes e SQL. Similaridade funcional não concede autorização de cópia, e dependências externas podem introduzir riscos de segurança, manutenção ou incompatibilidade pedagógica.

**Alternativas consideradas:** copiar trechos sem análise; incorporar qualquer repositório público; usar somente como referência conceitual; reutilizar apenas após confirmar licença, procedência, compatibilidade e necessidade.

**Decisão:** nenhum código, ativo, banco de questões ou componente externo será incorporado sem licença compatível registrada, revisão técnica e atribuição exigida. Até essa prova, candidatos externos permanecem referências não adotadas.

**Justificativa:** a regra protege o projeto contra violação autoral e dependência não auditada, sem impedir reuso legítimo quando ele oferece vantagem comprovável.

**Consequências:** a pesquisa deve registrar URL, versão ou commit, licença, arquivos reutilizados, modificações, avisos e testes. Ausência de licença explícita será tratada como proibição de incorporação.

**Revisão:** reabrir apenas diante de política institucional mais restritiva; nenhuma revisão poderá presumir permissão onde a licença não existe.

### DECISAO-019 - Executar uma unidade por vez sem aprovação intermediária obrigatória

**Estado:** `APROVADA`

**Contexto:** o processo original determinava gerar um arquivo ou módulo por vez e solicitar aprovação após cada unidade. O usuário aprovou continuidade autônoma e declarou que não precisa ser consultado em cada interação.

**Alternativas consideradas:** continuar pedindo aprovação por arquivo; gerar tudo em lote sem portas intermediárias; executar sequencialmente e interromper somente por bloqueio material.

**Decisão:** manter a disciplina de uma unidade por vez, com validação antes da seguinte, mas avançar automaticamente sem pedir aprovação intermediária.

**Justificativa:** a escolha preserva profundidade, revisão e rastreabilidade, removendo apenas a latência de confirmações repetitivas.

**Consequências:** o agente deve emitir atualizações periódicas, registrar falhas e parar quando uma escolha do usuário for indispensável. A autonomia não autoriza publicação externa, credenciais, dados pessoais ou expansão de escopo não aprovada.

**Revisão:** reabrir se o usuário solicitar revisão manual por etapa ou pausar a execução.

## 9. Controles complementares das decisões

Os campos abaixo completam o registro arquitetural sem repetir a narrativa de cada decisão. `Controle negativo` identifica algo que não pode ser aceito como prova da decisão. `Evidência atual` distingue autorização normativa de implementação verificada; nesta versão, as escolhas estão aprovadas, mas o código e a operação ainda não foram comprovados.

| ID | Custo aceito | Controle negativo | Condição de reversão | Rastreabilidade | Evidência atual |
|---|---|---|---|---|---|
| DECISAO-001 | Maior escopo, documentação e testes | Protótipo visual isolado não prova solução completa | Redução explícita de escopo ou impedimento aceito | Prompt inicial e confirmação `Solução completa` | Aprovação do usuário; implementação pendente |
| DECISAO-002 | Simulado começa depois do marco do portal | Componentes dispersos não provam fluxo utilizável | Antecipação formal do simulado | Confirmação `O Simulado pode ser feito depois` | Ordem aprovada; marcos pendentes |
| DECISAO-003 | Menor destaque individual e mais regras de sessão | Ocultar nomes na tela não prova minimização no banco | Avaliação individual formal com política definida | Preferência `mostrar as equipes` | Regra aprovada; telas pendentes |
| DECISAO-004 | Manter dois modos operacionais compatíveis | Cache PWA isolado não prova colaboração local | Rede local inviável ou política institucional | Preferência por Internet com ideia inicial em LAN | Estratégia aprovada; ensaio pendente |
| DECISAO-005 | Configuração de provedor, migrações e observabilidade | Página estática publicada não prova ranking compartilhado | Indisponibilidade de conta, política ou limite técnico | Requisito de publicação e pesquisa oficial Cloudflare | Plataforma aprovada; conta não comprovada |
| DECISAO-006 | Curadoria mínima de 300 itens e taxonomia dupla | Variações lexicais ou itens sem UC não contam na cobertura | Nova taxonomia determinada pelo professor | Prompt inicial e plano de curso | Quantidade aprovada; banco pendente |
| DECISAO-007 | Disciplina de dependências dentro de uma implantação | Pastas com nomes de módulos não provam isolamento | Necessidade comprovada de implantação independente | Arquitetura aprovada na fase 2 | Modelo aprovado; análise de dependências pendente |
| DECISAO-008 | Toolchain, build e atualização de dependências | Aplicação que apenas compila não prova qualidade | Alternativa mais simples com equivalência comprovada | Arquitetura aprovada na fase 2 | Stack aprovada; versões pendentes |
| DECISAO-009 | Migrações e diferenças controladas entre D1 e local | `localStorage` não prova persistência compartilhada | Falha comprovada de portabilidade, política ou concorrência | DECISAO-004 e DECISAO-005 | Persistência aprovada; ensaios pendentes |
| DECISAO-010 | Contratos públicos e fiscalização de importações | Seis diretórios vazios não provam modularidade | Grafo de dependências indicar limite mais coeso | Mapa modular aprovado na fase 2 | Módulos aprovados; código pendente |
| DECISAO-011 | Esquemas, importação e versionamento de conteúdo | JSON sintaticamente válido sem semântica não é conteúdo aprovado | Necessidade comprovada de autoria integrada | Requisito de banco reutilizável e manutenção docente | Estratégia aprovada; esquema pendente |
| DECISAO-012 | Gestão de códigos temporários e segredo administrativo | Código de aluno não autoriza painel de professor | Integração institucional ou histórico longitudinal | Turma de 18 alunos e dinâmica de curta duração | Modelo aprovado; autenticação docente pendente |
| DECISAO-013 | Armazenar eventos e calcular totais derivados | Total gravado ou calculado pelo cliente não prova integridade | Limite técnico demonstrado e alternativa auditável | Requisitos de placar e ajustes do professor | Regra aprovada; teste de concorrência pendente |
| DECISAO-014 | Esquemas e correção próprios por tipo de questão | Correspondência sem regra declarada não corrige resposta curta | Mudança de finalidade pedagógica | Comportamentos pedidos no prompt inicial | Comportamentos aprovados; motor pendente |
| DECISAO-015 | Tempo de automação e manutenção da suíte | Cobertura percentual isolada não prova fluxos críticos | Troca de ferramenta com preservação dos quatro níveis | Critérios de aceite e contrato global | Estratégia aprovada; suíte pendente |
| DECISAO-016 | Alternativas equivalentes e verificação manual | Ausência de erro automático não prova acessibilidade | Ampliação por evidência; redução exige acomodação registrada | Inclusão no prompt e critérios não funcionais | Critérios aprovados; auditoria pendente |
| DECISAO-017 | Dois formatos, versionamento e dicionário | Captura de tela não prova exportação recuperável | Formato institucional obrigatório | Requisitos de relatório e contingência | Formatos aprovados; arquivos de prova pendentes |
| DECISAO-018 | Revisão jurídica e técnica antes do reuso | Repositório público sem licença não concede permissão | Política institucional mais restritiva | Pesquisa de referências externas | Regra aprovada; nenhuma incorporação autorizada |
| DECISAO-019 | Validação interna antes de cada unidade | Velocidade ou volume de arquivos não prova conclusão | Solicitação do usuário para pausar ou revisar por etapa | Mensagem `não precisa me perguntar a cada interação` | Autonomia confirmada e em vigor |
| DECISAO-020 | Produção e teste de documentação operacional | Guia não executado não prova transferência | Mudança formal do responsável pela aplicação | Pedido para outro professor aplicar o simulado | Obrigação aprovada; teste de seguimento pendente |

## 10. Relações e conflitos

As decisões formam uma cadeia de dependências:

- DECISAO-001 estabelece o escopo que DECISAO-002 ordena.
- DECISAO-003 condiciona o ranking protegido por DECISAO-012 e DECISAO-013.
- DECISAO-004 e DECISAO-005 restringem a persistência definida na DECISAO-009.
- DECISAO-006 fornece a taxonomia para DECISAO-011 e DECISAO-014.
- DECISAO-007 define os limites que DECISAO-010 nomeia e que DECISAO-008 implementará.
- DECISAO-012 condiciona qualquer implementação de identidade e acesso administrativo.
- DECISAO-013 condiciona ranking, ajustes e exportações da DECISAO-017.
- DECISAO-015 é a prova exigida para todas as decisões implementáveis.
- DECISAO-016 impõe alternativas acessíveis ao portal e ao simulado.
- DECISAO-018 restringe qualquer incorporação externa em todos os módulos.
- DECISAO-019 altera o ritual de aprovação, mas não reduz qualidade nem amplia autoridade.
- DECISAO-020 transforma a segunda aplicação por outro professor em critério de continuidade.

Não foi identificado conflito interno entre as decisões ativas. Permanecem dependências não comprovadas: acesso à conta Cloudflare, capacidade do computador do professor, comunicação entre dispositivos na rede local e disponibilidade de dispositivos para os alunos. Essas dependências devem aparecer no registro de riscos e nas provas operacionais.

## 11. Critério de manutenção

Antes de implementar uma unidade, o responsável deve identificar as decisões aplicáveis. Depois da implementação, deve registrar evidência suficiente para confirmar que a unidade respeita essas decisões. Quando uma mudança contrariar uma decisão ativa, o fluxo correto é reabrir ou substituir a decisão antes de alterar o produto.

Este registro estará íntegro quando todos os identificadores forem únicos, todos os estados forem válidos, alternativas e consequências estiverem presentes, links internos resolverem e cada decisão implementada possuir rastreabilidade para requisito, teste ou prova. Decisões sem evidência de implementação permanecem normativas, não comprovadas.
