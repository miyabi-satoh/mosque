#!/usr/bin/env pwsh

Set-Location $PSScriptRoot

./winsw stop mosque-nginx.xml
./winsw stop mosque-frontend.xml
./winsw stop mosque-backend.xml
./winsw stop mosque-strapi.xml
