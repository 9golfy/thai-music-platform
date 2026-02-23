@echo off
echo ========================================
echo Running Selenium Test for Register 100
echo ========================================
echo.

REM Check if server is running
echo Checking if server is running on http://localhost:3000...
curl -s http://localhost:3000 > nul
if errorlevel 1 (
    echo ERROR: Server is not running!
    echo Please start the server first with: docker-compose up
    pause
    exit /b 1
)

echo Server is running!
echo.
echo Starting Selenium test...
echo.

npx ts-node tests/register-100-selenium.test.ts

echo.
echo ========================================
echo Test completed!
echo ========================================
pause
