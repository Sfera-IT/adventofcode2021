$grid = New-Object 'int[,]' 1000,1000
$dataLines = Get-Content './input.txt'

$pattern = "(\d+),(\d+).+?(\d+),(\d+)"
$lines = New-Object -TypeName "System.Collections.ArrayList" 
foreach ($line in $dataLines) {
    $match = $line -match $pattern

    [void]$lines.Add(@(
        [int] $matches[1], 
        [int] $matches[2],
        [int] $matches[3], 
        [int] $matches[4]))   
}

# ok now we get to consider only horizontal lines
$horizontalLine = $lines | ? { $_[0] -eq $_[2] }
$verticalLines = $lines | ? { $_[1] -eq $_[3] }
foreach ($line in $horizontalLine) {
    $miny = [Math]::Min($line[1], $line[3])
    $maxy = [Math]::Max($line[1], $line[3])
    foreach ($y in $miny..$maxy) {
        $grid[$line[0], $y] += 1
    }
}
foreach ($line in $verticalLines) {
    $minx = [Math]::Min($line[0], $line[2])
    $maxx = [Math]::Max($line[0], $line[2])
    foreach ($x in $minx..$maxx) {
        $grid[$x, $line[1]] += 1
    }
}

$points = 0
foreach ($point in $grid) {
    if ($point -gt 1) {
        $points += 1
    }
}
write-host $points