#!/usr/bin/env pwsh
param(
  [string]$Path,
  [string]$SavePath
)

if (-not (Test-Path $Path -PathType Leaf)) {
  Write-Error "File not found: $Path"
  Exit 1
}
if (-not $SavePath) {
  $SavePath = $Path -replace '\.(xls|doc|ppt)[xm]?$', '.pdf'
}
if (-not $SavePath.EndsWith('.pdf')) {
  Write-Error "Logical error."
  Exit 1
}

if (-not $IsWindows) {
  Write-Error "Unsupported OS."
  Exit 1
}

if ($Path -match '\.xls[xm]?$') {
  try {
    $excel = New-Object -ComObject Excel.Application
  }
  catch {
    Write-Error "Could not start Excel application - which usually means it is not installed."
    Write-Error $error
    Exit 1
  }

  try {
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    $book = $excel.Workbooks.Open($Path)
    $xlFixedFormat = "Microsoft.Office.Interop.Excel.xlFixedFormatType" -as [type]
    $book.ExportAsFixedFormat($xlFixedFormat::xlTypePDF, $SavePath)
    $book.Close($false)
  }
  catch {
    Write-Error "Could not save as pdf."
    Write-Error $error
  }
  finally {
    $excel.Quit()
    $excel = $null
    [gc]::Collect()
    [gc]::WaitForPendingFinalizers()
    Remove-Variable excel
  }
}
elseif ($Path -match '\.doc[xm]?$') {
  try {
    $word = New-Object -ComObject Word.Application

  }
  catch {
    Write-Error "Could not start Word application - which usually means it is not installed."
    Write-Error $error
    Exit 1
  }

  try {
    $word.Visible = $false
    $word.DisplayAlerts = $false
    $doc = $word.Documents.Open($Path)
    $doc.SaveAs($SavePath, 17)
    $doc.Close($false)
  }
  catch {
    Write-Error "Could not save as pdf."
    Write-Error $error
  }
  finally {
    $word.Quit()
    $word = $null
    [gc]::Collect()
    [gc]::WaitForPendingFinalizers()
    Remove-Variable word
  }
}
elseif ($Path -match '\.ppt[xm]?$') {
  try {
    $powerpoint = New-Object -ComObject PowerPoint.Application
  }
  catch {
    Write-Error "Could not start PowerPoint application - which usually means it is not installed."
    Write-Error $error
    Exit 1
  }

  try {
    $powerpoint.Visible = $false
    $powerpoint.DisplayAlerts = $false
    $MsoTriState = "Microsoft.Office.Core.MsoTriState" -as [type]
    $msoFalse = $MsoTriState::msoFalse

    $ppt = $powerpoint.Presentations.Open($Path, $msoFalse, $msoFalse, $msoFalse)
    $ppt.SaveAs($SavePath, 32)
  }
  catch {
    Write-Error "Could not save as pdf."
    Write-Error $error
  }
  finally {
    #終了処理
    $powerpoint.Quit()
    $powerpoint = $null
    [gc]::Collect()
    [gc]::WaitForPendingFinalizers()
    Remove-Variable powerpoint
  }
}
