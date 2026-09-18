> Resumo: o projeto possui governança validada, arquitetura definida e um primeiro fluxo vertical executável do portal. Sessão, equipes, entrada temporária, pontuação idempotente e ranking foram comprovados em Wrangler com D1 local; o banco de atividades, as 300 questões, o simulado, os relatórios e a implantação Cloudflare permanecem pendentes.

# Handoff 001 - Fundação e fluxo vertical do portal

```json
{"id":"HANDOFF-001","data":"2026-09-18","estado":"EM_EXECUCAO","marco":"M1-PORTAL","ultimo_comando":"npm run validate","ultimo_resultado":0}
```

## Entregas concluídas

- `AGENTS.md` define contrato de execução, linguagem, privacidade, qualidade, governança e limites do projeto.
- A [visão geral](../00_governanca/00_visao-geral.md), o [registro de decisões](../00_governanca/01_decisoes.md), o [registro de riscos](../00_governanca/02_riscos.md) e a [especificação de requisitos](../00_governanca/03_requisitos.md) foram criados e validados.
- A [arquitetura](../03_arquitetura/00_arquitetura.md) registra módulos, topologias, modelo de domínio, persistência, API, segurança, acessibilidade e estratégia de testes.
- A taxonomia extraída do plano de curso contém três eixos, 16 UCs e cargas de 272, 308 e 620 horas, totalizando 1.200 horas.
- O frontend React apresenta início, entrada de aluno, estado do simulado e painel do professor. O professor pode criar uma sessão inicial com seis equipes; o aluno pode localizar o código e entrar em uma equipe.
- Pages Functions expõe saúde, criação e consulta de sessão, entrada temporária, pontuação administrativa idempotente e ranking público quando visível.
- A migração D1 cria sessões, equipes, participações temporárias, atividades versionadas, rodadas, eventos de pontuação, auditoria, índices e projeção de totais.
- `iniciar.bat` verifica dependências, gera segredo administrativo local fora do Git, aplica migrações, compila e inicia Wrangler em endereço acessível na LAN.
- PWA, acessibilidade básica, tipagem estrita, Biome, Vitest e build Vite estão configurados.

## Evidência executada

`npm run validate` terminou com código 0. O lint verificou 34 arquivos. A validação curricular confirmou 16 UCs, 1.200 horas e três eixos. A suíte executou 11 testes em três arquivos, todos aprovados. O build transformou 20 módulos e gerou os arquivos finais.

O ensaio HTTP real iniciou Wrangler 4.135.0 contra D1 local. A rota de saúde respondeu `ok`; uma sessão em estado `LOBBY` foi criada com duas equipes de ensaio; a consulta pública devolveu ambas; a entrada retornou token temporário; um evento de 10 pontos foi aplicado; o mesmo comando com a mesma chave idempotente retornou `applied=false`; e o ranking apresentou a Equipe Alfa com 10 pontos. O servidor registrou respostas 200 e 201 em todas as etapas esperadas.

As verificações documentais confirmaram UTF-8 sem BOM, LF, metadados JSON, links resolvidos, identificadores únicos e `git diff --check` com código 0 nos documentos de governança concluídos.

## Estado honesto do escopo

O fluxo vertical é fundação funcional, não a solução completa. A interface ainda não oferece ação visual para conceder pontos, controlar rodadas, ocultar ranking, exportar CSV ou JSON e encerrar sessão. A API não implementa mudança de estado, autenticação de participante em ações posteriores, limitação de tentativas, retenção ou expurgo. O segredo administrativo local é apropriado ao ensaio, mas a autenticação de produção continua decisão aberta.

Nenhuma atividade curricular foi aprovada no catálogo e nenhuma das 300 questões foi produzida. O validador relata explicitamente zero atividades e zero questões; o requisito do banco completo ainda não integra o portão do marco do portal. O simulado permanece apenas descrito na interface. Não existe certificado simbólico gerado, teste Playwright, teste automatizado de acessibilidade, teste de carga com 18 clientes nem prova por segundo dispositivo na LAN.

Cloudflare não foi publicada porque conta, identificador D1 e autorização externa não foram fornecidos. O arquivo Wrangler está preparado para operação local; a configuração remota exigirá criar ou selecionar banco, registrar seu identificador, configurar segredo e aplicar migração remota com autorização do usuário.

## Próxima sequência obrigatória

1. Completar o painel do professor com pontuação, visibilidade de ranking, estados da sessão e exportação.
2. Criar tela pública do ranking e experiência de equipe com uma atividade vertical aprovada.
3. Produzir catálogo inicial de desafios para hardware, redes, banco de dados e lógica, passando pelo esquema e revisão.
4. Adicionar integração D1 automatizada, Playwright, acessibilidade e carga de 18 participantes.
5. Ensaiar `iniciar.bat` em segundo dispositivo e documentar firewall e endereço local.
6. Implementar relatórios CSV e JSON e o reconhecimento simbólico claramente não institucional.
7. Implementar o motor do simulado, depois produzir e revisar 100 questões por eixo.
8. Registrar política de retenção, autenticação de produção e regra de desempate antes da publicação.

## Restrições preservadas

Não incorporar repositório externo sem licença verificada. Não publicar nomes ou dados reais em fixtures. Não considerar PWA substituta de rede. Não executar publicação ou migração remota sem credencial e autoridade. Não marcar o banco de questões como concluído apenas por atingir quantidade; itens precisam de explicação, vínculo curricular, revisão e ausência de duplicidade material.
