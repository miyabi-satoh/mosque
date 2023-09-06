#!/usr/bin/env pwsh

if ($IsWindows) {
    $sep = '\'
} else {
    $sep = '/'
}

$a = @('year', 'grade', 'month', 'subj', 'path')
$line = $a -join ","
Write-Output $line

$items = Get-ChildItem '.' -Recurse
foreach ($item in $items) {
    $f = $item.FullName
    if ($f.EndsWith('.mp3')) {
        $bln = $f -match '(\d{4})中(\d)_(\d{2})'
        if ($bln) {
            $year = $Matches[1]
            $grade = [int]$Matches[2] + 6
            $month = [int]$Matches[3]
            if ($f.Contains('国語')) {
                $subj = 'J'
            }
            elseif ($f.Contains('英語')) {
                $subj = 'E'
            }

            $a = @($year, $grade, $month, $subj, $item.FullName)
            $line = $a -join ","
            Write-Output $line

        }
    }        
}