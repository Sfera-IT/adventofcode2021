function Get-CountOfOnes([System.Collections.ArrayList]$array, [int]$position) {
    $countOfOnes = 0
    $array | % {$countOfOnes += $_[$i] - 48}
    return $countOfOnes
}

function Remove-NonCompatibleElement([System.Collections.ArrayList]$arrayList, [int]$position, [char]$expected) {
    if ($arrayList.Count -gt 1) {
        foreach ($item in $arrayList.Clone()) {
            if ($item[$position] -ne $expected) {
                $arrayList.remove($item)
            }
        }
    }
}

$data = Get-Content './input.txt'

$oxy = [System.Collections.ArrayList]$data
$co2 = [System.Collections.ArrayList]$data
# Ok cicle for each bit starting from leftmost to rightmost
for ($i = 0; $i -lt 12; $i++) {

    # Get the count of ones for each of the two arrays
    $oxyCountOfOnes = Get-CountOfOnes -array $oxy -position $i
    $co2CountOfOnes = Get-CountOfOnes -array $co2 -position $i

    # Now remember that we have different rules for the two counter, for
    # Oxygen we need to keep 1 if 1 is prevalent or equal zero otherwise
    if ($oxyCountOfOnes -ge $oxy.Count / 2) {
        Remove-NonCompatibleElement -arraylist $oxy -position $i -expected '1' 
    } else {
        Remove-NonCompatibleElement -arraylist $oxy -position $i -expected '0' 
    }

    # Co2 rules are different, we need to get the less prevalent, and if they
    # are equal we need to keep 0
    if ($co2CountOfOnes -ge $co2.Count / 2) {
        Remove-NonCompatibleElement -arraylist $co2 -position $i -expected '0' 
    } else {
        Remove-NonCompatibleElement -arraylist $co2 -position $i -expected '1' 
    }
}

Write-Host $oxy
Write-Host $co2

$decimalOxy = [Convert]::ToInt32($oxy, 2)
$decimalCo2 = [Convert]::ToInt32($co2, 2)
$result = $decimalOxy * $decimalCo2
Write-Host $result