@echo off
echo ========================================
echo Thai Music School E2E Test (Simple)
echo ========================================
echo.
echo Starting simplified E2E test...
echo.
npm exec ts-node --project tsconfig-e2e.json e2e/register69-simple.e2e.ts
echo.
echo Test completed!
pause
