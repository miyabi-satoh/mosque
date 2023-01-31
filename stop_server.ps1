#!/usr/bin/env pwsh

Set-Location $PSScriptRoot

./winsw stop mosque.xml
docker compose -f compose.yml -f compose-prod.yml down
