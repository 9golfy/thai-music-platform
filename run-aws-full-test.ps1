# Run full automated test on AWS Production with 9 teachers
Write-Host "🚀 Running FULL test on AWS with 9 teachers..." -ForegroundColor Green
Write-Host "🌐 Target: http://13.212.254.184:3000/regist-support" -ForegroundColor Cyan
Write-Host "📊 Upload size: ~5.1 MB (1 manager + 9 teachers)" -ForegroundColor Yellow
Write-Host ""

npx playwright test tests/aws-full-9teachers-test.spec.ts --headed

Write-Host ""
Write-Host "✅ Test completed!" -ForegroundColor Green
