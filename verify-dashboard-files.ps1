#!/usr/bin/env pwsh
# Verify Dashboard Files Content

Write-Host "=== Verifying Dashboard Files ===" -ForegroundColor Cyan
Write-Host ""

# Check layout.tsx has CoreUI components
Write-Host "1. Checking layout.tsx for CoreUI components..." -ForegroundColor Yellow
$layoutContent = Get-Content "app/(admin)/dashboard/layout.tsx" -Raw

$checks = @(
    @{ Pattern = "CSidebar"; Name = "CSidebar component" },
    @{ Pattern = "CSidebarNav"; Name = "CSidebarNav component" },
    @{ Pattern = "CNavItem"; Name = "CNavItem component" },
    @{ Pattern = "Dashboard"; Name = "Dashboard menu item" },
    @{ Pattern = "register100"; Name = "Register100 menu item" },
    @{ Pattern = "Logout"; Name = "Logout menu item" }
)

foreach ($check in $checks) {
    if ($layoutContent -match $check.Pattern) {
        Write-Host "   ✅ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($check.Name) NOT FOUND" -ForegroundColor Red
    }
}
Write-Host ""

# Check page.tsx has dashboard widgets
Write-Host "2. Checking page.tsx for dashboard widgets..." -ForegroundColor Yellow
$pageContent = Get-Content "app/(admin)/dashboard/page.tsx" -Raw

$pageChecks = @(
    @{ Pattern = "CWidgetStatsA"; Name = "Statistics widgets" },
    @{ Pattern = "register100"; Name = "Register100 stats" },
    @{ Pattern = "Dashboard"; Name = "Dashboard title" },
    @{ Pattern = "CCard"; Name = "Card components" }
)

foreach ($check in $pageChecks) {
    if ($pageContent -match $check.Pattern) {
        Write-Host "   ✅ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($check.Name) NOT FOUND" -ForegroundColor Red
    }
}
Write-Host ""

# Check root layout has CoreUI CSS
Write-Host "3. Checking root layout for CoreUI CSS..." -ForegroundColor Yellow
$rootLayoutContent = Get-Content "app/layout.tsx" -Raw

if ($rootLayoutContent -match "@coreui/coreui/dist/css/coreui.min.css") {
    Write-Host "   ✅ CoreUI CSS imported" -ForegroundColor Green
} else {
    Write-Host "   ❌ CoreUI CSS NOT imported" -ForegroundColor Red
}
Write-Host ""

# Show file sizes
Write-Host "4. File sizes..." -ForegroundColor Yellow
$files = @(
    "app/(admin)/dashboard/layout.tsx",
    "app/(admin)/dashboard/page.tsx",
    "app/layout.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $sizeKB = [math]::Round($size / 1KB, 2)
        Write-Host "   $file : $sizeKB KB" -ForegroundColor Gray
    }
}
Write-Host ""

# Show first few lines of layout
Write-Host "5. First 10 lines of layout.tsx..." -ForegroundColor Yellow
Get-Content "app/(admin)/dashboard/layout.tsx" | Select-Object -First 10 | ForEach-Object {
    Write-Host "   $_" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "=== Verification Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all checks passed (✅), files are correct." -ForegroundColor Green
Write-Host "The issue is browser/Next.js cache." -ForegroundColor Yellow
Write-Host ""
Write-Host "Run: ./restart-dashboard.ps1" -ForegroundColor White
Write-Host ""
