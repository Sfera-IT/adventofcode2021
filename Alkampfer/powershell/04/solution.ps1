function PrintBoard([System.Collections.ArrayList]$board) {
    for ($i = 0; $i -lt $board.Count; $i++) {
        Write-Host -NoNewline $board[$i]
        Write-Host -NoNewline " "
        if (($i + 1) % 5 -eq 0) {
            Write-Host
        }
    }
}

function UpdateBoard([System.Collections.ArrayList]$board, [int]$extracted) {
    for ($i = 0; $i -lt $board.Count; $i++) {
        if ($board[$i] -eq $extracted) {
            $board[$i] = 0
            break
        }
    }
}

function CheckSequence([System.Collections.ArrayList]$board, [System.Collections.ArrayList]$winningsequence) {
    foreach ($i in $winningsequence) {
        if ($board[$i] -ne 0) {
            return $false
        }
    }
    return $true;
}

function IsWinningBoard([System.Collections.ArrayList]$board, [System.Collections.ArrayList]$winningsequences) {
    foreach ($sequence in $winningsequences) {
        if (CheckSequence -board $board -winningsequence $sequence) {
            return $true
        }
    }
    return $false
}

function GetWinningSequnces() {
    $sequences =  New-Object -TypeName "System.Collections.ArrayList"
    # all lines wins
    for ($i = 0; $i-lt 5; $i++) {
        [void]$sequences.Add(($i*5)..(($i*5)+4))
        # columns
        $column =  New-Object -TypeName "System.Collections.ArrayList"
        for ($j = 0; $j -lt 5; $j++) {
            [void]$column.Add(($j*5) + $i)
        }
        [void]$sequences.Add($column)
    }
    
    return $sequences
}

$data = Get-Content './input.txt'

$counter = 0
$extraction = $data[0].split(',')
$boards =  New-Object -TypeName "System.Collections.ArrayList"
$actualBoard = New-Object -TypeName "System.Collections.ArrayList"
$boards.Add($actualBoard)

# Skip first two line read all boards.
for ($i = 2; $i -lt $data.Length; $i++) {
    $line = $data[$i]
    if ([string]::IsNullOrEmpty($line)) {
       # New line found new board
       $actualBoard = New-Object -TypeName "System.Collections.ArrayList"
       [void]$boards.Add($actualBoard)     
    } else {
       $line.Split(' ') | ? {![string]::IsNullOrEmpty($_)} | % {[void]$actualBoard.Add([int]$_)}
    }
}

Write-Host "Dump first board as check"
Print-Board -board $boards[1]

Write-Host "Dump winning sequences"
$allWinningSequences = GetWinningSequnces
foreach ($sequence in $allWinningSequences) {
    Write-Host $sequence
}

Write-Host "Extraction 1"
foreach ($number in $extraction) {
    $extracted = [int]$number
    Write-Host "Extracted $extracted"
    # update all the board
    foreach ($board in $boards) {
        UpdateBoard -board $board -extracted $extracted
    }

    # Since we expect to have a single board winning Where-Object will return the exact element
    # if we would have more winner it will return an array.
    $winningBoard = $boards | Where-Object {IsWinningBoard -board $_ -winningsequences $winningsequences} 
    if ($winningBoard -ne $null) {
        $sum = 0
        foreach ($number in $winningBoard ) {
            $sum += $number
        }
        $solution = $sum * $extracted
        Write-Host "winning board is $solution"
        break
    }
}

Write-Host "Extraction Complete"
foreach ($number in $extraction) {
    $extracted = [int]$number
    Write-Host "Extracted $extracted"
    # update all the board
    foreach ($board in $boards) {
        UpdateBoard -board $board -extracted $extracted
    }

    # need to check all boards for each winning board print result and remove from the game.
    # We cannot clearly use where-object because we do not want pipeline semantic.
    $winningBoards = $boards.where({IsWinningBoard -board $_ -winningsequences $winningsequences})

    foreach ($winningBoard in $winningBoards) {
        $sum = 0
        foreach ($number in $winningBoard ) {
            $sum += $number
        }
        $solution = $sum * $extracted

        Write-Host "winning board with score $solution"
        $boards.Remove($winningBoard)
    }
}


