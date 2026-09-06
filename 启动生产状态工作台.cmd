@echo off
setlocal
set "ROOT=%~dp0"
set "STATUS_DIR=%ROOT%production-status"
set "PORT=8765"
set "SERVICE=%ROOT%production-status\production-status-server.mjs"

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

call :ensure_service
if errorlevel 1 (
  echo Failed to start the production status service.
  pause
  exit /b 1
)

set "URL=http://127.0.0.1:%PORT%/production-status/dashboard.html"

start "" "%URL%"
endlocal
exit /b 0

:ensure_service
for %%P in (8765 8766 8767 8768) do (
  set "PORT=%%P"
  powershell -NoProfile -Command "$expectedRoot = [IO.Path]::GetFullPath('%ROOT%').TrimEnd([IO.Path]::DirectorySeparatorChar); try { $r = Invoke-RestMethod -UseBasicParsing ('http://127.0.0.1:%%P/health') -TimeoutSec 1; if ($r.service -eq 'coursewebvideo-production-status' -and [IO.Path]::GetFullPath($r.root).TrimEnd([IO.Path]::DirectorySeparatorChar) -eq $expectedRoot -and [IO.Path]::GetFullPath($r.statusDir).TrimEnd([IO.Path]::DirectorySeparatorChar) -eq ([IO.Path]::GetFullPath('%STATUS_DIR%').TrimEnd([IO.Path]::DirectorySeparatorChar))) { exit 0 } } catch {} ; exit 1"
  if not errorlevel 1 exit /b 0
  powershell -NoProfile -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', %%P); $client.Close(); exit 2 } catch { exit 1 }"
  if errorlevel 2 (
    rem Port is occupied by another service; continue with the next candidate.
  ) else (
    start "Production status service" /min node "%SERVICE%" --port %%P
    for /l %%W in (1,1,20) do (
      powershell -NoProfile -Command "Start-Sleep -Milliseconds 250; try { $r = Invoke-RestMethod -UseBasicParsing 'http://127.0.0.1:%%P/health' -TimeoutSec 1; if ($r.service -eq 'coursewebvideo-production-status') { exit 0 } } catch {} ; exit 1"
      if not errorlevel 1 exit /b 0
    )
  )
)
exit /b 1
