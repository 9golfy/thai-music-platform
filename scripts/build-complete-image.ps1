# Build Complete Thai Music Platform Image (PowerShell)
# This script creates a self-contained Docker image with app + database + data

param(
    [switch]$NoBuild = $false,
    [switch]$NoCache = $false
)

Write-Host "🚀 Building Complete Thai Music Platform Image..." -ForegroundColor Green

# Check if backup data exists
if (!(Test-Path "backups\local\thai_music_school")) {
    Write-Host "⚠️ No backup data found. Creating sample data..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "backups\local\thai_music_school" -Force | Out-Null
    
    # Create sample admin user
    $sampleUser = @'
[
  {
    "_id": {"$oid": "69a23d2830fdcf8850c8a7dd"},
    "email": "root@thaimusic.com",
    "password": "$2b$12$9etD.qC1vZ1sK3K.LRiUTuYbT6rZIl/XK74quATTCLdPaD95B7YIa",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "admin",
    "phone": "0800000000",
    "isActive": true,
    "createdAt": {"$date": "2024-03-05T00:00:00.000Z"},
    "updatedAt": {"$date": "2024-03-05T00:00:00.000Z"}
  }
]
'@
    
    $sampleUser | Out-File -FilePath "backups\local\thai_music_school\users.json" -Encoding UTF8
    Write-Host "✅ Sample admin user created (root@thaimusic.com / admin123)" -ForegroundColor Green
}

if (!$NoBuild) {
    # Build the complete image
    Write-Host "🔨 Building Docker image..." -ForegroundColor Blue
    
    $buildArgs = @("build")
    if ($NoCache) {
        $buildArgs += "--no-cache"
    }
    
    & docker-compose -f docker-compose.complete.yml @buildArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Tag the image
    Write-Host "🏷️ Tagging image..." -ForegroundColor Blue
    docker tag thai-music-platform-complete:latest thai-music-platform:complete
}

Write-Host "✅ Complete image built successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Thai Music Platform Complete Image Ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 To deploy:" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker-compose.complete.yml up -d" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Default Admin Login:" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:3000/dcp-admin" -ForegroundColor White
Write-Host "  Email: root@thaimusic.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "🗄️ Database Admin:" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "📦 To export image:" -ForegroundColor Cyan
Write-Host "  docker save thai-music-platform:complete | gzip > thai-music-complete.tar.gz" -ForegroundColor White
Write-Host ""
Write-Host "📥 To import on another server:" -ForegroundColor Cyan
Write-Host "  gunzip -c thai-music-complete.tar.gz | docker load" -ForegroundColor White
Write-Host "  docker-compose -f docker-compose.complete.yml up -d" -ForegroundColor White