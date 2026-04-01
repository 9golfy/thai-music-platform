# Simple Test Auto Deploy Script
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Test Auto Deploy" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# สร้าง test file
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$testNumber = [int](Get-Date -UFormat %s)

Write-Host "Creating test file..." -ForegroundColor Yellow

$content = @"
# Test Auto Deploy

## Test Information
- Date: $timestamp
- Test Number: $testNumber
- Target: 164.115.41.34

## Status
File pushed to GitHub - waiting for auto deploy...

## Check Results
1. Go to GitHub → Actions
2. Wait 2-3 minutes
3. Check: ssh ubuntu@164.115.41.34 'cat /home/ubuntu/thai-music-platform/TEST-DEPLOY.md'
4. Check: curl http://164.115.41.34/api/health
"@

$content | Out-File -FilePath "TEST-DEPLOY.md" -Encoding UTF8
Write-Host "✓ Test file created" -ForegroundColor Green
Write-Host ""

# Git operations
Write-Host "Adding to git..." -ForegroundColor Yellow
git add TEST-DEPLOY.md

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "test: Auto deploy test at $timestamp"

Write-Host "Getting repository info..." -ForegroundColor Yellow
$branch = git branch --show-current
Write-Host "Branch: $branch" -ForegroundColor Cyan
Write-Host ""

# Ask before push
Write-Host "Ready to push to GitHub?" -ForegroundColor Yellow
Write-Host "This will trigger auto deploy to 164.115.41.34" -ForegroundColor Yellow
Write-Host ""
$response = Read-Host "Continue? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push origin $branch
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to GitHub → Actions tab" -ForegroundColor White
    Write-Host "2. Watch the Deploy to Production workflow" -ForegroundColor White
    Write-Host "3. Wait 2-3 minutes for deployment" -ForegroundColor White
    Write-Host "4. Run: .\check-deploy-status.ps1" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Cancelled" -ForegroundColor Red
}
