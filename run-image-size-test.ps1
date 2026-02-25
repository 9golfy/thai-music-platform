# PowerShell script to run image size warning modal test

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Image Size Warning Modal Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if dev server is running
Write-Host "Checking if dev server is running on port 3000..." -ForegroundColor Yellow
$devServerRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $devServerRunning = $true
        Write-Host "✅ Dev server is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Dev server is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the dev server first:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Check if test images exist
Write-Host ""
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

# Run the test
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running Playwright Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location regist

Write-Host "Test Scenario:" -ForegroundColor Yellow
Write-Host "  1. Upload manager image (1 MB) in Step 2" -ForegroundColor White
Write-Host "  2. Upload 10 teacher images (10 MB) in Step 4" -ForegroundColor White
Write-Host "  3. Total = 11 MB (exceeds 10 MB limit)" -ForegroundColor White
Write-Host "  4. Warning modal should appear" -ForegroundColor White
Write-Host "  5. User must click 'รับทราบ' button to close" -ForegroundColor White
Write-Host "  6. User removes 1 teacher to reduce size" -ForegroundColor White
Write-Host "  7. Modal should not appear again (10 MB total)" -ForegroundColor White
Write-Host ""

npx playwright test tests/image-size-warning.spec.ts --headed

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check screenshots in:" -ForegroundColor Yellow
Write-Host "  regist/test-results/image-size-warning-modal.png" -ForegroundColor White
Write-Host "  regist/test-results/image-size-warning-modal-support.png" -ForegroundColor White
Write-Host ""
