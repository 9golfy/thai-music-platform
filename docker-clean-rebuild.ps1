#!/usr/bin/env pwsh

Write-Host "🧹 COMPLETE DOCKER CLEAN & REBUILD" -ForegroundColor Red
Write-Host "===================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  WARNING: This will:" -ForegroundColor Yellow
Write-Host "  • Stop all containers" -ForegroundColor White
Write-Host "  • Remove all containers" -ForegroundColor White
Write-Host "  • Remove all images" -ForegroundColor White
Write-Host "  • Delete MongoDB data (all submissions will be lost)" -ForegroundColor White
Write-Host "  • Rebuild everything from scratch" -ForegroundColor White
Write-Host ""
$confirm = Read-Host "Are you sure? Type 'YES' to continue"

if ($confirm -ne "YES") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🗑️  Step 1: Stopping and removing containers..." -ForegroundColor Yellow
docker-compose down -v
docker-compose rm -f

Write-Host ""
Write-Host "🗑️  Step 2: Removing Docker images..." -ForegroundColor Yellow
$images = docker images -q
if ($images) {
    docker rmi -f $images
    Write-Host "✅ Images removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No images to remove" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🗑️  Step 3: Cleaning MongoDB data..." -ForegroundColor Yellow
if (Test-Path "mongo-data") {
    Remove-Item -Recurse -Force mongo-data
    Write-Host "✅ MongoDB data cleaned" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No mongo-data folder found" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🗑️  Step 4: Cleaning uploads folder..." -ForegroundColor Yellow
if (Test-Path "public/uploads") {
    Remove-Item -Recurse -Force public/uploads/*
    Write-Host "✅ Uploads cleaned" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No uploads folder found" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🔨 Step 5: Rebuilding containers (no cache)..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host ""
Write-Host "🚀 Step 6: Starting containers..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "⏳ Step 7: Waiting for services (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "📊 Step 8: Container status..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "✅ CLEAN REBUILD COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Application ready at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📝 MongoDB is empty - ready for fresh testing" -ForegroundColor Cyan
Write-Host ""
