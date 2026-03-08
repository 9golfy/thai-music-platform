# PowerShell script to create test images for image size validation testing
# This script creates JPEG images of approximately 1 MB each

Write-Host "Creating test images in regist/test-assets folder..." -ForegroundColor Green

# Create test-assets directory if it doesn't exist
$testAssetsPath = "regist/test-assets"
if (-not (Test-Path $testAssetsPath)) {
    New-Item -ItemType Directory -Path $testAssetsPath -Force | Out-Null
    Write-Host "Created directory: $testAssetsPath" -ForegroundColor Yellow
}

# Function to create a test image with specific size
function Create-TestImage {
    param(
        [string]$fileName,
        [int]$targetSizeKB = 1024  # Default 1 MB
    )
    
    $filePath = Join-Path $testAssetsPath $fileName
    
    # Create a bitmap image using .NET
    Add-Type -AssemblyName System.Drawing
    
    # Calculate dimensions for approximately 1MB JPEG
    # JPEG compression varies, so we'll create a larger bitmap and compress it
    $width = 2000
    $height = 1500
    
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with a gradient background
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($width, $height)),
        [System.Drawing.Color]::FromArgb(100, 150, 200),
        [System.Drawing.Color]::FromArgb(200, 100, 150)
    )
    $graphics.FillRectangle($brush, 0, 0, $width, $height)
    
    # Add some text
    $font = New-Object System.Drawing.Font("Arial", 48, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $text = "TEST IMAGE`n$fileName`n~1 MB"
    $graphics.DrawString($text, $font, $textBrush, 50, 50)
    
    # Add random noise to increase file size
    $random = New-Object System.Random
    for ($i = 0; $i -lt 50000; $i++) {
        $x = $random.Next(0, $width)
        $y = $random.Next(0, $height)
        $color = [System.Drawing.Color]::FromArgb(
            $random.Next(0, 256),
            $random.Next(0, 256),
            $random.Next(0, 256)
        )
        $bitmap.SetPixel($x, $y, $color)
    }
    
    # Save as JPEG with quality setting to get close to target size
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
        Where-Object { $_.MimeType -eq 'image/jpeg' }
    
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, 
        85L  # Quality level (0-100)
    )
    
    $bitmap.Save($filePath, $encoder, $encoderParams)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $textBrush.Dispose()
    $font.Dispose()
    
    # Check file size
    $fileInfo = Get-Item $filePath
    $fileSizeKB = [math]::Round($fileInfo.Length / 1KB, 2)
    $fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
    
    Write-Host "Created: $fileName - Size: $fileSizeKB KB ($fileSizeMB MB)" -ForegroundColor Cyan
    
    return $fileInfo
}

# Create test images
Write-Host "`nGenerating test images..." -ForegroundColor Yellow
Write-Host "Note: Actual file sizes may vary slightly due to JPEG compression`n" -ForegroundColor Gray

Create-TestImage -fileName "manager.jpg"
Create-TestImage -fileName "teacher1.jpg"
Create-TestImage -fileName "teacher2.jpg"
Create-TestImage -fileName "teacher3.jpg"
Create-TestImage -fileName "teacher4.jpg"
Create-TestImage -fileName "teacher5.jpg"
Create-TestImage -fileName "teacher6.jpg"
Create-TestImage -fileName "teacher7.jpg"
Create-TestImage -fileName "teacher8.jpg"
Create-TestImage -fileName "teacher9.jpg"
Create-TestImage -fileName "teacher10.jpg"

Write-Host "`n✅ Test images created successfully!" -ForegroundColor Green
Write-Host "`nTest scenarios:" -ForegroundColor Yellow
Write-Host "  - Use manager.jpg + 9 teacher images = ~10 MB (should NOT trigger warning)" -ForegroundColor White
Write-Host "  - Use manager.jpg + 10 teacher images = ~11 MB (SHOULD trigger warning)" -ForegroundColor White
Write-Host "`nImages location: $testAssetsPath" -ForegroundColor Cyan
