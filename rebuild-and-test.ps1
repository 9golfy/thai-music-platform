#!/usr/bin/env pwsh

Write-Host "🔄 DOCKER REBUILD AND RETEST SCRIPT" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all running containers
Write-Host "📦 Step 1: Stopping Docker containers..." -ForegroundColor Yellow
docker-compose down
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker containers stopped successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  No containers were running or error occurred" -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Remove old images (optional - uncomment if you want clean rebuild)
# Write-Host "🗑️  Step 2: Removing old Docker images..." -ForegroundColor Yellow
# docker-compose rm -f
# docker rmi $(docker images -q)

# Step 3: Clean MongoDB data (optional - uncomment to start fresh)
Write-Host "🗑️  Step 2: Do you want to clean MongoDB data? (y/n)" -ForegroundColor Yellow
$cleanMongo = Read-Host "Enter choice"
if ($cleanMongo -eq "y" -or $cleanMongo -eq "Y") {
    Write-Host "🗑️  Cleaning MongoDB data..." -ForegroundColor Yellow
    if (Test-Path "mongo-data") {
        Remove-Item -Recurse -Force mongo-data
        Write-Host "✅ MongoDB data cleaned" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No mongo-data folder found" -ForegroundColor Cyan
    }
}
Write-Host ""

# Step 4: Rebuild Docker containers
Write-Host "🔨 Step 3: Building Docker containers..." -ForegroundColor Yellow
docker-compose build --no-cache
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker containers built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Start Docker containers
Write-Host "🚀 Step 4: Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker containers started successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Docker start failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Wait for services to be ready
Write-Host "⏳ Step 5: Waiting for services to be ready..." -ForegroundColor Yellow
Write-Host "   Waiting 10 seconds for MongoDB and Next.js..." -ForegroundColor Cyan
Start-Sleep -Seconds 10
Write-Host "✅ Services should be ready now" -ForegroundColor Green
Write-Host ""

# Step 7: Check container status
Write-Host "📊 Step 6: Checking container status..." -ForegroundColor Yellow
docker-compose ps
Write-Host ""

# Step 8: Show logs (last 20 lines)
Write-Host "📋 Step 7: Recent logs..." -ForegroundColor Yellow
docker-compose logs --tail=20
Write-Host ""

# Step 9: Test MongoDB connection
Write-Host "🔍 Step 8: Testing MongoDB connection..." -ForegroundColor Yellow
docker exec -it mongodb mongosh --eval "db.adminCommand('ping')" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB is responding" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB connection test failed (might still be starting)" -ForegroundColor Yellow
}
Write-Host ""

# Step 10: Ask if user wants to run tests
Write-Host "🧪 Step 9: Ready to run tests!" -ForegroundColor Green
Write-Host ""
Write-Host "Available test options:" -ForegroundColor Cyan
Write-Host "  1. Full automated test (9 teachers, all fields, 100 points)" -ForegroundColor White
Write-Host "  2. Quick test (2 teachers)" -ForegroundColor White
Write-Host "  3. Skip tests for now" -ForegroundColor White
Write-Host ""
$testChoice = Read-Host "Enter your choice (1/2/3)"

switch ($testChoice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Running FULL automated test..." -ForegroundColor Green
        Write-Host ""
        npx playwright test tests/regist-support-full-9teachers-db-check.spec.ts --headed
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Running QUICK test..." -ForegroundColor Green
        Write-Host ""
        npx playwright test tests/regist-support-2teachers-quick.spec.ts --headed
    }
    "3" {
        Write-Host ""
        Write-Host "✅ Skipping tests. Services are ready!" -ForegroundColor Green
    }
    default {
        Write-Host ""
        Write-Host "⚠️  Invalid choice. Skipping tests." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ REBUILD COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Useful commands:" -ForegroundColor Cyan
Write-Host "  • View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "  • Stop containers: docker-compose down" -ForegroundColor White
Write-Host "  • Restart containers: docker-compose restart" -ForegroundColor White
Write-Host "  • Access MongoDB: docker exec -it mongodb mongosh" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Application URLs:" -ForegroundColor Cyan
Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  • Register Support: http://localhost:3000/regist-support" -ForegroundColor White
Write-Host "  • Dashboard: http://localhost:3000/dashboard" -ForegroundColor White
Write-Host ""
