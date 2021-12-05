BeforeAll { 
    . $PSScriptRoot/02.ps1
}

Describe 'GetDelta' {
    It 'Standard delta calculation' {
        $delta = GetDelta -v1 1 -v2 6
        $delta | Should -Be 1
    }

    It 'Inverse delta calculation' {
        $delta = GetDelta -v1 4 -v2 1
        $delta | Should -Be -1
    }

    It 'Equal delta calculation' {
        $delta = GetDelta -v1 4 -v2 4
        $delta | Should -Be 0
    }
}
