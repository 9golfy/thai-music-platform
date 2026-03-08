# Full comprehensive test script for both regist100 and regist-support
# This runs ALL test cases including image size warning tests

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Full Test Suite" -ForegroundColor Cyan
Write-Host "  regist100 + regist-support" -ForegroundColor Cyan
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
    Write-Host "Creating test images..." -ForegroundColor Yellow
    .\create-test-images-simple.ps1
    Write-Host ""
}

Write-Host "✅ All test images ready" -ForegroundColor Green
Write-Host ""

# Check if dev server is running
Write-Host "Checking dev server..." -ForegroundColor Yellow
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
        Write-Host "✅ Dev server is running" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Dev server is NOT running" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please start dev server in another terminal:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key when server is ready, or Ctrl+C to cancel..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Plan" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. regist100 - Full form test" -ForegroundColor White
Write-Host "2. regist100 - Image size warning test" -ForegroundColor White
Write-Host "3. regist-support - Full form test" -ForegroundColor White
Write-Host "4. regist-support - Image size warning test" -ForegroundColor White
Write-Host ""
Write-Host "Estimated time: 10-15 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to start, or Ctrl+C to cancel..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""

Set-Location regist

$testResults = @()

# ==================== TEST 1: regist100 Full Form ====================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 1/4: regist100 Full Form" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$test1Start = Get-Date
npx playwright test tests/register100-full-fields.spec.ts --grep "Fill ALL fields" --headed
$test1End = Get-Date
$test1Duration = ($test1End - $test1Start).TotalSeconds

$testResults += [PSCustomObject]@{
    Test = "regist100 Full Form"
    Duration = "$([math]::Round($test1Duration, 2))s"
    Status = if ($LASTEXITCODE -eq 0) { "✅ PASS" } else { "❌ FAIL" }
}

# ==================== TEST 2: regist100 Image Size Warning ====================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 2/4: regist100 Image Size Warning" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$test2Start = Get-Date
npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal" --headed
$test2End = Get-Date
$test2Duration = ($test2End - $test2Start).TotalSeconds

$testResults += [PSCustomObject]@{
    Test = "regist100 Image Size Warning"
    Duration = "$([math]::Round($test2Duration, 2))s"
    Status = if ($LASTEXITCODE -eq 0) { "✅ PASS" } else { "❌ FAIL" }
}

# ==================== TEST 3: regist-support Full Form ====================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 3/4: regist-support Full Form" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$test3Start = Get-Date
npx playwright test tests/regist-support-full.spec.ts --grep "Fill all fields and submit successfully" --headed
$test3End = Get-Date
$test3Duration = ($test3End - $test3Start).TotalSeconds

$testResults += [PSCustomObject]@{
    Test = "regist-support Full Form"
    Duration = "$([math]::Round($test3Duration, 2))s"
    Status = if ($LASTEXITCODE -eq 0) { "✅ PASS" } else { "❌ FAIL" }
}

# ==================== TEST 4: regist-support Image Size Warning ====================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 4/4: regist-support Image Size Warning" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$test4Start = Get-Date
npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal" --headed
$test4End = Get-Date
$test4Duration = ($test4End - $test4Start).TotalSeconds

$testResults += [PSCustomObject]@{
    Test = "regist-support Image Size Warning"
    Duration = "$([math]::Round($test4Duration, 2))s"
    Status = if ($LASTEXITCODE -eq 0) { "✅ PASS" } else { "❌ FAIL" }
}

Set-Location ..

# ==================== TEST SUMMARY ====================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$testResults | Format-Table -AutoSize

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Status -like "*PASS*" }).Count
$failedTests = $totalTests - $passedTests

Write-Host ""
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor $(if ($failedTests -gt 0) { "Red" } else { "Green" })
Write-Host ""

# ==================== SCREENSHOTS ====================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Screenshots & Reports" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check results in:" -ForegroundColor Yellow
Write-Host "  regist/test-results/" -ForegroundColor White
Write-Host ""
Write-Host "Screenshots:" -ForegroundColor Yellow
Write-Host "  - regist100-image-size-warning-modal.png" -ForegroundColor White
Write-Host "  - regist-support-image-size-warning-modal.png" -ForegroundColor White
Write-Host ""
Write-Host "HTML Report:" -ForegroundColor Yellow
Write-Host "  npx playwright show-report" -ForegroundColor White
Write-Host ""

if ($failedTests -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! 🎉" -ForegroundColor Green
} else {
    Write-Host "⚠️  SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "Review the output above for details" -ForegroundColor Yellow
}

Write-Host ""
