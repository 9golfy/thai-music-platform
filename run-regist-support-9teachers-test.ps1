# Run Register Support Full Test with 9 Teachers and DB Verification
# This test fills all fields, uploads 9 teacher images (9 MB) + 1 manager image (1 MB) = 10 MB total
# Then verifies all data is correctly saved in MongoDB

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Register Support - Full Test (9 Teachers)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Details:" -ForegroundColor Yellow
Write-Host "  - Fill ALL form fields" -ForegroundColor White
Write-Host "  - Upload 9 teacher images (9 MB)" -ForegroundColor White
Write-Host "  - Upload 1 manager image (1 MB)" -ForegroundColor White
Write-Host "  - Total: 10 MB (within limit)" -ForegroundColor White
Write-Host "  - Verify data saved in MongoDB" -ForegroundColor White
Write-Host "  - Expected score: 100 points" -ForegroundColor White
Write-Host ""

# Check if test images exist
$testAssetsPath = "regist\test-assets"
if (-not (Test-Path $testAssetsPath)) {
    Write-Host "❌ Test assets folder not found!" -ForegroundColor Red
    Write-Host "Please run create-test-images-simple.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Check for required images
$requiredImages = @("manager.jpg") + (1..9 | ForEach-Object { "teacher$_.jpg" })
$missingImages = @()

foreach ($image in $requiredImages) {
    $imagePath = Join-Path $testAssetsPath $image
    if (-not (Test-Path $imagePath)) {
        $missingImages += $image
    }
}

if ($missingImages.Count -gt 0) {
    Write-Host "❌ Missing test images:" -ForegroundColor Red
    $missingImages | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Please run create-test-images-simple.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All test images found" -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB is not running!" -ForegroundColor Red
        Write-Host "Please start MongoDB first" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "⚠️  Could not verify MongoDB (mongosh not found)" -ForegroundColor Yellow
    Write-Host "Assuming MongoDB is running..." -ForegroundColor White
}

Write-Host ""
Write-Host "Starting test..." -ForegroundColor Cyan
Write-Host ""

# Run the test
npx playwright test tests/regist-support-full-9teachers-db-check.spec.ts --headed --workers=1

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($exitCode -eq 0) {
    Write-Host "✅ TEST PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Yellow
    Write-Host "  ✅ Form submitted successfully" -ForegroundColor Green
    Write-Host "  ✅ All fields filled correctly" -ForegroundColor Green
    Write-Host "  ✅ 9 teachers + 1 manager = 10 MB (within limit)" -ForegroundColor Green
    Write-Host "  ✅ Data verified in MongoDB" -ForegroundColor Green
    Write-Host "  ✅ Score: 100 points" -ForegroundColor Green
    Write-Host ""
    Write-Host "Screenshot saved: test-results/regist-support-9teachers-submission.png" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "View submission in dashboard:" -ForegroundColor Yellow
    Write-Host "  http://localhost:3000/dashboard/register-support" -ForegroundColor White
} else {
    Write-Host "❌ TEST FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan

exit $exitCode
