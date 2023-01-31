#!/usr/bin/env pwsh

Set-Location $PSScriptRoot

./winsw stop mosque-backend.xml
./winsw stop mosque-strapi.xml
./winsw stop mosque-frontend.xml
