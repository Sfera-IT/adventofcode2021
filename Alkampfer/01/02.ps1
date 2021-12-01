# Read the data
$data = Get-Content '.\input.txt'
$previous = [int]::MaxValue
$count = 0
for ($i = 2; $i -lt $data.Length; $i++)
{
    $actual = [int]$data[$i] + [int]$data[$i - 1] + [int]$data[$i - 2];
    if ($actual -gt $previous) {
        $count += 1
    }
    $previous = $actual
}

Write-Host $count