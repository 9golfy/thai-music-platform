# Run automated test on AWS Production
Write-Host "🚀 Running Register Support test on AWS Production..." -ForegroundColor Green
Write-Host "🌐 Target: http://13.212.254.184:3000/regist-support" -ForegroundColor Cyan
Write-Host ""

npx playwright test tests/aws-regist-support-test.spec.ts --headed

Write-Host ""
Write-Host "✅ Test completed!" -ForegroundColor Green
