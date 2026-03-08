# MongoDB Data Migration Script for Windows
param(
    [Parameter(Mandatory=$true)]
    [string]$ProductionMongoUri,
    [string]$LocalHost = "localhost:27017",
    [string]$Database = "thai_music_school"
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backups\$timestamp"

Write-Host "๐” Starting MongoDB data migration..." -ForegroundColor Green
Write-Host "๐“ Local: $LocalHost" -ForegroundColor Yellow
Write-Host "๐ฏ Production: $ProductionMongoUri" -ForegroundColor Yellow

# Create backup directory
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

try {
    # Export from local
    Write-Host "๐“ค Exporting from local database..." -ForegroundColor Blue
    mongodump --host $LocalHost --db $Database --out $backupDir
    
    if ($LASTEXITCODE -ne 0) {
        throw "Export failed"
    }
    
    Write-Host "โ… Export completed" -ForegroundColor Green
    
    # Import to production
    Write-Host "๐“ฅ Importing to production database..." -ForegroundColor Blue
    mongorestore --uri="$ProductionMongoUri" --drop "$backupDir\$Database"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Import failed"
    }
    
    Write-Host "โ… Migration completed successfully!" -ForegroundColor Green
    
    # Show summary
    Write-Host "`n๐“ Migration Summary:" -ForegroundColor Cyan
    Get-ChildItem "$backupDir\$Database" | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 2)
        Write-Host "  - $($_.BaseName): ${size}KB" -ForegroundColor White
    }
    
} catch {
    Write-Host "โ Migration failed: $_" -ForegroundColor Red
    exit 1
}

# Optional: Cleanup
$cleanup = Read-Host "`nDelete backup files? (y/N)"
if ($cleanup -eq 'y' -or $cleanup -eq 'Y') {
    Remove-Item -Recurse -Force $backupDir
    Write-Host "๐—‘๏ธ Backup files cleaned up" -ForegroundColor Yellow
}
