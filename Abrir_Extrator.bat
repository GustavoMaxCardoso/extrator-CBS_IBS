@echo off
:: ─────────────────────────────────────────────────────
::  Extrator NF-e — IBS & CBS
::  Abre a ferramenta no navegador padrão
:: ─────────────────────────────────────────────────────

set "DIR=%~dp0"
set "HTML=%DIR%index.html"

echo.
echo  Extrator NF-e — IBS ^& CBS
echo  Abrindo no navegador...
echo.

:: Tenta abrir no navegador padrão do Windows
start "" "%HTML%"

:: Se falhar, tenta explicitamente
if errorlevel 1 (
  start chrome "%HTML%" 2>nul || ^
  start msedge "%HTML%" 2>nul || ^
  start firefox "%HTML%" 2>nul || ^
  echo  Nao foi possivel abrir automaticamente.
  echo  Abra manualmente o arquivo: index.html
  pause
)
