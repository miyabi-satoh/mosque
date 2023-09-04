#!/usr/bin/env pwsh

$a = @('year', 'grade', 'month', 'subj', 'path')
$line = $a -join ","
Write-Output $line

$items = Get-ChildItem '/Users/masayuki/Library/Mobile Documents/com~apple~CloudDocs/Documents/eiken' -Recurse
foreach ($item in $items) {
    $f = $item.FullName
    if ($f.EndsWith('.mp3') -Or $f.EndsWith('.pdf')) {
        $data = $item.FullName.Split('/') | Select-Object -Last 4
        $nendo = $data[0]
        $kai = $data[1].Replace('第', '').Replace('回', '')
        $grade = $data[2].Replace('級', '').Replace('準', 'P')
    
        if ($data[3].Contains('.mp3') -eq $true) {
            $m = [regex]::Matches($data[3], 'part[0-9]')
            $type = $m[0].Value
        }
        elseif ($data[3].Contains('1ji') -eq $true) {
            $type = 'Q'
        }
        else {
            $type = 'A'
        }
        
    
        $a = @($nendo, $kai, $grade, $type, $item.FullName)
        $line = $a -join ","
        Write-Output $line
    }
}