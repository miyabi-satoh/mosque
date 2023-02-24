#!/usr/bin/env pwsh

if (-not $IsWindows) {
  Exit
}

#引数なし
if ( $null -eq $args[0] ) {
  Write-Warning '引数がありません'
  exit
}
else {
  #Excel判定
  if ($args[0].EndsWith('.xlsx')) { $EFlag = 1 }
  if ($args[0].EndsWith('.xlsm')) { $EFlag = 1 }
  if ($args[0].EndsWith('.xls')) { $EFlag = 1 }
  #Word判定
  if ($args[0].EndsWith('.doc')) { $WFlag = 1 }
  if ($args[0].EndsWith('.docm')) { $WFlag = 1 }
  if ($args[0].EndsWith('.docx')) { $WFlag = 1 }
  #PowerPoint判定
  if ($args[0].EndsWith('.pptx')) { $PFlag = 1 }
  if ($args[0].EndsWith('.pptm')) { $PFlag = 1 }
  if ($args[0].EndsWith('.ppt')) { $PFlag = 1 }
}

if ($EFlag -eq 1) {
  #オブジェクト作成
  $excel = New-Object -ComObject Excel.Application
  $excel.Visible = $false
  $excel.DisplayAlerts = $false

  #拡張子変更
  $newpdf2 = $args[0] -replace '\.xlsx$', '.pdf'
  $newpdf2 = $newpdf2 -replace '\.xlsm$', '.pdf'
  $newpdf2 = $newpdf2 -replace '\.xls$', '.pdf'

  try {
    #ブックオープン
    $book = $excel.Workbooks.Open($args[0])

    #保存
    $book.ExportAsFixedFormat([Microsoft.Office.Interop.Excel.XlFixedFormatType]::xlTypePDF, $newpdf2)
    $book.Close($false)
  }
  catch {
    Write-Warning 'エラーが発生しました'
    Write-Warning '例：上書き保存に失敗、excelファイル名にスペースが含まれている'
  }
  finally {
    #終了処理
    $excel.Quit()
    $excel = $null
    [gc]::Collect()
    [gc]::WaitForPendingFinalizers()
    Remove-Variable excel
  }
}
if ($WFlag -eq 1) {
  #オブジェクト作成
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false

  #拡張子変更
  $newpdf = $args[0] -replace '\.doc$', '.pdf'
  $newpdf = $newpdf -replace '\.docx$', '.pdf'
  $newpdf = $newpdf -replace '\.docm$', '.pdf'

  try {
    #ブックオープン
    $doc = $word.Documents.Open($args[0])

    # 保存
    $doc.SaveAs($newpdf, 17)
    $doc.Close($false)
  }
  catch {
    Write-Warning 'エラーが発生しました'
    Write-Warning '例：上書き保存に失敗、wordファイル名にスペースが含まれている'
  }
  finally {
    #終了処理
    $word.Quit()
    $word = $null
    [gc]::Collect()
    [gc]::WaitForPendingFinalizers()
    Remove-Variable word
  }
}
if ($PFlag -eq 1) {
  #オブジェクト作成
  $powerpoint = New-Object -ComObject PowerPoint.Application

  #拡張子変更
  $newpdf2 = $args[0] -replace '\.ppt$', '.pdf'
  $newpdf2 = $newpdf2 -replace '\.pptx$', '.pdf'
  $newpdf2 = $newpdf2 -replace '\.pptm$', '.pdf'

  try {
    #ブックオープン
    $ppt = $powerpoint.Presentations.Open($args[0], $msoFalse, $msoFalse, $msoFalse)

    #保存
    $ppt.SaveAs($newpdf2, 32)
  }
  catch {
    Write-Warning 'エラーが発生しました'
    Write-Warning '例：上書き保存に失敗、powerpointファイル名にスペースが含まれている'
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
