param(
    [Parameter(Mandatory=$true)]
    [string]$ProductionMongoUri,
    [string]$LocalHost = "localhost:27017",
    [string]$Database = "thai_music_school"
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backups\$timestamp"

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host "Exporting from local..." -ForegroundColor Blue
mongodump --host $LocalHost --db $Database --out $backupDir

if ($LASTEXITCODE -ne 0) { Write-Host "Export failed" -ForegroundColor Red; exit 1 }

Write-Host "Importing to production..." -ForegroundColor Blue
mongorestore --uri="$ProductionMongoUri" --drop "$backupDir\$Database"

if ($LASTEXITCODE -ne 0) { Write-Host "Import failed" -ForegroundColor Red; exit 1 }

Write-Host "Migration completed!" -ForegroundColor Green
