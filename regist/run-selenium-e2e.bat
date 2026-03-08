@echo off
echo ========================================
echo Thai Music School E2E Test (Selenium)
echo ========================================
echo.

REM Check if test images exist
if not exist "test-assets\manager.jpg" (
    echo Creating test images...
    cd test-assets
    powershell -ExecutionPolicy Bypass -File create-test-images.ps1
    cd ..
    echo.
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Run the E2E test
echo Starting E2E test...
echo.
npx ts-node --project tsconfig-e2e.json e2e/register69.e2e.ts

echo.
echo ========================================
echo Test completed!
echo ========================================
pause
