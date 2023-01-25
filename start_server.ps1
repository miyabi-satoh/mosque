#!/usr/bin/env pwsh

Set-Location $PSScriptRoot
./stop_server.ps1

docker compose -f compose-prod.yml up -d
if ($IsWindows) {
  .venv\Scripts\activate.ps1
}
elseif ($IsMacOS) {
  .venv\bin\activate.ps1
}
gunicorn app.main:app --pythonpath backend --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 -D
