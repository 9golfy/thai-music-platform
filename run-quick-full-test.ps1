# Quick full test - runs all tests assuming dev server is running

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Quick Full Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check dev server
Write-Host "Checking dev server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Dev server is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Dev server is NOT running" -ForegroundColor Red
    Write-Host "Please start: npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running All Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. regist100 - Image Size Warning Test" -ForegroundColor Yellow
npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal" --headed

Write-Host ""
Write-Host "2. regist-support - Image Size Warning Test" -ForegroundColor Yellow
npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal" --headed

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tests Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check screenshots in: regist/test-results/" -ForegroundColor Yellow
Write-Host ""
