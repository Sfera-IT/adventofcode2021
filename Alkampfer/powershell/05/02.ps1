function GetDelta([int]$v1, [int]$v2) {
    $delta = $v2 - $v1;
    if ($delta -eq 0) {
        return 0
    }
    return $delta / [Math]::Abs($delta)
}

function DrawLine([int[,]]$grid, [int[]]$line) {
    $deltax = GetDelta -v1 $line[0] -v2 $line[2]
    $deltay = GetDelta -v1 $line[1] -v2 $line[3]

    #now draw the line
    $x = $line[0]
    $y = $line[1]
    $pointWritten = 0
    while (-not ($y -eq $line[3] -and $x -eq $line[2]))  {
        $grid[$x, $y] += 1
        $x = $x + $deltax
        $y = $y + $deltay
        # write-host "Point written: $x, $y with value: $grid[$x, $y]"
        $pointWritten+= 1
    }  

    # off by one error :P, when you exit from the loop you reach the last
    # point so not forget to mark it. (lose 20 minutes of my life on it)
    $grid[$x, $y] += 1
}

$grid = New-Object 'int[,]' 1000,1000
$dataLines = Get-Content './input.txt'

$pattern = "(\d+),(\d+).+?(\d+),(\d+)"
$lines = New-Object -TypeName "System.Collections.ArrayList" 
foreach ($line in $dataLines) {
    $match = $line -match $pattern
    # it is nicer to normalize x and y 
    [void]$lines.Add([int[]]@(
        [int] $matches[1], 
        [int] $matches[2],
        [int] $matches[3], 
        [int] $matches[4]))  
}

# write all lines, remember that diagonal lines
# are a perfect 45 degree line
foreach ($line in $lines) {
    
    DrawLine -grid $grid -line $line
}

$points = 0
foreach ($point in $grid) {
    if ($point -gt 1) {
        $points += 1
    }
}
write-host $points