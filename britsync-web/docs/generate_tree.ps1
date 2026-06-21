$OutputFile = "$PSScriptRoot\project_structure.txt"
"Project Structure:" | Out-File -FilePath $OutputFile -Encoding UTF8

function Show-Tree {
    param (
        [string]$Path,
        [string]$Indent = ""
    )
    
    try {
        $items = Get-ChildItem -Path $Path | Sort-Object Name
    } catch {
        return
    }
    
    # Filter out the script itself and the output file from the root level to avoid loop anxiety, though not strictly necessary
    $items = $items | Where-Object { $_.Name -ne "project_structure.txt" -and $_.Name -ne "generate_tree.ps1" }
    
    $count = $items.Count
    $i = 0
    
    foreach ($item in $items) {
        $i++
        $isLast = $i -eq $count
        $marker = if ($isLast) { "└── " } else { "├── " }
        
        "$Indent$marker$($item.Name)" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
        
        if ($item.PSIsContainer) {
            if ($item.Name -eq "node_modules" -or $item.Name -eq ".git") {
                # Do not recurse
            } else {
                $nextIndent = if ($isLast) { "$Indent    " } else { "$Indent│   " }
                Show-Tree -Path $item.FullName -Indent $nextIndent
            }
        }
    }
}

Show-Tree -Path $PSScriptRoot
