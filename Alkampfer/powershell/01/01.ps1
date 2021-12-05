# Read the data
$data = Get-Content '.\input.txt'
$previous = [int]::MaxValue
$count = 0

# Sample and brutal iteration
foreach ($line in $data) {
    if ([int]$line -gt $previous) {
        $count += 1
    }
    $previous = $line
}

Write-Host $count


