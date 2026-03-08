#!/usr/bin/env pwsh
# Security Testing Suite - Master Runner (PowerShell)
# Runs all security scans and generates summary report

param(
    [string]$ConfigFile = "config/targets.json",
    [switch]$SkipZap,
    [switch]$SkipTLS,
    [switch]$SkipHeaders,
    [switch]$SkipCORS,
    [switch]$SkipJSDeps
)

$ErrorActionPreference = "Continue"
$StartTime = Get-Date

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Testing Suite - Full Scan" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if config file exists
if (-not (Test-Path $ConfigFile)) {
    Write-Host "ERROR: Config file not found: $ConfigFile" -ForegroundColor Red
    Write-Host "Please copy config/targets.example.json to config/targets.json and configure it." -ForegroundColor Yellow
    exit 1
}

# Create reports directory
if (-not (Test-Path "reports")) {
    New-Item -ItemType Directory -Path "reports" | Out-Null
}

# Initialize results
$Results = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    scans = @{}
    summary = @{
        total = 0
        passed = 0
        failed = 0
        warnings = 0
    }
}

# Function to run scan and track results
function Invoke-SecurityScan {
    param(
        [string]$Name,
        [string]$Script,
        [switch]$Skip
    )
    
    if ($Skip) {
        Write-Host "⏭️  Skipping $Name" -ForegroundColor Yellow
        return
    }
    
    Write-Host ""
    Write-Host "▶️  Running $Name..." -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    $scanStart = Get-Date
    $scriptPath = Join-Path "scripts" $Script
    
    try {
        & $scriptPath -ConfigFile $ConfigFile
        $exitCode = $LASTEXITCODE
        $duration = (Get-Date) - $scanStart
        
        $Results.scans[$Name] = @{
            status = if ($exitCode -eq 0) { "PASS" } else { "FAIL" }
            duration = $duration.TotalSeconds
            exitCode = $exitCode
        }
        
        $Results.summary.total++
        if ($exitCode -eq 0) {
            $Results.summary.passed++
            Write-Host "✅ $Name completed successfully" -ForegroundColor Green
        } else {
            $Results.summary.failed++
            Write-Host "❌ $Name failed with exit code $exitCode" -ForegroundColor Red
        }
    }
    catch {
        $duration = (Get-Date) - $scanStart
        $Results.scans[$Name] = @{
            status = "ERROR"
            duration = $duration.TotalSeconds
            error = $_.Exception.Message
        }
        $Results.summary.total++
        $Results.summary.failed++
        Write-Host "❌ $Name encountered an error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Run all scans
Invoke-SecurityScan -Name "OWASP ZAP Baseline" -Script "zap-baseline.ps1" -Skip:$SkipZap
Invoke-SecurityScan -Name "TLS/SSL Configuration" -Script "tls-scan.ps1" -Skip:$SkipTLS
Invoke-SecurityScan -Name "Security Headers" -Script "headers-check.ps1" -Skip:$SkipHeaders
Invoke-SecurityScan -Name "CORS Configuration" -Script "cors-check.ps1" -Skip:$SkipCORS
Invoke-SecurityScan -Name "JavaScript Dependencies" -Script "js-deps-scan.ps1" -Skip:$SkipJSDeps

# Calculate total duration
$TotalDuration = (Get-Date) - $StartTime

# Save summary report
$Results.summary.duration = $TotalDuration.TotalSeconds
$Results | ConvertTo-Json -Depth 10 | Out-File "reports/summary.json" -Encoding UTF8

# Print summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Scan Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Scans:    $($Results.summary.total)" -ForegroundColor White
Write-Host "Passed:         $($Results.summary.passed)" -ForegroundColor Green
Write-Host "Failed:         $($Results.summary.failed)" -ForegroundColor Red
Write-Host "Warnings:       $($Results.summary.warnings)" -ForegroundColor Yellow
Write-Host "Duration:       $([math]::Round($TotalDuration.TotalSeconds, 2)) seconds" -ForegroundColor White
Write-Host ""
Write-Host "Reports saved to: reports/" -ForegroundColor Cyan
Write-Host ""

# Exit with appropriate code
if ($Results.summary.failed -gt 0) {
    Write-Host "⚠️  Some scans failed. Please review the reports." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ All scans completed successfully!" -ForegroundColor Green
    exit 0
}
