#!/bin/bash
# Security Testing Suite - Master Runner (Bash)
# Runs all security scans and generates summary report

set -e

CONFIG_FILE="${1:-config/targets.json}"
START_TIME=$(date +%s)

echo "========================================"
echo "Security Testing Suite - Full Scan"
echo "========================================"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "ERROR: Config file not found: $CONFIG_FILE"
    echo "Please copy config/targets.example.json to config/targets.json and configure it."
    exit 1
fi

# Create reports directory
mkdir -p reports

# Initialize results
TOTAL_SCANS=0
PASSED_SCANS=0
FAILED_SCANS=0

# Function to run scan and track results
run_scan() {
    local name="$1"
    local script="$2"
    
    echo ""
    echo "▶️  Running $name..."
    echo "----------------------------------------"
    
    SCAN_START=$(date +%s)
    
    if bash "scripts/$script" "$CONFIG_FILE"; then
        SCAN_END=$(date +%s)
        DURATION=$((SCAN_END - SCAN_START))
        echo "✅ $name completed successfully (${DURATION}s)"
        ((PASSED_SCANS++))
    else
        SCAN_END=$(date +%s)
        DURATION=$((SCAN_END - SCAN_START))
        echo "❌ $name failed (${DURATION}s)"
        ((FAILED_SCANS++))
    fi
    
    ((TOTAL_SCANS++))
}

# Run all scans
run_scan "OWASP ZAP Baseline" "zap-baseline.sh"
run_scan "TLS/SSL Configuration" "tls-scan.sh"
run_scan "Security Headers" "headers-check.sh"
run_scan "CORS Configuration" "cors-check.sh"
run_scan "JavaScript Dependencies" "js-deps-scan.sh"

# Calculate total duration
END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

# Generate summary JSON
cat > reports/summary.json <<EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "summary": {
    "total": $TOTAL_SCANS,
    "passed": $PASSED_SCANS,
    "failed": $FAILED_SCANS,
    "duration": $TOTAL_DURATION
  }
}
EOF

# Print summary
echo ""
echo "========================================"
echo "Security Scan Summary"
echo "========================================"
echo ""
echo "Total Scans:    $TOTAL_SCANS"
echo "Passed:         $PASSED_SCANS"
echo "Failed:         $FAILED_SCANS"
echo "Duration:       ${TOTAL_DURATION}s"
echo ""
echo "Reports saved to: reports/"
echo ""

# Exit with appropriate code
if [ $FAILED_SCANS -gt 0 ]; then
    echo "⚠️  Some scans failed. Please review the reports."
    exit 1
else
    echo "✅ All scans completed successfully!"
    exit 0
fi
