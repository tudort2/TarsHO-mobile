@echo off
setlocal

set "SOURCE=%~dp0tars-app"
set "TARGET=C:\Users\tudor\OneDrive\Documents\GitHub\TarsHO-mobile"

echo ============================================
echo  TARS Mobile App - Deploy and Start
echo ============================================
echo.

if exist "%SOURCE%" (
  echo [1/4] Copying project files...
  robocopy "%SOURCE%" "%TARGET%" /E /XD node_modules .git /XF package-lock.json /NFL /NDL /NJH /NJS
  copy "%~f0" "%TARGET%\deploy-tars.bat" /Y >nul
  echo Done.
  echo.
) else (
  echo [1/4] Running from project folder - skipping copy.
  echo.
)

cd /d "%TARGET%"

echo [2/4] Cleaning old install...
if exist node_modules (
  rd /s /q node_modules
  echo node_modules removed.
)
if exist package-lock.json del package-lock.json

echo.
echo [3/4] Installing dependencies (this takes 1-2 minutes)...
call npm install --legacy-peer-deps
echo.

echo [4/4] Starting Expo...
echo ============================================
echo  Scan the QR code below with your iPhone
echo  camera app to open in Expo Go
echo ============================================
echo.
npx expo start --clear

endlocal
pause
