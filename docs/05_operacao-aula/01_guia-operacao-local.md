> Resumo: este guia permite conduzir uma sessão local de Recap com entrada por equipes, catálogo revisável de atividades das 16 UCs, pontuação manual auditável e placar, sem depender de publicação externa.

# Guia de operação local da aula

## 1. Limite de uso desta versão

Esta versão permite atividades conduzidas pelo professor. Os 16 arquivos em `content/activities/` estão em `IN_REVIEW`; o professor deve revisar e aprovar o enunciado, os critérios e a pontuação antes de apresentá-los à turma. O simulado e o banco completo de questões não fazem parte deste guia.

## 2. Preparação antes da turma

1. Conecte o computador do professor e os dispositivos participantes à mesma rede local.
2. Na raiz do projeto, execute `iniciar.bat` por duplo clique ou em PowerShell com `./iniciar.bat`.
3. Aguarde a mensagem `[OK]` indicando a porta `8788`. O launcher instala dependências quando necessário, verifica o segredo local, aplica as migrações e gera a aplicação.
4. Copie o endereço IPv4 exibido pelo runtime, substituindo `127.0.0.1` no formato `http://<IPv4>:8788`.
5. Em um segundo dispositivo, abra esse endereço e confirme que a tela inicial aparece. Se falhar, use somente o computador do professor e aplique a atividade em papel ou no quadro.

## 3. Abertura da sessão

1. No computador do professor, abra `http://127.0.0.1:8788` e escolha `Área do professor`.
2. Informe o segredo administrativo mostrado pelo launcher. Não projete nem compartilhe esse segredo.
3. Selecione `Criar sessão com seis equipes` e projete apenas o código de sessão gerado.
4. Cada equipe abre o endereço da rede local, seleciona `Entrar na sessão`, informa o código e escolhe sua equipe.
5. Confirme visualmente que as equipes entraram. Não é necessário coletar nomes individuais.

## 4. Catálogo de atividades curriculares

1. Antes de iniciar, revise o arquivo da atividade escolhida e confirme sua aprovação pedagógica para a turma.
2. No painel do professor, selecione `Rodada 1`, `Rodada 2` ou `Rodada 3`. A seleção é persistida na sessão e o portal atualiza a atividade atribuída a cada equipe em até cinco segundos.
3. A distribuição cobre UC01 a UC16 nas três rodadas, com UC01 e UC09 como revisões adicionais. As equipes não escolhem a UC; elas recebem a atividade correspondente à sua equipe e à rodada atual.
4. Apresente o cenário, os materiais e os critérios da atividade exibida. Cada atividade reserva entre 15 e 20 minutos e vale até 20 pontos.
5. Use `Iniciar atividade` no painel do professor.
6. Avalie a evidência pelos critérios do arquivo. Registre a pontuação no painel, escolhendo a equipe, os pontos e o motivo pedagógico.
7. Use `Pausar atividade` e `Retomar atividade` quando necessário. Use `Ocultar placar` quando o placar puder interferir na discussão.
8. Ao final, use `Encerrar sessão`. Uma sessão encerrada não pode ser reaberta.

## 5. Contingência

- Sem acesso de aluno à rede: mantenha a atividade no quadro ou em papel e use o painel do professor apenas para pontuar.
- Sem acesso ao portal: registre equipe, pontos, motivo e horário em uma planilha local; depois, crie uma nova sessão e lance os pontos uma única vez.
- Se o processo parar: reinicie `iniciar.bat`. Não reutilize uma sessão encerrada; crie uma nova.
- Não registre nomes, e-mails ou dados pessoais desnecessários.

## 6. Fechamento e evidência

Anote o código da sessão, as equipes participantes, as pontuações e qualquer incidente operacional. A prova técnica do fluxo local está em `docs/00_governanca/04_provas.md` como `PROVA-007`; a validação em segundo dispositivo permanece [UNVERIFIED] até ser executada durante a preparação da aula.
