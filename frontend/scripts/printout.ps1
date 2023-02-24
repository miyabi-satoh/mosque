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

if ($IsWindows) {
  $printer = Get-WmiObject Win32_Printer | Where-Object Name -eq $PrinterName
  if (-not $printer) {
    Write-Error "Printer not found: $printer"
    Exit 1
  }
  $default = Get-WmiObject Win32_Printer | Where-Object default
  $printer.SetDefaultPrinter()
  Set-PrintConfiguration $printer.name -Color $false
  Start-Process $Path -Verb Print
  $default.SetDefaultPrinter()
}
