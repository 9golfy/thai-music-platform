# Simple PowerShell script to create test images
# This creates files with random data to simulate 1MB images

Write-Host "Creating test image files in regist/test-assets folder..." -ForegroundColor Green

# Create test-assets directory if it doesn't exist
$testAssetsPath = "regist/test-assets"
if (-not (Test-Path $testAssetsPath)) {
    New-Item -ItemType Directory -Path $testAssetsPath -Force | Out-Null
    Write-Host "Created directory: $testAssetsPath" -ForegroundColor Yellow
}

# Function to create a file with specific size
function Create-TestFile {
    param(
        [string]$fileName,
        [int]$sizeInBytes = 1048576  # 1 MB = 1024 * 1024 bytes
    )
    
    $filePath = Join-Path $testAssetsPath $fileName
    
    # Create JPEG header (minimal valid JPEG)
    $jpegHeader = [byte[]](0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00)
    $jpegFooter = [byte[]](0xFF, 0xD9)
    
    # Calculate how much random data we need
    $headerSize = $jpegHeader.Length
    $footerSize = $jpegFooter.Length
    $randomDataSize = $sizeInBytes - $headerSize - $footerSize
    
    # Generate random data
    $randomData = New-Object byte[] $randomDataSize
    $random = New-Object System.Random
    $random.NextBytes($randomData)
    
    # Combine header + random data + footer
    $fileContent = $jpegHeader + $randomData + $jpegFooter
    
    # Write to file
    [System.IO.File]::WriteAllBytes($filePath, $fileContent)
    
    # Verify file size
    $fileInfo = Get-Item $filePath
    $fileSizeKB = [math]::Round($fileInfo.Length / 1KB, 2)
    $fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
    
    Write-Host "Created: $fileName - Size: $fileSizeKB KB ($fileSizeMB MB)" -ForegroundColor Cyan
}

# Create test images (each approximately 1 MB)
Write-Host "`nGenerating test image files..." -ForegroundColor Yellow

$imageSize = 1048576  # 1 MB

Create-TestFile -fileName "manager.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher1.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher2.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher3.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher4.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher5.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher6.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher7.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher8.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher9.jpg" -sizeInBytes $imageSize
Create-TestFile -fileName "teacher10.jpg" -sizeInBytes $imageSize

Write-Host "`n✅ Test image files created successfully!" -ForegroundColor Green
Write-Host "`nTest scenarios:" -ForegroundColor Yellow
Write-Host "  - manager.jpg (1 MB) + 9 teacher images (9 MB) = 10 MB (should NOT trigger warning)" -ForegroundColor White
Write-Host "  - manager.jpg (1 MB) + 10 teacher images (10 MB) = 11 MB (SHOULD trigger warning)" -ForegroundColor White
Write-Host "`nNote: These are valid JPEG files with random data for testing purposes only." -ForegroundColor Gray
Write-Host "Images location: $testAssetsPath" -ForegroundColor Cyan
