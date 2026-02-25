#!/usr/bin/env pwsh
# Clone regist100 to regist-support with variable renaming

Write-Host "=== Cloning regist100 to regist-support ===" -ForegroundColor Cyan
Write-Host ""

# Create directories
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "app/(front)/regist-support" | Out-Null
New-Item -ItemType Directory -Force -Path "components-regist-support/forms/steps" | Out-Null
New-Item -ItemType Directory -Force -Path "components-regist-support/ui" | Out-Null
New-Item -ItemType Directory -Force -Path "app/api/register-support" | Out-Null
Write-Host "   ✅ Directories created" -ForegroundColor Green
Write-Host ""

# Function to replace text in file
function Replace-InFile {
    param(
        [string]$SourceFile,
        [string]$DestFile
    )
    
    $content = Get-Content $SourceFile -Raw
    
    # Replace all variations
    $content = $content -replace 'register100', 'registerSupport'
    $content = $content -replace 'Register100', 'RegisterSupport'
    $content = $content -replace 'REGISTER100', 'REGISTER_SUPPORT'
    $content = $content -replace 'register-100', 'register-support'
    $content = $content -replace 'regist100', 'registSupport'
    $content = $content -replace 'Regist100', 'RegistSupport'
    $content = $content -replace 'components-regist100', 'components-regist-support'
    $content = $content -replace '@/components-regist100', '@/components-regist-support'
    $content = $content -replace 'register100_submissions', 'register_support_submissions'
    $content = $content -replace '/api/register-100', '/api/register-support'
    $content = $content -replace '/api/register100', '/api/register-support'
    $content = $content -replace '/regist100', '/regist-support'
    $content = $content -replace 'โรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์', 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย'
    $content = $content -replace 'โรงเรียนดนตรีไทย 100%', 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย'
    
    Set-Content -Path $DestFile -Value $content -Encoding UTF8
}

# Clone page files
Write-Host "Cloning page files..." -ForegroundColor Yellow
Replace-InFile "app/(front)/regist100/layout.tsx" "app/(front)/regist-support/layout.tsx"
Replace-InFile "app/(front)/regist100/page.tsx" "app/(front)/regist-support/page.tsx"
Write-Host "   ✅ Page files cloned" -ForegroundColor Green
Write-Host ""

# Clone wizard
Write-Host "Cloning wizard..." -ForegroundColor Yellow
Replace-InFile "components-regist100/forms/Register100Wizard.tsx" "components-regist-support/forms/RegisterSupportWizard.tsx"
Write-Host "   ✅ Wizard cloned" -ForegroundColor Green
Write-Host ""

# Clone steps
Write-Host "Cloning steps..." -ForegroundColor Yellow
for ($i = 1; $i -le 8; $i++) {
    Replace-InFile "components-regist100/forms/steps/Step$i.tsx" "components-regist-support/forms/steps/Step$i.tsx"
    Write-Host "   ✅ Step$i cloned" -ForegroundColor Green
}
Write-Host ""

# Clone UI components
Write-Host "Cloning UI components..." -ForegroundColor Yellow
Replace-InFile "components-regist100/ui/ConsentModal.tsx" "components-regist-support/ui/ConsentModal.tsx"
Replace-InFile "components-regist100/ui/SuccessModal.tsx" "components-regist-support/ui/SuccessModal.tsx"
Write-Host "   ✅ UI components cloned" -ForegroundColor Green
Write-Host ""

# Clone API
Write-Host "Cloning API..." -ForegroundColor Yellow
Replace-InFile "app/api/register-100/route.ts" "app/api/register-support/route.ts"
Write-Host "   ✅ API cloned" -ForegroundColor Green
Write-Host ""

Write-Host "=== Clone Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created files:" -ForegroundColor Yellow
Write-Host "  📁 app/(front)/regist-support/" -ForegroundColor Gray
Write-Host "     - layout.tsx" -ForegroundColor Gray
Write-Host "     - page.tsx" -ForegroundColor Gray
Write-Host ""
Write-Host "  📁 components-regist-support/forms/" -ForegroundColor Gray
Write-Host "     - RegisterSupportWizard.tsx" -ForegroundColor Gray
Write-Host "     - steps/Step1.tsx ... Step8.tsx" -ForegroundColor Gray
Write-Host ""
Write-Host "  📁 components-regist-support/ui/" -ForegroundColor Gray
Write-Host "     - ConsentModal.tsx" -ForegroundColor Gray
Write-Host "     - SuccessModal.tsx" -ForegroundColor Gray
Write-Host ""
Write-Host "  📁 app/api/register-support/" -ForegroundColor Gray
Write-Host "     - route.ts" -ForegroundColor Gray
Write-Host ""
Write-Host "MongoDB Collection: register_support_submissions" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the form: http://localhost:3000/regist-support" -ForegroundColor White
Write-Host "2. Check MongoDB collection: register_support_submissions" -ForegroundColor White
Write-Host "3. Verify all variables start with registSupport_" -ForegroundColor White
Write-Host ""
