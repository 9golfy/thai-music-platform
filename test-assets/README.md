# Test Assets

This folder contains test files for E2E testing.

## Required Files

- `manager.jpg` - Manager photo (max 1MB)
- `teacher1.jpg` - Teacher 1 photo (max 1MB)
- `teacher2.jpg` - Teacher 2 photo (optional, max 1MB)

## Creating Test Images

You can create small test images using any of these methods:

### Method 1: Using Paint (Windows)
1. Open Paint
2. Create a small image (e.g., 100x100 pixels)
3. Add some text or color
4. Save as JPG with the required filename

### Method 2: Using PowerShell
```powershell
# Create a simple 1x1 pixel image (very small)
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(100, 100)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.Clear([System.Drawing.Color]::Blue)
$bmp.Save("manager.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Save("teacher1.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Save("teacher2.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graphics.Dispose()
$bmp.Dispose()
```

### Method 3: Download from placeholder service
```powershell
# Download placeholder images
Invoke-WebRequest -Uri "https://via.placeholder.com/300x300.jpg" -OutFile "manager.jpg"
Invoke-WebRequest -Uri "https://via.placeholder.com/300x300.jpg" -OutFile "teacher1.jpg"
Invoke-WebRequest -Uri "https://via.placeholder.com/300x300.jpg" -OutFile "teacher2.jpg"
```

## File Requirements

- Format: JPG, JPEG, or PNG
- Max size: 1MB per file
- Recommended dimensions: 300x300 pixels or larger
