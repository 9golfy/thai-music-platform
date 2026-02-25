#!/usr/bin/env pwsh
# Simple Security Headers Check

param(
    [string]$Url = "http://localhost:3000"
)

Write-Host "Security Headers Check for: $Url" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -ErrorAction Stop
    
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    
    # Check security headers
    $headers = @(
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Content-Security-Policy",
        "Referrer-Policy",
        "Permissions-Policy"
    )
    
    $passed = 0
    $failed = 0
    
    foreach ($header in $headers) {
        $value = $response.Headers[$header]
        if ($value) {
            Write-Host "[PASS] $header : $value" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "[FAIL] $header : MISSING" -ForegroundColor Red
            $failed++
        }
    }
    
    Write-Host ""
    Write-Host "Summary: $passed passed, $failed failed" -ForegroundColor Cyan
    
    if ($failed -gt 0) {
        exit 1
    } else {
        exit 0
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
