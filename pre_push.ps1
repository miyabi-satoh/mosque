#!/usr/bin/env pwsh

Set-Location $PSScriptRoot
if ($IsWindows) {
  .venv\Scripts\activate.ps1
}
elseif ($IsMacOS) {
  .venv\bin\activate.ps1
}
pip freeze > ./requirements.txt

Set-Location (Join-Path $PSScriptRoot frontend)
npm run format
npm run lint
npm run check

