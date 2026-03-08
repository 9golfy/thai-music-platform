#!/usr/bin/env pwsh

Write-Host "🔄 QUICK DOCKER RESTART" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# Stop containers
Write-Host "⏹️  Stopping containers..." -ForegroundColor Yellow
docker-compose down

# Start containers
Write-Host "🚀 Starting containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait
Write-Host "⏳ Waiting 10 seconds for services..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Status
Write-Host ""
Write-Host "✅ Containers restarted!" -ForegroundColor Green
docker-compose ps

Write-Host ""
Write-Host "🔗 Application ready at: http://localhost:3000" -ForegroundColor Cyan
