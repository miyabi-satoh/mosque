#!/usr/bin/env pwsh

Set-Location $PSScriptRoot
./stop_server.ps1

docker compose up mosque-db
if ($IsWindows) {
  Start-Service -Name mosque-backend
  Start-Service -Name mosque-strapi
  Start-Service -Name mosque-frontend
  # ./winsw start mosque-backend.xml
  # ./winsw start mosque-strapi.xml
  # ./winsw start mosque-frontend.xml
}
docker compose up
