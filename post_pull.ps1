#!/usr/bin/env pwsh

# Set-Location $PSScriptRoot
# if ($IsWindows) {
#   .venv\Scripts\activate.ps1
# }
# elseif ($IsMacOS) {
#   .venv\bin\activate.ps1
# }
# pip install -r ./requirements.txt | Select-String -NotMatch 'already satisfied'

Set-Location (Join-Path $PSScriptRoot frontend)
npm i
npm run prisma:generate
npm run check

Set-Location (Join-Path $PSScriptRoot strapi)
yarn install

