$data = Get-Content './input.txt'
# keep the count of the generation total
$lf  = [long[]]::new(9);
foreach ($number in $data.split(',')) {
    $lf[[long]$number] += 1;
}
Write-Host $lf
for ($c = 0; $c -lt 256; $c++) {
    $hatched = $lf[0]
    for ($i = 1; $i -lt 9; $i++) {
        $lf[$i - 1] = $lf[$i]
    }
    # all lanterns previous at 0 will add to 6 and the same
    # number will replace the original number 8
    $lf[6] += $hatched
    $lf[8] = $hatched
    Write-Host "Done generation $c - Write-Host $lf"
}
$count = 0
$lf | % { $count += $_}
Write-Host "Count = $count"