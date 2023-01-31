#!/usr/bin/env pwsh

Set-Location $PSScriptRoot
./stop_server.ps1

docker compose -f compose.yml -f compose-prod.yml up -d --build
./winsw start mosque.xml
