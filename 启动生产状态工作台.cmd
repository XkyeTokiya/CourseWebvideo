@echo off
setlocal
set "ROOT=%~dp0"
set "STATUS_DIR=%ROOT%production-status"
set "PORT=8765"
set "URL=http://127.0.0.1:%PORT%/production-status/dashboard.html"

if not exist "%STATUS_DIR%\episodes" (
  echo Status data directory was not found: %STATUS_DIR%
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js, then run this launcher again.
  pause
  exit /b 1
)

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:%PORT%/health' -TimeoutSec 1; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  start "Production status service" /min node "%ROOT%tools\production-status-server.mjs"
  timeout /t 1 /nobreak >nul
)

start "" "%URL%"
endlocal