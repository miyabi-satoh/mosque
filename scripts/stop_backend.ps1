#!/usr/bin/env pwsh

$pid_array = @()

if ($IsLinux) {

}
elseif ($IsMacOS) {
  foreach ($line in ps aux | grep python | grep uvicorn) {
    $pid_array = $pid_array + (-split $line)[1]
  }
}
elseif ($IsWindows) {
  $pid_array = Get-CimInstance -Class Win32_Process |
  Where-Object { $_.CommandLine -like "*gunicorn*" } |
  Select-Object ProcessId
}

foreach ($id in $procs) {
  Write-Host "kill $id"
  Stop-Process -Id $id
}
