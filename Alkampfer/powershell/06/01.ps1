$data = Get-Content './input.txt'
$lf  = New-Object -TypeName "System.Collections.ArrayList"
foreach ($number in $data.split(',')) {
    [void]$lf.Add([long]$number)
}

# Bruteforce, but it's fast enough
for ($c = 0; $c -lt 80; $c++) {
    $newBorn = 0
    for ($i = 0; $i -lt $lf.Count; $i++) {
        if ($lf[$i] -eq 0) {
            $newBorn += 1
            $lf[$i] = 6
        } else {
            $lf[$i] -= 1
        }
    }
    for ($i = 0; $i -lt $newBorn; $i++) {
        [void]$lf.Add([long]8)
    }
    Write-Host "Done generation $c added $newBorn new count $($lf.Count)"
}

Write-Host "Count = $($lf.Count)"