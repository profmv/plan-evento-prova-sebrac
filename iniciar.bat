@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [FAIL] Node.js nao foi encontrado no PATH.
  echo Instale Node.js 22.12 ou superior e execute novamente.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [FAIL] npm nao foi encontrado no PATH.
  exit /b 1
)

if not exist "node_modules\.package-lock.json" (
  echo [PENDING] Instalando dependencias fixadas no lockfile...
  call npm ci
  if errorlevel 1 exit /b 1
)

echo [PENDING] Verificando segredo administrativo local...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "scripts\ensure-local-env.ps1" -ShowSecret
if errorlevel 1 exit /b 1

echo [PENDING] Aplicando migracoes no banco local...
call npm run db:migrate:local
if errorlevel 1 exit /b 1

echo [PENDING] Gerando a aplicacao...
call npm run build
if errorlevel 1 exit /b 1

echo [OK] Aplicacao disponivel neste computador em http://127.0.0.1:8788
echo Use o endereco IPv4 deste computador para acesso pela rede local.
echo Pressione Ctrl+C para encerrar.
call npx wrangler pages dev dist --d1 DB --persist-to .wrangler/state --ip 0.0.0.0 --port 8788 %*

set "EXIT_CODE=%ERRORLEVEL%"
endlocal & exit /b %EXIT_CODE%
