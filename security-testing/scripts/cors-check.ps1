#!/usr/bin/env pwsh
# CORS Configuration Check (PowerShell)

param(
    [string]$ConfigFile = "config/targets.json"
)

Write-Host "🌐 CORS Configuration Check" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $ConfigFile)) {
    Write-Host "ERROR: Config file not found: $ConfigFile" -ForegroundColor Red
    exit 1
}

$config = Get-Content $ConfigFile | ConvertFrom-Json
$baseUrl = $config.baseUrl
$testUrls = @($baseUrl) + ($config.apiEndpoints | ForEach-Object { "$baseUrl$_" })
$testOrigins = $config.testOrigins

$results = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    target = $baseUrl
    tests = @()
    summary = @{
        total = 0
        passed = 0
        failed = 0
    }
}

Write-Host "Testing CORS on:" -ForegroundColor Yellow
$testUrls | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""

foreach ($url in $testUrls) {
    foreach ($origin in $testOrigins) {
        Write-Host "Testing: $url with Origin: $origin" -ForegroundColor Cyan
        
        try {
            $headers = @{
                "Origin" = $origin
            }
            
            $response = Invoke-WebRequest -Uri $url -Method GET -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue
            
            $allowOrigin = $response.Headers['Access-Control-Allow-Origin']
            $allowCredentials = $response.Headers['Access-Control-Allow-Credentials']
            
            $results.summary.total++
            
            $testResult = @{
                url = $url
                origin = $origin
                allowOrigin = $allowOrigin
                allowCredentials = $allowCredentials
                vulnerable = $false
                issues = @()
            }
            
            # Check for wildcard with credentials
            if ($allowOrigin -eq '*' -and $allowCredentials -eq 'true') {
                $testResult.vulnerable = $true
                $testResult.issues += "CRITICAL: Wildcard origin (*) with credentials enabled"
                $results.summary.failed++
                Write-Host "  ❌ VULNERABLE: Wildcard with credentials" -ForegroundColor Red
            }
            # Check for origin reflection
            elseif ($allowOrigin -eq $origin -and $origin -ne $baseUrl) {
                $testResult.vulnerable = $true
                $testResult.issues += "HIGH: Origin reflection - accepts arbitrary origins"
                $results.summary.failed++
                Write-Host "  ❌ VULNERABLE: Origin reflection" -ForegroundColor Red
            }
            # Check for null origin
            elseif ($allowOrigin -eq 'null') {
                $testResult.vulnerable = $true
                $testResult.issues += "MEDIUM: Accepts null origin"
                $results.summary.failed++
                Write-Host "  ⚠️  VULNERABLE: Null origin accepted" -ForegroundColor Yellow
            }
            else {
                $results.summary.passed++
                Write-Host "  ✅ CORS properly configured" -ForegroundColor Green
            }
            
            $results.tests += $testResult
        }
        catch {
            Write-Host "  ℹ️  No CORS headers (expected for same-origin)" -ForegroundColor Gray
        }
        
        Start-Sleep -Milliseconds 500
    }
    Write-Host ""
}

$results | ConvertTo-Json -Depth 10 | Out-File "reports/cors-check.json" -Encoding UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests:    $($results.summary.total)" -ForegroundColor White
Write-Host "Passed:         $($results.summary.passed)" -ForegroundColor Green
Write-Host "Failed:         $($results.summary.failed)" -ForegroundColor Red
Write-Host ""
Write-Host "Report saved to: reports/cors-check.json" -ForegroundColor Cyan
Write-Host ""

if ($results.summary.failed -gt 0) {
    exit 1
} else {
    exit 0
}
