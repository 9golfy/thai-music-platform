@echo off
echo ========================================
echo Register 69 E2E Test Runner
echo ========================================
echo.

echo Checking if Playwright is installed...
call npx playwright --version >nul 2>&1
if errorlevel 1 (
    echo Playwright not found. Installing...
    call npm install
    call npx playwright install
) else (
    echo Playwright is installed.
)

echo.
echo ========================================
echo Running E2E Tests
echo ========================================
echo.

call npm run test:e2e

echo.
echo ========================================
echo Tests Complete!
echo ========================================
echo.
echo To view the report, run:
echo   npx playwright show-report
echo.
pause
