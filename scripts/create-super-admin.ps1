# Create Super Admin PowerShell Script
param(
    [string]$MongoUri = $env:MONGODB_URI,
    [string]$Email = "root@thaimusic.com",
    [string]$Password = "admin123",
    [string]$FirstName = "Super",
    [string]$LastName = "Admin"
)

Write-Host "🚀 Creating Super Admin Account..." -ForegroundColor Green
Write-Host "📧 Email: $Email" -ForegroundColor Yellow

if (-not $MongoUri) {
    Write-Host "❌ MONGODB_URI is required" -ForegroundColor Red
    Write-Host "Set environment variable or pass as parameter:" -ForegroundColor Yellow
    Write-Host "  Set-Item -Path env:MONGODB_URI -Value 'your-mongo-connection-string'" -ForegroundColor Cyan
    Write-Host "  Or: .\create-super-admin.ps1 -MongoUri 'your-connection-string'" -ForegroundColor Cyan
    exit 1
}

# Check if Node.js script exists
$scriptPath = "scripts/create-super-admin.js"
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Script not found: $scriptPath" -ForegroundColor Red
    exit 1
}

# Set environment variables
$env:MONGODB_URI = $MongoUri

try {
    Write-Host "🔄 Running admin creation script..." -ForegroundColor Blue
    
    # Run the Node.js script
    node $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Super admin created successfully!" -ForegroundColor Green
        Write-Host "`n🔐 Login Credentials:" -ForegroundColor Cyan
        Write-Host "  📧 Email: $Email" -ForegroundColor White
        Write-Host "  🔑 Password: $Password" -ForegroundColor White
        Write-Host "  🌐 Admin Panel: /dcp-admin" -ForegroundColor White
        Write-Host "`n⚠️  IMPORTANT: Change password after first login!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed to create super admin" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}