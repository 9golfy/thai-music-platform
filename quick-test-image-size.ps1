# Quick test script - assumes dev server is already running

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("regist100", "regist-support", "both")]
    [string]$Form = "regist100"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Quick Image Size Warning Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: Make sure dev server is running (npm run dev)" -ForegroundColor Yellow
Write-Host ""

Set-Location regist

if ($Form -eq "regist100" -or $Form -eq "both") {
    Write-Host "Running regist100 test..." -ForegroundColor Green
    npx playwright test tests/register100-full-fields.spec.ts --grep "should show warning modal" --headed
    Write-Host ""
}

if ($Form -eq "regist-support" -or $Form -eq "both") {
    Write-Host "Running regist-support test..." -ForegroundColor Green
    npx playwright test tests/regist-support-full.spec.ts --grep "should show warning modal" --headed
    Write-Host ""
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
