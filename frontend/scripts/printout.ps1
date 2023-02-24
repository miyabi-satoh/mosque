#!/usr/bin/env pwsh
param(
  [string]$Path,
  [string]$PrinterName
)

if (-not (Test-Path $Path -PathType Leaf)) {
  Write-Error "File not found: $Path"
  Exit 1
}

if (-not $PrinterName) {
  Write-Error "PrinterName is null"
  Exit 1
}

if (-not $IsWindows) {
  Write-Error "Unsupported operating"
  Exit 1
}
$printer = Get-CimInstance -Class Win32_Printer -Filter "Name='$PrinterName'"
if (-not $printer) {
  Write-Error "Printer not found: $printer"
  Exit 1
}
$default = Get-CimInstance Win32_Printer | Where-Object default
Invoke-CimMethod -InputObject $printer -MethodName SetDefaultPrinter
Set-PrintConfiguration $printer.name -Color $false
Start-Process $Path -Verb Print -WindowStyle Hidden
Invoke-CimMethod -InputObject $default -MethodName SetDefaultPrinter

