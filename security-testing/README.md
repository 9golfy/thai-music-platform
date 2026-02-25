# Security Testing Suite

## Overview

This security testing suite provides automated baseline security scanning aligned with OWASP Top 10, WSTG, and ASVS standards. It is designed to detect common misconfigurations and vulnerabilities early in the development cycle.

## Prerequisites

### Required Software
- **Docker Desktop** (for containerized scanning tools)
- **PowerShell 7+** (Windows)
- **Bash** (Linux/macOS/WSL)
- **Node.js 18+** (for JS dependency scanning)
- **Git** (for version control)

### Optional
- **GitHub Actions** (for CI/CD integration)
- **jq** (for JSON parsing in bash scripts)

## Quick Start

### 1. Configure Targets

Copy the example configuration:
```bash
cp config/targets.example.json config/targets.json
```

Edit `config/targets.json` with your actual URLs:
```json
{
  "baseUrl": "https://your-app.example.com",
  "publicPages": [
    "/",
    "/about",
    "/contact"
  ],
  "authenticatedPages": [
    "/dashboard",
    "/profile"
  ],
  "apiEndpoints": [
    "/api/v1/users",
    "/api/v1/data"
  ]
}
```

### 2. Set Environment Variables (if authentication needed)

**Windows (PowerShell):**
```powershell
$env:TEST_USERNAME = "your-username"
$env:TEST_PASSWORD = "your-password"
$env:API_KEY = "your-api-key"
```

**Linux/macOS (Bash):**
```bash
export TEST_USERNAME="your-username"
export TEST_PASSWORD="your-password"
export API_KEY="your-api-key"
```

### 3. Run All Security Scans

**Windows:**
```powershell
.\scripts\run-all.ps1
```

**Linux/macOS:**
```bash
./scripts/run-all.sh
```

## Individual Scan Commands

### OWASP ZAP Baseline Scan
Performs automated security scanning for common vulnerabilities.

**Windows:**
```powershell
.\scripts\zap-baseline.ps1
```

**Linux/macOS:**
```bash
./scripts/zap-baseline.sh
```

**Output:** `reports/zap-report.html`, `reports/zap-report.json`

### TLS/SSL Configuration Scan
Tests SSL/TLS configuration for weak ciphers, protocols, and vulnerabilities.

**Windows:**
```powershell
.\scripts\tls-scan.ps1
```

**Linux/macOS:**
```bash
./scripts/tls-scan.sh
```

**Output:** `reports/tls-scan.log`, `reports/tls-scan.json`

### Security Headers Check
Validates presence and configuration of security headers.

**Windows:**
```powershell
.\scripts\headers-check.ps1
```

**Linux/macOS:**
```bash
./scripts/headers-check.sh
```

**Output:** `reports/headers-check.json`

**Checks:**
- Content-Security-Policy (CSP)
- X-Frame-Options / frame-ancestors
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Cookie flags (Secure, HttpOnly, SameSite)

### CORS Configuration Check
Tests for overly permissive CORS policies.

**Windows:**
```powershell
.\scripts\cors-check.ps1
```

**Linux/macOS:**
```bash
./scripts/cors-check.sh
```

**Output:** `reports/cors-check.json`

### JavaScript Dependencies Scan
Scans for vulnerable JavaScript libraries.

**Windows:**
```powershell
.\scripts\js-deps-scan.ps1
```

**Linux/macOS:**
```bash
./scripts/js-deps-scan.sh
```

**Output:** `reports/js-deps-audit.json`, `reports/retire-js.json`

## Understanding Results

### PASS/FAIL Criteria

**PASS:** All security checks passed, no vulnerabilities detected
**WARN:** Minor issues detected, should be reviewed
**FAIL:** Critical vulnerabilities detected, must be fixed

### Report Locations

All reports are generated in the `reports/` directory:
- `zap-report.html` - Human-readable ZAP scan results
- `zap-report.json` - Machine-readable ZAP results
- `tls-scan.log` - Detailed TLS configuration
- `headers-check.json` - Security headers validation
- `cors-check.json` - CORS policy analysis
- `js-deps-audit.json` - NPM audit results
- `summary.json` - Overall test summary

### Interpreting Severity Levels

- **CRITICAL:** Immediate action required (e.g., SQL injection, XSS)
- **HIGH:** Should be fixed before production (e.g., missing HSTS, weak CORS)
- **MEDIUM:** Should be addressed (e.g., missing CSP, cookie flags)
- **LOW:** Best practice improvements (e.g., server header disclosure)
- **INFO:** Informational findings

## Safety Notes

### Rate Limiting
All scripts include rate limiting to avoid overwhelming the target:
- ZAP: Configured with `-z "-config api.disablekey=true -config spider.maxDuration=1"`
- Custom scripts: 1-second delay between requests

### Scope Control
- Only scan URLs defined in `config/targets.json`
- Never scan production without approval
- Use staging/test environments when possible

### Non-Destructive Testing
- No exploit payloads are used
- No data modification attempts
- Read-only operations only
- Safe for CI/CD pipelines

## CI/CD Integration

### GitHub Actions

Copy the workflow file:
```bash
cp ci/github-actions-security.yml .github/workflows/security.yml
```

The workflow runs on:
- Pull requests to main/master
- Scheduled daily scans
- Manual trigger

### GitLab CI

Add to `.gitlab-ci.yml`:
```yaml
security-scan:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - chmod +x scripts/run-all.sh
    - ./scripts/run-all.sh
  artifacts:
    paths:
      - reports/
    expire_in: 30 days
```

## Troubleshooting

### Docker Issues

**Problem:** Docker daemon not running
**Solution:** Start Docker Desktop

**Problem:** Permission denied
**Solution (Linux):** Add user to docker group
```bash
sudo usermod -aG docker $USER
```

### Script Execution Issues

**Problem:** Script cannot be loaded (PowerShell)
**Solution:** Set execution policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Problem:** Permission denied (Bash)
**Solution:** Make scripts executable
```bash
chmod +x scripts/*.sh
```

### Network Issues

**Problem:** Cannot reach target
**Solution:** 
- Check VPN connection
- Verify target URL in `config/targets.json`
- Check firewall settings

## Test Case Documentation

Detailed test cases are documented in:
- `testcases/security_test_cases.md` - Complete test case specifications
- `testcases/owasp-mapping.md` - OWASP framework mappings
- `testcases/risk-based-priorities.md` - Risk-based remediation plan

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review test case documentation
3. Check script logs in `reports/`
4. Contact the security team

## License

Internal use only. Do not distribute outside the organization.
