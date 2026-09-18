> Resumo: este handoff encerra a entrega técnica do Recap SENAC 2026, incluindo o portal colaborativo, o simulado, entregas persistidas, feedback docente, exportação e publicação estática no GitHub Pages.

# Handoff 004 - Entrega e publicação

## Estado entregue

- Sessões, equipes, rodadas, pontuação auditável e ranking estão disponíveis no modo local/Cloudflare.
- Entregas de atividade agora são persistidas por sessão, equipe, atividade e rodada; a equipe usa token temporário e o professor revisa, devolve feedback e registra pontos.
- O professor pode exportar as entregas carregadas em CSV ou JSON, sem tokens ou segredo administrativo.
- O simulado oferece seleção curricular, sorteio, correção, explicação, retomada, reforço de erros e certificado simbólico.
- A publicação estática foi configurada em GitHub Actions e está disponível no GitHub Pages.

## Validações de liberação

- [OK] `npm run validate`: conteúdo, lint, tipos, 29 testes e build passaram.
- [OK] `npm run test:e2e`: 1 cenário Playwright passou em Chromium.
- [OK] Build com `GITHUB_ACTIONS=true` e `VITE_STATIC_PUBLICATION=true` passou.
- [OK] Workflow GitHub Actions `Deploy GitHub Pages` concluiu com sucesso em 2026-09-18.
- [OK] `https://profmv.github.io/plan-evento-prova-sebrac/` respondeu HTTP 200, exibiu o título `Recap SENAC 2026` e usou os assets com o caminho-base esperado.

## Limitações operacionais conhecidas

- O GitHub Pages hospeda o portal estático e o simulado; criar sessões, enviar entregas e usar o D1 requer o modo local/Cloudflare.
- [UNVERIFIED] Não houve ensaio real em segundo dispositivo ou com 18 participantes simultâneos.
- [UNVERIFIED] O banco contém 15 questões aprovadas, não as 300 previstas para cobertura final de 100 por eixo.
- [UNVERIFIED] O descarte após 30 dias está documentado como procedimento do professor, sem expurgo automático.

## Próxima operação recomendada

Antes de uma aula real, execute `iniciar.bat`, aplique as migrações locais, crie uma sessão de teste e ensaie a entrada de pelo menos dois dispositivos. Para o simulado autônomo, use o GitHub Pages publicado.
