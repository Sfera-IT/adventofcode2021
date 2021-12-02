# Read the data
$data = Get-Content './input.txt'
$horizontal = 0
$aim = 0
$depth = 0

# Sample and brutal iteration
foreach ($line in $data) {
    $instruction = $line.split(' ')
    if ($instruction[0][0] -eq 'f') {
        $horizontal += [int]$instruction[1]
        $depth += [int]$instruction[1] * $aim
    } elseif ($instruction[0][0] -eq 'd') {
        $aim +=  [int]$instruction[1]
    } else {
        $aim -=  [int]$instruction[1]
    }
}

Write-Host "Horizontal = $horizontal Depth = $depth"



