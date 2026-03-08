#!/usr/bin/env pwsh
# OWASP ZAP Baseline Scan (PowerShell)
# Performs automated security scanning using OWASP ZAP Docker container

param(
    [string]$ConfigFile = "config/targets.json"
)

Write-Host "🔍 OWASP ZAP Baseline Scan" -ForegroundColor Cyan
Write-Host ""

# Load configuration
if (-not (Test-Path $ConfigFile)) {
    Write-Host "ERROR: Config file not found: $ConfigFile" -ForegroundColor Red
    exit 1
}

$config = Get-Content $ConfigFile | ConvertFrom-Json
$targetUrl = $config.baseUrl

Write-Host "Target: $targetUrl" -ForegroundColor Yellow
Write-Host ""

# Check if Docker is running
try {
    docker ps | Out-Null
}
catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Create reports directory
$reportsDir = Resolve-Path "reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

# Run OWASP ZAP Baseline Scan
Write-Host "Starting ZAP baseline scan..." -ForegroundColor Cyan
Write-Host "This may take several minutes..." -ForegroundColor Gray
Write-Host ""

try {
    docker run --rm `
        -v "${reportsDir}:/zap/wrk/:rw" `
        -t ghcr.io/zaproxy/zaproxy:stable `
        zap-baseline.py `
        -t $targetUrl `
        -r zap-report.html `
        -J zap-report.json `
        -w zap-report.md `
        -z "-config api.disablekey=true -config spider.maxDuration=1" `
        -I
    
    $exitCode = $LASTEXITCODE
    
    Write-Host ""
    if ($exitCode -eq 0) {
        Write-Host "✅ ZAP scan completed with no alerts" -ForegroundColor Green
    }
    elseif ($exitCode -eq 1) {
        Write-Host "⚠️  ZAP scan completed with warnings" -ForegroundColor Yellow
    }
    elseif ($exitCode -eq 2) {
        Write-Host "❌ ZAP scan found high/medium risk issues" -ForegroundColor Red
    }
    else {
        Write-Host "❌ ZAP scan failed with exit code: $exitCode" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Reports generated:" -ForegroundColor Cyan
    Write-Host "  - reports/zap-report.html (Human-readable)" -ForegroundColor White
    Write-Host "  - reports/zap-report.json (Machine-readable)" -ForegroundColor White
    Write-Host "  - reports/zap-report.md (Markdown)" -ForegroundColor White
    
    exit $exitCode
}
catch {
    Write-Host "ERROR: Failed to run ZAP scan: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
