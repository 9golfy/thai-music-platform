# Quick test script for register-support with image upload

Write-Host "=== Starting Quick Test ===" -ForegroundColor Green

# Clear database
Write-Host "`n1. Clearing database..." -ForegroundColor Yellow
docker-compose exec web node clear-register-support-db.js

# Run test
Write-Host "`n2. Running test..." -ForegroundColor Yellow
npx playwright test tests/regist-support-2teachers-quick.spec.ts --headed

# Check uploaded files
Write-Host "`n3. Checking uploaded files..." -ForegroundColor Yellow
docker-compose exec web sh -c "ls -la public/uploads/ | grep support"

# Check database
Write-Host "`n4. Checking database..." -ForegroundColor Yellow
docker-compose exec web node check-images-in-db.js

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
