$dataLines = Get-Content './input.txt'
$data = $dataLines | Join-String
$counter = [int[]]::new(12);

for ($i = 0; $i -lt $data.Length; $i++) {
    $counter[$i % 12] += $data[$i] - 48
}
 
Write-Host $counter
$gammaBinary = ""
$epsilonBinary = ""
foreach ($item in $counter) {
    if ($item -gt  $dataLines.Length / 2) { 
        $gammaBinary+='1'
        $epsilonBinary+='0'
    } else {
        $gammaBinary+='0'
        $epsilonBinary+='1'
    }
}
Write-Host $gammaBinary
Write-Host $epsilonBinary
$gamma = [Convert]::ToInt32($gammaBinary, 2)
$epsilon = [Convert]::ToInt32($epsilonBinary, 2)
$result = $gamma * $epsilon
Write-Host $result