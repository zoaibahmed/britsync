function Show-Tree {
    param (
        [string]$Path,
        [string]$Indent
    )
    $Items = Get-ChildItem -Path $Path -Force | Sort-Object { $_.PSIsContainer } -Descending

    foreach ($Item in $Items) {
        if ($Item.Name -eq ".git" -or $Item.Name -eq "node_modules" -or $Item.Name -eq ".next") {
            Write-Output "$Indent- $($Item.Name)/"
            continue
        }

        if ($Item.PSIsContainer) {
            Write-Output "$Indent- $($Item.Name)/"
            Show-Tree -Path $Item.FullName -Indent "$Indent  "
        } else {
            Write-Output "$Indent- $($Item.Name)"
        }
    }
}

Show-Tree -Path . -Indent ""
