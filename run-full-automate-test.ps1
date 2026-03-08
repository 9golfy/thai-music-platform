#!/usr/bin/env pwsh

Write-Host "🚀 Running FULL AUTOMATED TEST for Register Support Form" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Test Coverage:" -ForegroundColor Yellow
Write-Host "  ✓ Fill ALL fields completely" -ForegroundColor White
Write-Host "  ✓ Upload manager image (1 MB)" -ForegroundColor White
Write-Host "  ✓ Upload 9 teacher images (9 MB total)" -ForegroundColor White
Write-Host "  ✓ Verify total size < 10 MB" -ForegroundColor White
Write-Host "  ✓ Check all scoring cases (100 points)" -ForegroundColor White
Write-Host "  ✓ Verify data in MongoDB" -ForegroundColor White
Write-Host "  ✓ Check modal display (should show only once)" -ForegroundColor White
Write-Host ""

# Run the comprehensive test
npx playwright test tests/regist-support-full-9teachers-db-check.spec.ts --headed

Write-Host ""
Write-Host "✅ Test execution completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Check test-results/ folder for screenshots" -ForegroundColor Cyan
Write-Host "🔗 View submission at: http://localhost:3000/dashboard/register-support/[ID]" -ForegroundColor Cyan
