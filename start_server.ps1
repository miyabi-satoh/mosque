#!/usr/bin/env pwsh

Set-Location $PSScriptRoot
./stop_server.ps1

docker compose up mosque-db
if ($IsWindows) {
  ./winsw start mosque-backend.xml
  ./winsw start mosque-strapi.xml
  ./winsw start mosque-frontend.xml
}
docker compose up
