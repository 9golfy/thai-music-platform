@echo off
echo ========================================
echo E2E Test Setup for Thai Music School
echo ========================================
echo.

echo Step 1: Creating test images...
cd test-assets
if not exist "manager.jpg" (
    powershell -ExecutionPolicy Bypass -File create-test-images.ps1
) else (
    echo Test images already exist. Skipping...
)
cd ..
echo.

echo Step 2: Installing E2E dependencies...
echo This may take a few minutes...
echo.

REM Install dependencies from package-e2e.json
call npm install --save-dev selenium-webdriver@^4.16.0 chromedriver@^120.0.1 typescript@^5.3.3 ts-node@^10.9.2 @types/node@^20.10.6 @types/selenium-webdriver@^4.1.21

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo You can now run the E2E test with:
echo   run-selenium-e2e.bat
echo.
echo Or manually with:
echo   npm run test:e2e
echo.
pause
