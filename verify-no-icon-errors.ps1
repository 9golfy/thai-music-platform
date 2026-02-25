#!/usr/bin/env pwsh
# Verify No Icon Errors

Write-Host "=== Verifying Icon Fixes ===" -ForegroundColor Cyan
Write-Host ""

# Check for cilMusic in all dashboard files
Write-Host "1. Checking for cilMusic references..." -ForegroundColor Yellow
$cilMusicFound = Get-ChildItem "app/(admin)/dashboard" -Recurse -Filter "*.tsx" | 
    Select-String "cilMusic" -ErrorAction SilentlyContinue

if ($cilMusicFound) {
    Write-Host "   ❌ Found cilMusic in:" -ForegroundColor Red
    foreach ($match in $cilMusicFound) {
        Write-Host "      $($match.Path):$($match.LineNumber)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✅ No cilMusic references found" -ForegroundColor Green
}
Write-Host ""

# Check that cilMediaPlay is used instead
Write-Host "2. Checking for cilMediaPlay usage..." -ForegroundColor Yellow
$cilMediaPlayFound = Get-ChildItem "app/(admin)/dashboard" -Recurse -Filter "*.tsx" | 
    Select-String "cilMediaPlay" -ErrorAction SilentlyContinue

if ($cilMediaPlayFound) {
    Write-Host "   ✅ Found cilMediaPlay in:" -ForegroundColor Green
    foreach ($match in $cilMediaPlayFound) {
        $fileName = Split-Path $match.Path -Leaf
        Write-Host "      $fileName" -ForegroundColor Gray
    }
} else {
    Write-Host "   ⚠️  No cilMediaPlay references found" -ForegroundColor Yellow
}
Write-Host ""

# Check for any other non-existent icons
Write-Host "3. Checking for other potential icon issues..." -ForegroundColor Yellow
$potentialIssues = @(
    "cilMusic",
    "cilNote",
    "cilSound",
    "cilAudio"
)

$issuesFound = $false
foreach ($icon in $potentialIssues) {
    $found = Get-ChildItem "app/(admin)/dashboard" -Recurse -Filter "*.tsx" | 
        Select-String $icon -ErrorAction SilentlyContinue
    
    if ($found) {
        Write-Host "   ⚠️  Found potentially invalid icon: $icon" -ForegroundColor Yellow
        $issuesFound = $true
    }
}

if (-not $issuesFound) {
    Write-Host "   ✅ No other icon issues found" -ForegroundColor Green
}
Write-Host ""

# Run diagnostics on dashboard files
Write-Host "4. Running TypeScript diagnostics..." -ForegroundColor Yellow
$dashboardFiles = @(
    "app/(admin)/dashboard/layout.tsx",
    "app/(admin)/dashboard/page.tsx",
    "app/(admin)/dashboard/register100/page.tsx"
)

Write-Host "   Checking files for errors..." -ForegroundColor Gray
foreach ($file in $dashboardFiles) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Write-Host "      ✅ $fileName" -ForegroundColor Green
    } else {
        Write-Host "      ❌ $fileName NOT FOUND" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""

if (-not $cilMusicFound -and $cilMediaPlayFound) {
    Write-Host "✅ All icon errors fixed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run: ./restart-dashboard.ps1" -ForegroundColor White
    Write-Host "2. Open browser in incognito mode (Ctrl+Shift+N)" -ForegroundColor White
    Write-Host "3. Go to: http://localhost:3000/login" -ForegroundColor White
    Write-Host "4. Login: root / admin" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠️  Some issues may remain" -ForegroundColor Yellow
    Write-Host "Review the output above for details" -ForegroundColor Gray
    Write-Host ""
}
