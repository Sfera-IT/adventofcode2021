BeforeAll { 
    . $PSScriptRoot/02.ps1
}

Describe 'DrawLine' {
    It 'Standard line diagonal' {
        $grid = New-Object 'int[,]' 5,5
        DrawLine -grid $grid -line @(1,1,3,3)
        $grid[0,0] | Should -Be 0
        $grid[1,1] | Should -Be 1
        $grid[2,2] | Should -Be 1
        $grid[3,3] | Should -Be 1
        $grid[4,4] | Should -Be 0
    }
    It 'Inverse line diagonal' {
        $grid = New-Object 'int[,]' 5,5
        DrawLine -grid $grid -line @(3,3,1,1)
        $grid[0,0] | Should -Be 0
        $grid[1,1] | Should -Be 1
        $grid[2,2] | Should -Be 1
        $grid[3,3] | Should -Be 1
        $grid[4,4] | Should -Be 0
    }

    It 'Horizontal regular' {
        $grid = New-Object 'int[,]' 5,5
        DrawLine -grid $grid -line @(3,1,3,3)
        $grid[3,0] | Should -Be 0
        $grid[3,1] | Should -Be 1
        $grid[3,2] | Should -Be 1
        $grid[3,3] | Should -Be 1
        $grid[3,4] | Should -Be 0
    }

    It 'Horizontal inverse' {
        $grid = New-Object 'int[,]' 5,5
        DrawLine -grid $grid -line @(3,3,3,1)
        $grid[3,0] | Should -Be 0
        $grid[3,1] | Should -Be 1
        $grid[3,2] | Should -Be 1
        $grid[3,3] | Should -Be 1
        $grid[3,4] | Should -Be 0
    }
}