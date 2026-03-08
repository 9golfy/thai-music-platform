# Security Test Cases

## Overview
This document contains comprehensive security test cases aligned with OWASP Top 10, WSTG, and ASVS standards.

---

## Test Cases

| Test Case ID | Title | OWASP Top 10 | WSTG Reference | ASVS Control | Risk/Impact | Preconditions | Steps | Expected Result | Evidence to Capture | Automation Coverage |
|--------------|-------|--------------|----------------|--------------|-------------|---------------|-------|-----------------|---------------------|---------------------|
| SEC-001 | Open Redirect Vulnerability | A01:2021 - Broken Access Control | WSTG-CLNT-04 | V5.1.5 | HIGH - Phishing attacks, credential theft | Target URL with redirect parameter | 1. Identify redirect parameters (url, redirect, next, return)<br>2. Test with external URL: `?redirect=https://evil.com`<br>3. Test with protocol-relative URL: `?redirect=//evil.com`<br>4. Test with JavaScript: `?redirect=javascript:alert(1)` | Application should validate redirect destinations and only allow whitelisted internal URLs | Screenshots of redirect behavior, HTTP response headers, final destination URL | Partial - ZAP baseline |
| SEC-002 | Missing Content-Security-Policy Header | A05:2021 - Security Misconfiguration | WSTG-CONF-12 | V14.4.3 | MEDIUM - XSS attacks, data injection | Public pages accessible | 1. Send GET request to target URL<br>2. Inspect response headers<br>3. Check for `Content-Security-Policy` header | CSP header present with restrictive policy (no `unsafe-inline`, no `unsafe-eval`) | HTTP response headers, CSP policy content | Yes - headers-check.ps1 |
| SEC-003 | Missing X-Frame-Options Header | A05:2021 - Security Misconfiguration | WSTG-CLNT-09 | V14.4.4 | MEDIUM - Clickjacking attacks | Public pages accessible | 1. Send GET request to target URL<br>2. Inspect response headers<br>3. Check for `X-Frame-Options` or CSP `frame-ancestors` | Header present with value `DENY` or `SAMEORIGIN`, or CSP with `frame-ancestors 'none'` or `'self'` | HTTP response headers | Yes - headers-check.ps1 |
| SEC-004 | Missing HSTS Header | A05:2021 - Security Misconfiguration | WSTG-CRYP-01 | V9.2.1 | MEDIUM - Man-in-the-middle attacks, SSL stripping | HTTPS pages accessible | 1. Send GET request to HTTPS URL<br>2. Inspect response headers<br>3. Check for `Strict-Transport-Security` header | Header present with `max-age` >= 31536000 (1 year), includes `includeSubDomains` | HTTP response headers, HSTS value | Yes - headers-check.ps1 |
| SEC-005 | Missing X-Content-Type-Options Header | A05:2021 - Security Misconfiguration | WSTG-CONF-12 | V14.4.5 | LOW - MIME sniffing attacks | Public pages accessible | 1. Send GET request to target URL<br>2. Inspect response headers<br>3. Check for `X-Content-Type-Options` header | Header present with value `nosniff` | HTTP response headers | Yes - headers-check.ps1 |
| SEC-006 | Cookie Missing Secure Flag | A05:2021 - Security Misconfiguration | WSTG-SESS-02 | V3.4.1 | HIGH - Session hijacking over insecure connections | Application sets cookies | 1. Access application over HTTPS<br>2. Inspect Set-Cookie headers<br>3. Check for `Secure` flag on all cookies | All cookies have `Secure` flag set | Set-Cookie headers, cookie attributes | Yes - headers-check.ps1 |
| SEC-007 | Cookie Missing HttpOnly Flag | A05:2021 - Security Misconfiguration | WSTG-SESS-02 | V3.4.2 | HIGH - XSS-based session theft | Application sets session cookies | 1. Access application<br>2. Inspect Set-Cookie headers<br>3. Check for `HttpOnly` flag on session cookies | Session cookies have `HttpOnly` flag set | Set-Cookie headers, cookie attributes | Yes - headers-check.ps1 |
| SEC-008 | Cookie Missing SameSite Attribute | A05:2021 - Security Misconfiguration | WSTG-SESS-02 | V3.4.3 | MEDIUM - CSRF attacks | Application sets cookies | 1. Access application<br>2. Inspect Set-Cookie headers<br>3. Check for `SameSite` attribute | Cookies have `SameSite=Strict` or `SameSite=Lax` | Set-Cookie headers, cookie attributes | Yes - headers-check.ps1 |
| SEC-009 | Overly Permissive CORS Policy | A05:2021 - Security Misconfiguration | WSTG-CLNT-07 | V14.5.3 | HIGH - Cross-origin data theft | API endpoints accessible | 1. Send request with `Origin: https://evil.com`<br>2. Check `Access-Control-Allow-Origin` header<br>3. Check `Access-Control-Allow-Credentials` header | Should not return `Access-Control-Allow-Origin: *` with credentials, should not reflect arbitrary origins | HTTP response headers, CORS headers | Yes - cors-check.ps1 |
| SEC-010 | Application Error Disclosure | A05:2021 - Security Misconfiguration | WSTG-ERRH-01 | V7.4.1 | MEDIUM - Information disclosure, attack surface mapping | Application with error conditions | 1. Trigger application errors (invalid input, missing parameters)<br>2. Inspect error responses<br>3. Check for stack traces, file paths, database errors | Generic error messages only, no stack traces or sensitive information | Error response body, screenshots | Partial - ZAP baseline |
| SEC-011 | Debug Error Messages Enabled | A05:2021 - Security Misconfiguration | WSTG-ERRH-01 | V7.4.2 | MEDIUM - Information disclosure | Application in production | 1. Access application<br>2. Trigger errors<br>3. Check for debug information in responses | No debug information, framework details, or verbose errors | Response body, error messages | Partial - ZAP baseline |
| SEC-012 | Timestamp Disclosure in Responses | A05:2021 - Security Misconfiguration | WSTG-INFO-02 | V14.1.3 | LOW - Information disclosure | Application responses | 1. Send requests to various endpoints<br>2. Inspect response headers and body<br>3. Look for timestamp patterns | Timestamps should not reveal server time or internal processing details | Response headers, response body | No - Manual review |
| SEC-013 | Vulnerable JavaScript Libraries | A06:2021 - Vulnerable and Outdated Components | WSTG-CLNT-06 | V14.2.1 | HIGH - Known vulnerabilities exploitation | Application uses JavaScript libraries | 1. Identify JavaScript libraries and versions<br>2. Check against vulnerability databases<br>3. Use retire.js or npm audit | No known vulnerable libraries in use | Library versions, CVE references | Yes - js-deps-scan.ps1 |
| SEC-014 | Mixed Content on HTTPS Pages | A05:2021 - Security Misconfiguration | WSTG-CRYP-03 | V9.1.3 | MEDIUM - Man-in-the-middle attacks | HTTPS pages with external resources | 1. Access HTTPS pages<br>2. Inspect loaded resources<br>3. Check for http:// URLs | All resources loaded over HTTPS | Browser console warnings, resource URLs | Partial - Manual review |
| SEC-015 | Weak TLS Configuration | A02:2021 - Cryptographic Failures | WSTG-CRYP-01 | V9.1.1 | HIGH - Man-in-the-middle attacks, data interception | HTTPS endpoint accessible | 1. Run TLS scan using testssl.sh<br>2. Check supported protocols<br>3. Check cipher suites | TLS 1.2+ only, strong cipher suites, no SSLv3/TLS1.0/TLS1.1 | TLS scan report, supported protocols and ciphers | Yes - tls-scan.ps1 |
| SEC-016 | TLS Compression Enabled (BREACH) | A02:2021 - Cryptographic Failures | WSTG-CRYP-01 | V9.1.2 | MEDIUM - BREACH attack | HTTPS endpoint with compression | 1. Check TLS compression support<br>2. Check HTTP compression (gzip) on sensitive pages | TLS compression disabled, HTTP compression disabled on pages with secrets | TLS scan report, compression headers | Yes - tls-scan.ps1 |
| SEC-017 | Weak TLS Cipher Suites (CBC) | A02:2021 - Cryptographic Failures | WSTG-CRYP-01 | V9.1.3 | MEDIUM - Lucky13, BEAST attacks | HTTPS endpoint | 1. Run TLS scan<br>2. Check for CBC cipher suites<br>3. Verify GCM/ChaCha20 ciphers preferred | No CBC ciphers, prefer AEAD ciphers (GCM, ChaCha20) | TLS scan report, cipher suite list | Yes - tls-scan.ps1 |
| SEC-018 | Server Information Disclosure | A05:2021 - Security Misconfiguration | WSTG-INFO-02 | V14.1.1 | LOW - Information disclosure, fingerprinting | Public pages accessible | 1. Send GET request<br>2. Check `Server` header<br>3. Check `X-Powered-By` header | Headers should be removed or generic | HTTP response headers | Yes - headers-check.ps1 |
| SEC-019 | Large Redirect Response Body | A05:2021 - Security Misconfiguration | WSTG-INFO-02 | V14.1.4 | LOW - Information disclosure | Redirect responses | 1. Trigger redirects<br>2. Inspect response body size<br>3. Check for sensitive data in body | Redirect responses should have minimal/empty body | Response body, response size | No - Manual review |
| SEC-020 | SQL Injection | A03:2021 - Injection | WSTG-INPV-05 | V5.3.4 | CRITICAL - Database compromise, data theft | Input fields, URL parameters | 1. Test with SQL payloads: `' OR '1'='1`<br>2. Test with time-based payloads<br>3. Check for database errors | Input properly sanitized, no SQL errors, parameterized queries used | Error messages, response behavior | Partial - ZAP baseline |
| SEC-021 | Cross-Site Scripting (XSS) | A03:2021 - Injection | WSTG-INPV-01 | V5.3.3 | HIGH - Session theft, defacement | Input fields, URL parameters | 1. Test with XSS payloads: `<script>alert(1)</script>`<br>2. Test with event handlers: `<img src=x onerror=alert(1)>`<br>3. Test in various contexts | Input properly encoded, CSP blocks inline scripts | Response body, CSP violations | Partial - ZAP baseline |
| SEC-022 | Cross-Site Request Forgery (CSRF) | A01:2021 - Broken Access Control | WSTG-SESS-05 | V4.2.2 | HIGH - Unauthorized actions | State-changing operations | 1. Identify state-changing requests<br>2. Remove CSRF token<br>3. Submit from different origin | Requests rejected without valid CSRF token, SameSite cookies enforced | Request/response, error messages | No - Manual testing |
| SEC-023 | Insecure Direct Object Reference | A01:2021 - Broken Access Control | WSTG-ATHZ-04 | V4.1.2 | HIGH - Unauthorized data access | Authenticated user access | 1. Access resource with ID parameter<br>2. Change ID to another user's resource<br>3. Attempt access | Access denied, proper authorization checks | Response status, error messages | No - Manual testing |
| SEC-024 | Missing Authentication | A07:2021 - Identification and Authentication Failures | WSTG-ATHN-01 | V2.1.1 | CRITICAL - Unauthorized access | Protected resources | 1. Access protected URLs without authentication<br>2. Remove session cookies<br>3. Attempt access | Redirect to login, 401/403 status | Response status, redirect location | Partial - ZAP baseline |
| SEC-025 | Weak Password Policy | A07:2021 - Identification and Authentication Failures | WSTG-ATHN-07 | V2.1.7 | MEDIUM - Brute force attacks | User registration/password change | 1. Attempt weak passwords<br>2. Test password complexity requirements<br>3. Check for password history | Strong password requirements enforced (length, complexity, history) | Error messages, policy documentation | No - Manual testing |
| SEC-026 | Session Fixation | A07:2021 - Identification and Authentication Failures | WSTG-SESS-03 | V3.2.1 | HIGH - Session hijacking | Login functionality | 1. Obtain session ID before login<br>2. Login with credentials<br>3. Check if session ID changed | New session ID issued after authentication | Session cookies before/after login | No - Manual testing |
| SEC-027 | Insufficient Session Timeout | A07:2021 - Identification and Authentication Failures | WSTG-SESS-07 | V3.3.1 | MEDIUM - Session hijacking | Authenticated session | 1. Login to application<br>2. Wait for extended period<br>3. Attempt to use session | Session expires after reasonable timeout (15-30 minutes) | Session behavior, timeout duration | No - Manual testing |
| SEC-028 | XML External Entity (XXE) | A03:2021 - Injection | WSTG-INPV-07 | V5.5.2 | HIGH - File disclosure, SSRF | XML input processing | 1. Submit XML with external entity<br>2. Test with file:// protocol<br>3. Test with http:// protocol | XML parser configured to disable external entities | Response body, error messages | Partial - ZAP baseline |
| SEC-029 | Server-Side Request Forgery (SSRF) | A10:2021 - Server-Side Request Forgery | WSTG-INPV-19 | V5.2.6 | HIGH - Internal network access | URL input parameters | 1. Test with internal IPs: `http://127.0.0.1`<br>2. Test with cloud metadata: `http://169.254.169.254`<br>3. Test with file:// protocol | URL validation, whitelist of allowed domains | Response body, request behavior | No - Manual testing |
| SEC-030 | Insecure File Upload | A04:2021 - Insecure Design | WSTG-BUSL-08 | V12.1.1 | HIGH - Remote code execution | File upload functionality | 1. Upload executable files (.php, .jsp, .aspx)<br>2. Upload files with double extensions<br>3. Test file type validation | File type validation, content inspection, safe storage location | Upload response, file location | No - Manual testing |

---

## Test Execution Priority

### Critical (Must Fix Immediately)
- SEC-020: SQL Injection
- SEC-024: Missing Authentication
- SEC-030: Insecure File Upload

### High (Fix Before Production)
- SEC-001: Open Redirect Vulnerability
- SEC-006: Cookie Missing Secure Flag
- SEC-007: Cookie Missing HttpOnly Flag
- SEC-009: Overly Permissive CORS Policy
- SEC-013: Vulnerable JavaScript Libraries
- SEC-015: Weak TLS Configuration
- SEC-021: Cross-Site Scripting (XSS)
- SEC-022: Cross-Site Request Forgery (CSRF)
- SEC-023: Insecure Direct Object Reference
- SEC-026: Session Fixation
- SEC-028: XML External Entity (XXE)
- SEC-029: Server-Side Request Forgery (SSRF)

### Medium (Address Soon)
- SEC-002: Missing Content-Security-Policy Header
- SEC-003: Missing X-Frame-Options Header
- SEC-004: Missing HSTS Header
- SEC-008: Cookie Missing SameSite Attribute
- SEC-010: Application Error Disclosure
- SEC-011: Debug Error Messages Enabled
- SEC-014: Mixed Content on HTTPS Pages
- SEC-016: TLS Compression Enabled (BREACH)
- SEC-017: Weak TLS Cipher Suites (CBC)
- SEC-025: Weak Password Policy
- SEC-027: Insufficient Session Timeout

### Low (Best Practice)
- SEC-005: Missing X-Content-Type-Options Header
- SEC-012: Timestamp Disclosure in Responses
- SEC-018: Server Information Disclosure
- SEC-019: Large Redirect Response Body

---

## Notes

1. All test cases should be executed in a non-production environment first
2. Obtain proper authorization before testing
3. Document all findings with evidence
4. Follow responsible disclosure practices
5. Automated tools provide baseline coverage; manual testing required for complete assessment
