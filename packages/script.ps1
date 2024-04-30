$nimbleDirectory = "./nimble"
Get-ChildItem -Path $nimbleDirectory -Filter "*.mdx" -Recurse | Remove-Item -Force
