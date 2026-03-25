Get-ChildItem -Path "C:\LomasApp\PostventaApp\android" -Filter "*.gradle" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName
    $oldPath = 'C:\\Users\\pc\\OneDrive\\Desktop\\lomas-del-mar\\Lomas-del-mar-update4'
    $newPath = 'C:\\LomasApp'
    
    $newContent = $content.Replace($oldPath, $newPath)
    $newContent = $newContent.Replace('C:/Users/pc/OneDrive/Desktop/lomas-del-mar/Lomas-del-mar-update4', 'C:/LomasApp')
    
    if ($content -ne $newContent -and $newContent -ne $null) {
        $newContent | Set-Content $_.FullName
        Write-Host "Updated: $($_.FullName)"
    }
}
