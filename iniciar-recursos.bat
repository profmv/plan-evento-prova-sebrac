@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0recurso-alternativo"
echo [OK] Abrindo Portal de Minigames - Recap SENAC 2026...
start "" "%~dp0recurso-alternativo\index.html"
exit /b 0 %*
