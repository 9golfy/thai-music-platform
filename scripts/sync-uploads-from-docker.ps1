# Sync uploads from Docker container to host machine
Write-Host "Syncing uploads from Docker container..." -ForegroundColor Cyan

# Create uploads directory if not exists
$uploadsDir = "public\uploads"
if (!(Test-Path $uploadsDir)) {
    New-Item -ItemType Directory -Path $uploadsDir -Force | Out-Null
    Write-Host "✅ Created uploads directory" -ForegroundColor Green
}

# Copy files from Docker container
Write-Host "Copying files from container..." -ForegroundColor Yellow
docker cp thai-music-web:/app/public/uploads/. $uploadsDir

# Count files
$fileCount = (Get-ChildItem $uploadsDir).Count
Write-Host "✅ Synced $fileCount files" -ForegroundColor Green

# List recent files
Write-Host ""
Write-Host "Recent files:" -ForegroundColor Cyan
Get-ChildItem $uploadsDir | Sort-Object LastWriteTime -Descending | Select-Object -First 10 Name, Length, LastWriteTime | Format-Table -AutoSize
