# PowerShell script to create test images for E2E testing

Write-Host "Creating test images..." -ForegroundColor Green

Add-Type -AssemblyName System.Drawing

$images = @("manager.jpg", "teacher1.jpg", "teacher2.jpg")
$colors = @([System.Drawing.Color]::Blue, [System.Drawing.Color]::Green, [System.Drawing.Color]::Red)

for ($i = 0; $i -lt $images.Length; $i++) {
    $filename = $images[$i]
    $color = $colors[$i]
    
    Write-Host "Creating $filename..." -ForegroundColor Cyan
    
    $bmp = New-Object System.Drawing.Bitmap(300, 300)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.Clear($color)
    
    # Add text
    $font = New-Object System.Drawing.Font("Arial", 20)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $text = $filename.Replace(".jpg", "")
    $graphics.DrawString($text, $font, $brush, 50, 140)
    
    # Save
    $bmp.Save($filename, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    # Cleanup
    $graphics.Dispose()
    $brush.Dispose()
    $font.Dispose()
    $bmp.Dispose()
    
    Write-Host "  Created $filename" -ForegroundColor Green
}

Write-Host ""
Write-Host "All test images created successfully!" -ForegroundColor Green
