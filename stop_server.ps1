#!/usr/bin/env pwsh

$pid_array = @()

if ($IsWindows) {
  $pid_array = Get-CimInstance -Class Win32_Process |
  Where-Object { $_.CommandLine -like "*gunicorn*" } |
  Select-Object ProcessId
}
else {
  foreach ($line in ps aux | grep python | grep uvicorn) {
    $pid_array = $pid_array + (-split $line)[1]
  }
}

foreach ($id in $pid_array) {
  Write-Host "kill $id"
  Stop-Process -Id $id
}


Set-Location $PSScriptRoot
docker compose -f compose.yml -f compose-prod.yml down
