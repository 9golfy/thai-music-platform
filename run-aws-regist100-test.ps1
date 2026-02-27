# Run full automated test on AWS Production for Register100 with 9 teachers
Write-Host "🚀 Running FULL Register100 test on AWS with 9 teachers..." -ForegroundColor Green
Write-Host "🌐 Target: http://13.228.225.47:3000/regist100" -ForegroundColor Cyan
Write-Host "📊 Upload size: ~5.1 MB (1 manager + 9 teachers)" -ForegroundColor Yellow
Write-Host ""

npx playwright test tests/aws-regist100-full-9teachers.spec.ts --headed

Write-Host ""
Write-Host "✅ Test completed!" -ForegroundColor Green
