@echo off
set "T=C:\Users\tudor\OneDrive\Documents\GitHub\TarsHO-mobile"
if exist "%T%\.git\index.lock" del /f "%T%\.git\index.lock" 2>nul
if exist "%T%\.git\HEAD.lock"  del /f "%T%\.git\HEAD.lock"  2>nul
powershell -ExecutionPolicy Bypass -NoProfile -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/tudort2/TarsHO-mobile/main/deploy-tars.ps1' -OutFile '%TEMP%\tars-deploy.ps1' -UseBasicParsing"
powershell -ExecutionPolicy Bypass -File "%TEMP%\tars-deploy.ps1" -Branch "%~1"
