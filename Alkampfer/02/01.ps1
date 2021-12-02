# Read the data
$data = Get-Content './input.txt'
$horizontal = 0
$depth = 0

# Sample and brutal iteration
foreach ($line in $data) {
    $instruction = $line.split(' ')
    if ($instruction[0][0] -eq 'f') {
        $horizontal += [int]$instruction[1]
    } elseif ($instruction[0][0] -eq 'd') {
        $depth +=  [int]$instruction[1]
    } else {
        $depth -=  [int]$instruction[1]
    }
}

Write-Host "Horizontal = $horizontal Depth = $depth"



