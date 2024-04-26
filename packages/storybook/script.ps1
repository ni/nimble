$srcFolderPath = "../nimble-components/src/"
$destFolderPath = "./src/nimble/"
<#
$mdxFiles = Get-ChildItem -Path $srcFolderPath -Filter "*.mdx" -Recurse
$tsxFiles = Get-ChildItem -Path $srcFolderPath -Filter "*.tsx" -Recurse

foreach ($mdxFile in $($mdxFiles; $tsxFiles)) {
    $relativePath = $mdxFile.FullName.Replace((Resolve-Path $srcFolderPath).Path, "")
    $relativePath = $relativePath -replace "\\tests\\", "\\"
    $destinationPath = Join-Path -Path $destFolderPath -ChildPath $relativePath
    New-Item -ItemType Directory -Path (Split-Path $destinationPath) -Force

    Copy-Item -Path $mdxFile.FullName -Destination $destinationPath
}
#>

# Get all files under $destFolderPath
$files = Get-ChildItem -Path $destFolderPath -File -Recurse

foreach ($file in $files) {
    # Get the path of the file relative to $destFolderPath
    $relPath = $file.DirectoryName.Replace((Resolve-Path $destFolderPath).Path, "")

    # Replace "from '..';" with "from '@ni/nimble-components/dist/esm/$relPath';" in the file contents
    $content = Get-Content -Path $file.FullName
    $content = $content -replace "from '..';", "from '@ni/nimble-components/dist/esm/$relPath';"
    Set-Content -Path $file.FullName -Value $content
}
