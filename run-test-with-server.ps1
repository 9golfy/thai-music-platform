# PowerShell script to start dev server and run image size tests

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("regist100", "regist-support", "both")]
    [string]$Form = "both"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Image Size Warning Test with Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if test images exist
Write-Host "Checking test images..." -ForegroundColor Yellow
$testAssetsPath = "regist/test-assets"
$requiredImages = @("manager.jpg", "teacher1.jpg", "teacher2.jpg", "teacher3.jpg", "teacher4.jpg", 
                    "teacher5.jpg", "teacher6.jpg", "teacher7.jpg", "teacher8.jpg", "teacher9.jpg", "teacher10.jpg")

$allImagesExist = $true
foreach ($image in $requiredImages) {
    $imagePath = Join-Path $testAssetsPath $image
    if (-not (Test-Path $imagePath)) {
        Write-Host "❌ Missing: $image" -ForegroundColor Red
        $allImagesExist = $false
    }
}

if (-not $allImagesExist) {
    Write-Host ""
    Write-Host "Please create test images first:" -ForegroundColor Yellow
    Write-Host "  .\create-test-images-simple.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ All test images found" -ForegroundColor Green
Write-Host ""

# Start dev server in background
Write-Host "Starting dev server..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

Write-Host "Waiting for dev server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if server is running
$maxAttempts = 30
$attempt = 0
$serverRunning = $false

while ($attempt -lt $maxAttempts -and -not $serverRunning) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $serverRunning = $true
            Write-Host "✅ Dev server is running" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Write-Host "  Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $serverRunning) {
    Write-Host "❌ Failed to start dev server" -ForegroundColor Red
    Stop-Job -Job $serverJob
    Remove-Job -Job $serverJob
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location regist

try {
    if ($Form -eq "regist100" -or $Form -eq "both") {
        Write-Host "Running regist100 test..." -ForegroundColor Yellow
        npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal" --headed
        Write-Host ""
    }

    if ($Form -eq "regist-support" -or $Form -eq "both") {
        Write-Host "Running regist-support test..." -ForegroundColor Yellow
        npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal" --headed
        Write-Host ""
    }
} finally {
    Set-Location ..
    
    # Stop dev server
    Write-Host ""
    Write-Host "Stopping dev server..." -ForegroundColor Yellow
    Stop-Job -Job $serverJob
    Remove-Job -Job $serverJob
    Write-Host "✅ Dev server stopped" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tests Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check screenshots in:" -ForegroundColor Yellow
if ($Form -eq "regist100" -or $Form -eq "both") {
    Write-Host "  regist/test-results/regist100-image-size-warning-modal.png" -ForegroundColor White
}
if ($Form -eq "regist-support" -or $Form -eq "both") {
    Write-Host "  regist/test-results/regist-support-image-size-warning-modal.png" -ForegroundColor White
}
Write-Host ""
