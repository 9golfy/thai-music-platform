# Create valid test JPEG images

Write-Host "Creating valid test images..." -ForegroundColor Green

Add-Type -AssemblyName System.Drawing

$imageNames = @(
    "manager",
    "teacher1", "teacher2", "teacher3", "teacher4", "teacher5",
    "teacher6", "teacher7", "teacher8", "teacher9", "teacher10"
)

$colors = @(
    [System.Drawing.Color]::FromArgb(255, 70, 130, 180),  # Steel Blue
    [System.Drawing.Color]::FromArgb(255, 60, 179, 113),  # Medium Sea Green
    [System.Drawing.Color]::FromArgb(255, 255, 140, 0),   # Dark Orange
    [System.Drawing.Color]::FromArgb(255, 147, 112, 219), # Medium Purple
    [System.Drawing.Color]::FromArgb(255, 220, 20, 60),   # Crimson
    [System.Drawing.Color]::FromArgb(255, 0, 191, 255),   # Deep Sky Blue
    [System.Drawing.Color]::FromArgb(255, 255, 215, 0),   # Gold
    [System.Drawing.Color]::FromArgb(255, 50, 205, 50),   # Lime Green
    [System.Drawing.Color]::FromArgb(255, 255, 105, 180), # Hot Pink
    [System.Drawing.Color]::FromArgb(255, 138, 43, 226),  # Blue Violet
    [System.Drawing.Color]::FromArgb(255, 255, 69, 0)     # Orange Red
)

foreach ($i in 0..($imageNames.Length - 1)) {
    $name = $imageNames[$i]
    $filename = "$name.jpg"
    $color = $colors[$i]
    
    Write-Host "Creating $filename..." -ForegroundColor Cyan
    
    # Create bitmap
    $bmp = New-Object System.Drawing.Bitmap(800, 600)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Set high quality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Fill background
    $graphics.Clear($color)
    
    # Add white rectangle
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.FillRectangle($whiteBrush, 100, 200, 600, 200)
    
    # Add text
    $font = New-Object System.Drawing.Font("Arial", 48, [System.Drawing.FontStyle]::Bold)
    $blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $text = $name.ToUpper()
    
    # Center text
    $textSize = $graphics.MeasureString($text, $font)
    $x = (800 - $textSize.Width) / 2
    $y = (600 - $textSize.Height) / 2
    
    $graphics.DrawString($text, $font, $blackBrush, $x, $y)
    
    # Save with proper JPEG encoder
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)
    
    $bmp.Save($filename, $jpegCodec, $encoderParams)
    
    # Cleanup
    $graphics.Dispose()
    $whiteBrush.Dispose()
    $blackBrush.Dispose()
    $font.Dispose()
    $bmp.Dispose()
    $encoderParams.Dispose()
    
    $fileInfo = Get-Item $filename
    Write-Host "  Created $filename ($([math]::Round($fileInfo.Length / 1KB, 2)) KB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "All test images created successfully!" -ForegroundColor Green
