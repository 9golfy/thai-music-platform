# Guide: Creating Test Images for Image Size Validation

This guide explains how to create test images for testing the 10 MB image size warning modal.

## Quick Start

Run one of the PowerShell scripts to generate test images:

### Option 1: Simple Method (Recommended)
```powershell
.\create-test-images-simple.ps1
```

This creates valid JPEG files with random data, each exactly 1 MB in size.

### Option 2: Visual Method (Requires .NET)
```powershell
.\create-test-images.ps1
```

This creates actual visual JPEG images with gradients and text, approximately 1 MB each.

## What Gets Created

Both scripts create the following files in `regist/test-assets/`:
- `manager.jpg` (1 MB) - For Step 2 (Manager image)
- `teacher1.jpg` to `teacher10.jpg` (1 MB each) - For Step 4 (Teacher images)

## Testing Scenarios

### Scenario 1: No Warning (10 MB total)
Upload:
- 1 manager image (1 MB)
- 9 teacher images (9 MB)
- **Total: 10 MB** ✅ No warning should appear

### Scenario 2: Warning Triggered (11 MB total)
Upload:
- 1 manager image (1 MB)
- 10 teacher images (10 MB)
- **Total: 11 MB** ⚠️ Warning modal should appear

## Manual Testing Steps

1. **Run the script:**
   ```powershell
   .\create-test-images-simple.ps1
   ```

2. **Start the development server:**
   ```powershell
   npm run dev
   ```

3. **Navigate to the form:**
   - For regist100: http://localhost:3000/regist100
   - For regist-support: http://localhost:3000/regist-support

4. **Test Step 2:**
   - Upload `manager.jpg` as the manager image
   - Proceed to Step 4

5. **Test Step 4 - No Warning:**
   - Upload 9 teacher images (teacher1.jpg to teacher9.jpg)
   - Verify NO warning modal appears

6. **Test Step 4 - Warning Appears:**
   - Upload the 10th teacher image (teacher10.jpg)
   - **Expected:** Warning modal should appear immediately
   - Modal message: "ขนาดภาพรวมทั้งหมดมากกว่า 10 MB (11.00 MB) กรุณาลดจำนวนหรือน้ำหนักภาพ"

7. **Test Modal Dismissal:**
   - Click "รับทราบ" button to close modal
   - Or click outside the modal (backdrop) to close

## Troubleshooting

### Script Execution Policy Error
If you get an error about execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Images Not Created
Check if the `regist/test-assets` folder exists:
```powershell
Test-Path regist/test-assets
```

If it doesn't exist, create it manually:
```powershell
New-Item -ItemType Directory -Path regist/test-assets -Force
```

### File Size Verification
To check the actual file sizes:
```powershell
Get-ChildItem regist/test-assets/*.jpg | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

## Cleanup

To remove all test images:
```powershell
Remove-Item regist/test-assets/*.jpg -Force
```

## Notes

- Each image is exactly 1 MB (1,048,576 bytes)
- The warning threshold is 10 MB (10,485,760 bytes)
- The modal checks total size in real-time using `useEffect`
- Images are valid JPEG files that can be uploaded to the form
- These are for testing purposes only and contain random data
