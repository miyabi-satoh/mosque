#!/usr/bin/env pwsh

Set-Location $PSScriptRoot

docker compose stop mosque-web
if ($IsWindows) {
  ./winsw stop mosque-frontend.xml
  ./winsw stop mosque-backend.xml
  ./winsw stop mosque-strapi.xml
}
docker compose stop
