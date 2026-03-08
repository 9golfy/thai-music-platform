#!/usr/bin/env pwsh
# Dashboard Restart Script - Clean restart of dev server

Write-Host "=== Dashboard Clean Restart ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill all node processes
Write-Host "Step 1: Stopping all Node processes..." -ForegroundColor Yellow
try {
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "   Found $($nodeProcesses.Count) Node processes" -ForegroundColor Gray
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "   ✅ All Node processes stopped" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  No Node processes running" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Error stopping processes: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Delete .next folder
Write-Host "Step 2: Deleting Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    try {
        Remove-Item -Recurse -Force .next
        Write-Host "   ✅ .next folder deleted" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Error deleting .next: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "   Try manually: Remove-Item -Recurse -Force .next" -ForegroundColor Gray
    }
} else {
    Write-Host "   ℹ️  .next folder doesn't exist" -ForegroundColor Gray
}
Write-Host ""

# Step 3: Start dev server
Write-Host "Step 3: Starting dev server..." -ForegroundColor Yellow
Write-Host "   Running: npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "=== Dev Server Starting ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "After server starts:" -ForegroundColor Yellow
Write-Host "1. Open browser in INCOGNITO/PRIVATE mode" -ForegroundColor White
Write-Host "2. Go to: http://localhost:3000/login" -ForegroundColor White
Write-Host "3. Login:" -ForegroundColor White
Write-Host "   Username: root" -ForegroundColor Gray
Write-Host "   Password: admin" -ForegroundColor Gray
Write-Host "4. You should see the dashboard with sidebar menu" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start dev server
npm run dev
