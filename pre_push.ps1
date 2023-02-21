#!/usr/bin/env pwsh

# Set-Location $PSScriptRoot
# if ($IsWindows) {
#   .venv\Scripts\activate.ps1
# }
# elseif ($IsMacOS) {
#   .venv\bin\activate.ps1
# }
# pip freeze > ./requirements.txt

# npx openapi-typescript strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json --output frontend/src/schemas/strapi_schemas.ts

Set-Location (Join-Path $PSScriptRoot frontend)
npm run format
# $TARGET = "src/schemas/strapi_schemas.ts"
# $ENCODING = "UTF8"
# (Get-Content $TARGET -Encoding $ENCODING) | `
#   ForEach-Object { $_ -replace "responses: {};", "responses: object;" } | `
#   ForEach-Object { $_ -replace "parameters: {};", "parameters: object;" } | `
#   Set-Content $TARGET -Encoding $ENCODING
npm run lint
npm run check
