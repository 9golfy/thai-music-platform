#!/usr/bin/env pwsh
# Do all text replacements in regist-support files

Write-Host "=== Doing Find & Replace ===" -ForegroundColor Cyan
Write-Host ""

$files = @(
    "components-regist-support/forms/RegisterSupportWizard.tsx",
    "components-regist-support/forms/steps/Step1.tsx",
    "components-regist-support/forms/steps/Step2.tsx",
    "components-regist-support/forms/steps/Step3.tsx",
    "components-regist-support/forms/steps/Step4.tsx",
    "components-regist-support/forms/steps/Step5.tsx",
    "components-regist-support/forms/steps/Step6.tsx",
    "components-regist-support/forms/steps/Step7.tsx",
    "components-regist-support/forms/steps/Step8.tsx",
    "components-regist-support/ui/ConsentModal.tsx",
    "components-regist-support/ui/SuccessModal.tsx",
    "app/api/register-support/route.ts",
    "app/api/register-support/list/route.ts"
)

$replacements = @{
    'register100Schema' = 'registerSupportSchema'
    'Register100FormData' = 'RegisterSupportFormData'
    'Register100Wizard' = 'RegisterSupportWizard'
    'register100.schema' = 'registerSupport.schema'
    'register100.steps' = 'registerSupport.steps'
    'components-regist100' = 'components-regist-support'
    '@/components-regist100' = '@/components-regist-support'
    'register100_submissions' = 'register_support_submissions'
    'register100_consent_accepted' = 'register_support_consent_accepted'
    '/api/register100' = '/api/register-support'
    'REGISTER100' = 'REGISTER_SUPPORT'
}

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw -Encoding UTF8
        
        foreach ($key in $replacements.Keys) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
        }
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "   Done" -ForegroundColor Green
    } else {
        Write-Host "   Skipped (not found)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Replacements Complete ===" -ForegroundColor Cyan
