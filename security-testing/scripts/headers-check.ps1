#!/usr/bin/env pwsh
# Security Headers Check (PowerShell)
# Validates presence and configuration of security headers

param(
    [string]$ConfigFile = "config/targets.json"
)

Write-Host "🔒 Security Headers Check" -ForegroundColor Cyan
Write-Host ""

# Load configuration
if (-not (Test-Path $ConfigFile)) {
    Write-Host "ERROR: Config file not found: $ConfigFile" -ForegroundColor Red
    exit 1
}

$config = Get-Content $ConfigFile | ConvertFrom-Json
$baseUrl = $config.baseUrl
$testUrls = @($baseUrl) + ($config.publicPages | ForEach-Object { "$baseUrl$_" })

# Required security headers
$requiredHeaders = @{
    "Strict-Transport-Security" = @{
        required = $true
        minValue = "max-age=31536000"
        description = "HSTS header missing or weak"
    }
    "X-Content-Type-Options" = @{
        required = $true
        expectedValue = "nosniff"
        description = "X-Content-Type-Options not set to nosniff"
    }
    "X-Frame-Options" = @{
        required = $true
        expectedValues = @("DENY", "SAMEORIGIN")
        description = "X-Frame-Options missing or weak"
    }
    "Content-Security-Policy" = @{
        required = $true
        description = "Content-Security-Policy header missing"
    }
    "Referrer-Policy" = @{
        required = $false
        expectedValues = @("no-referrer", "strict-origin-when-cross-origin", "same-origin")
        description = "Referrer-Policy not set or weak"
    }
    "Permissions-Policy" = @{
        required = $false
        description = "Permissions-Policy header missing"
    }
}

$results = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    target = $baseUrl
    tests = @()
    summary = @{
        total = 0
        passed = 0
        failed = 0
        warnings = 0
    }
}

Write-Host "Testing URLs:" -ForegroundColor Yellow
$testUrls | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""

foreach ($url in $testUrls) {
    Write-Host "Testing: $url" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
        $headers = $response.Headers
        $cookies = $response.Headers['Set-Cookie']
        
        $urlResult = @{
            url = $url
            headers = @{}
            cookies = @{}
            issues = @()
        }
        
        # Check security headers
        foreach ($headerName in $requiredHeaders.Keys) {
            $headerConfig = $requiredHeaders[$headerName]
            $headerValue = $headers[$headerName]
            
            $results.summary.total++
            
            if ($null -eq $headerValue -or $headerValue -eq "") {
                if ($headerConfig.required) {
                    $urlResult.issues += @{
                        severity = "HIGH"
                        header = $headerName
                        issue = $headerConfig.description
                    }
                    $results.summary.failed++
                    Write-Host "  ❌ $headerName: MISSING" -ForegroundColor Red
                } else {
                    $results.summary.warnings++
                    Write-Host "  ⚠️  $headerName: MISSING (optional)" -ForegroundColor Yellow
                }
            }
            else {
                $urlResult.headers[$headerName] = $headerValue
                
                # Validate header value
                $isValid = $true
                if ($headerConfig.expectedValue) {
                    if ($headerValue -ne $headerConfig.expectedValue) {
                        $isValid = $false
                    }
                }
                elseif ($headerConfig.expectedValues) {
                    if ($headerConfig.expectedValues -notcontains $headerValue) {
                        $isValid = $false
                    }
                }
                elseif ($headerConfig.minValue) {
                    if (-not $headerValue.Contains($headerConfig.minValue)) {
                        $isValid = $false
                    }
                }
                
                if ($isValid) {
                    $results.summary.passed++
                    Write-Host "  ✅ $headerName: $headerValue" -ForegroundColor Green
                } else {
                    $results.summary.warnings++
                    Write-Host "  ⚠️  $headerName: $headerValue (weak)" -ForegroundColor Yellow
                }
            }
        }
        
        # Check cookie flags
        if ($cookies) {
            foreach ($cookie in $cookies) {
                $cookieName = ($cookie -split '=')[0]
                $hasSecure = $cookie -match 'Secure'
                $hasHttpOnly = $cookie -match 'HttpOnly'
                $hasSameSite = $cookie -match 'SameSite'
                
                $urlResult.cookies[$cookieName] = @{
                    secure = $hasSecure
                    httpOnly = $hasHttpOnly
                    sameSite = $hasSameSite
                }
                
                $results.summary.total += 3
                
                if (-not $hasSecure) {
                    $urlResult.issues += @{
                        severity = "MEDIUM"
                        cookie = $cookieName
                        issue = "Cookie missing Secure flag"
                    }
                    $results.summary.failed++
                    Write-Host "  ❌ Cookie $cookieName : Missing Secure flag" -ForegroundColor Red
                } else {
                    $results.summary.passed++
                }
                
                if (-not $hasHttpOnly) {
                    $urlResult.issues += @{
                        severity = "MEDIUM"
                        cookie = $cookieName
                        issue = "Cookie missing HttpOnly flag"
                    }
                    $results.summary.failed++
                    Write-Host "  ❌ Cookie $cookieName : Missing HttpOnly flag" -ForegroundColor Red
                } else {
                    $results.summary.passed++
                }
                
                if (-not $hasSameSite) {
                    $urlResult.issues += @{
                        severity = "LOW"
                        cookie = $cookieName
                        issue = "Cookie missing SameSite attribute"
                    }
                    $results.summary.warnings++
                    Write-Host "  ⚠️  Cookie $cookieName : Missing SameSite attribute" -ForegroundColor Yellow
                } else {
                    $results.summary.passed++
                }
            }
        }
        
        $results.tests += $urlResult
    }
    catch {
        Write-Host "  ❌ Error testing URL: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Save results
$results | ConvertTo-Json -Depth 10 | Out-File "reports/headers-check.json" -Encoding UTF8

# Print summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Checks:   $($results.summary.total)" -ForegroundColor White
Write-Host "Passed:         $($results.summary.passed)" -ForegroundColor Green
Write-Host "Failed:         $($results.summary.failed)" -ForegroundColor Red
Write-Host "Warnings:       $($results.summary.warnings)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Report saved to: reports/headers-check.json" -ForegroundColor Cyan
Write-Host ""

if ($results.summary.failed -gt 0) {
    exit 1
} else {
    exit 0
}
