#!/usr/bin/env pwsh

Set-Location $PSScriptRoot

docker compose stop mosque-web
if ($IsWindows) {
  Stop-Service -Name mosque-frontend
  Stop-Service -Name mosque-backend
  Stop-Service -Name mosque-strapi
  # ./winsw stop mosque-frontend.xml
  # ./winsw stop mosque-backend.xml
  # ./winsw stop mosque-strapi.xml
}
docker compose stop
