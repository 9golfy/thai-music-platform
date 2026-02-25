#!/usr/bin/env pwsh
# Dashboard Diagnostic Script

Write-Host "=== Dashboard Diagnostic Check ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check CoreUI packages
Write-Host "1. Checking CoreUI packages..." -ForegroundColor Yellow
$coreui = npm list @coreui/react 2>&1 | Select-String "@coreui"
if ($coreui) {
    Write-Host "   ✅ CoreUI packages installed" -ForegroundColor Green
    Write-Host "   $coreui" -ForegroundColor Gray
} else {
    Write-Host "   ❌ CoreUI packages NOT installed" -ForegroundColor Red
    Write-Host "   Run: npm install @coreui/coreui @coreui/react @coreui/icons @coreui/icons-react" -ForegroundColor Yellow
}
Write-Host ""

# 2. Check files exist
Write-Host "2. Checking dashboard files..." -ForegroundColor Yellow
$files = @(
    "app/(admin)/dashboard/layout.tsx",
    "app/(admin)/dashboard/page.tsx",
    "app/layout.tsx",
    "app/(admin)/dashboard/coreui-styles.css"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file NOT FOUND" -ForegroundColor Red
    }
}
Write-Host ""

# 3. Check for old files
Write-Host "3. Checking for old/conflicting files..." -ForegroundColor Yellow
$oldFiles = Get-ChildItem "app/(admin)/dashboard" -Filter "*-new.tsx" -ErrorAction SilentlyContinue
$oldFiles += Get-ChildItem "app/(admin)/dashboard" -Filter "*-old.tsx" -ErrorAction SilentlyContinue

if ($oldFiles.Count -eq 0) {
    Write-Host "   ✅ No old files found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Found old files:" -ForegroundColor Yellow
    foreach ($file in $oldFiles) {
        Write-Host "      - $($file.Name)" -ForegroundColor Gray
    }
    Write-Host "   Consider deleting these files" -ForegroundColor Yellow
}
Write-Host ""

# 4. Check CoreUI import in root layout
Write-Host "4. Checking CoreUI CSS import..." -ForegroundColor Yellow
$rootLayout = Get-Content "app/layout.tsx" -Raw
if ($rootLayout -match "@coreui/coreui/dist/css/coreui.min.css") {
    Write-Host "   ✅ CoreUI CSS imported in root layout" -ForegroundColor Green
} else {
    Write-Host "   ❌ CoreUI CSS NOT imported in root layout" -ForegroundColor Red
    Write-Host "   Add this line to app/layout.tsx:" -ForegroundColor Yellow
    Write-Host "   import '@coreui/coreui/dist/css/coreui.min.css'" -ForegroundColor Gray
}
Write-Host ""

# 5. Check if dev server is running
Write-Host "5. Checking dev server..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ✅ Node processes running: $($nodeProcesses.Count)" -ForegroundColor Green
    foreach ($proc in $nodeProcesses) {
        Write-Host "      - PID: $($proc.Id)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ⚠️  No Node processes found" -ForegroundColor Yellow
    Write-Host "   Start dev server: npm run dev" -ForegroundColor Gray
}
Write-Host ""

# 6. Check port 3000
Write-Host "6. Checking port 3000..." -ForegroundColor Yellow
$port3000 = netstat -ano | Select-String ":3000"
if ($port3000) {
    Write-Host "   ✅ Port 3000 is in use" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Port 3000 is not in use" -ForegroundColor Yellow
    Write-Host "   Dev server may not be running" -ForegroundColor Gray
}
Write-Host ""

# 7. Check .next folder
Write-Host "7. Checking Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    $nextSize = (Get-ChildItem .next -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   ✅ .next folder exists ($([math]::Round($nextSize, 2)) MB)" -ForegroundColor Green
    Write-Host "   If having issues, delete this folder and restart" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  .next folder not found" -ForegroundColor Yellow
    Write-Host "   Run: npm run dev" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. If dev server is running, stop it (Ctrl+C)" -ForegroundColor White
Write-Host "2. Delete .next folder: Remove-Item -Recurse -Force .next" -ForegroundColor White
Write-Host "3. Start dev server: npm run dev" -ForegroundColor White
Write-Host "4. Open browser in incognito mode" -ForegroundColor White
Write-Host "5. Go to: http://localhost:3000/login" -ForegroundColor White
Write-Host "6. Login with: root / admin" -ForegroundColor White
Write-Host "7. Check if sidebar appears" -ForegroundColor White
Write-Host ""
Write-Host "If still not working, check browser console (F12) for errors" -ForegroundColor Gray
Write-Host ""
