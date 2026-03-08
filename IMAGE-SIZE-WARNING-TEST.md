# Image Size Warning Modal - Test Documentation

## Overview
Test case สำหรับทดสอบ modal แจ้งเตือนเมื่อขนาดรูปภาพรวมเกิน 10 MB

## Test Scenario

### Setup
- Manager image: 1 MB (Step 2)
- Teacher images: 10 images × 1 MB = 10 MB (Step 4)
- **Total: 11 MB** (เกินขนาดที่กำหนด 10 MB)

### Expected Behavior

1. **Upload Manager Image (Step 2)**
   - อัพโหลด `manager.jpg` (1 MB)
   - ไม่มี warning (ยังไม่เกิน 10 MB)

2. **Upload Teacher Images (Step 4)**
   - อัพโหลดครู 9 คน (teacher1-9)
   - Total: 1 + 9 = 10 MB
   - ไม่มี warning (พอดี 10 MB)

3. **Upload 10th Teacher**
   - อัพโหลดครูคนที่ 10 (teacher10)
   - Total: 1 + 10 = 11 MB
   - **⚠️ Warning modal ต้องแสดงขึ้นทันที**

4. **Modal Content**
   - Title: "ขนาดภาพเกินกำหนด"
   - Message: "ขนาดภาพรวมทั้งหมดมากกว่า 10 MB (11.00 MB) กรุณาลดจำนวนหรือน้ำหนักภาพ"
   - Button: "รับทราบ"
   - Warning icon (red)

5. **User Acknowledgment**
   - User **ต้อง** กดปุ่ม "รับทราบ" เพื่อปิด modal
   - **ไม่สามารถ** ปิดโดยคลิกที่ backdrop ได้
   - Modal จะปิดหลังจากกดปุ่มเท่านั้น

6. **User Fixes the Issue**
   - User ลบครูคนที่ 10 ออก
   - Total: 1 + 9 = 10 MB
   - Modal **ไม่แสดง** อีก (ขนาดอยู่ในขอบเขต)

## How to Run Test

### Prerequisites
1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Create test images (if not exists):**
   ```powershell
   .\create-test-images-simple.ps1
   ```

### Run Test
```powershell
.\run-image-size-test.ps1
```

Or manually:
```bash
cd regist
npx playwright test tests/image-size-warning.spec.ts --headed
```

## Test Coverage

### Forms Tested
- ✅ `/regist100` - โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์
- ✅ `/regist-support` - โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย

### Test Cases
1. ✅ Modal appears when total size > 10 MB
2. ✅ Modal shows correct content (title, message, button)
3. ✅ Modal shows correct total size (11.00 MB)
4. ✅ User must click button to close (cannot click backdrop)
5. ✅ Modal closes after clicking "รับทราบ"
6. ✅ User can remove images to reduce size
7. ✅ Modal does not appear when size ≤ 10 MB

## Implementation Details

### Logic
```typescript
// Calculate total size
const totalSize = mgtImageSize + sum(teacherImageSizes)

// Show warning if exceeds 10 MB
if (totalSize > 10 * 1024 * 1024) {
  showWarningModal = true
}
```

### Modal Behavior
- **Trigger:** Automatically when total size > 10 MB
- **Close:** Only by clicking "รับทราบ" button
- **Backdrop:** Cannot close by clicking outside
- **Re-check:** Automatically recalculates when images change

### Files Modified
- `components-regist100/forms/steps/Step4.tsx`
- `components-regist-support/forms/steps/Step4.tsx`
- `components-regist100/ui/ImageSizeWarningModal.tsx`
- `components-regist-support/ui/ImageSizeWarningModal.tsx`
- `components-regist100/forms/Register100Wizard.tsx`
- `components-regist-support/forms/RegisterSupportWizard.tsx`

## Screenshots

Test จะสร้าง screenshots อัตโนมัติ:
- `regist/test-results/image-size-warning-modal.png` (regist100)
- `regist/test-results/image-size-warning-modal-support.png` (regist-support)

## Success Criteria

✅ Test passes if:
1. Modal appears when total > 10 MB
2. Modal shows correct message with size
3. User can only close by clicking button
4. Modal closes after acknowledgment
5. User can fix by removing images
6. Modal doesn't appear when size ≤ 10 MB

## Troubleshooting

### Modal doesn't appear
- Check if `useEffect` is triggered in Step4
- Verify `mgtImageFile` prop is passed correctly
- Check browser console for errors

### Modal appears at wrong time
- Verify image sizes are correct (1 MB each)
- Check calculation logic in `useEffect`
- Ensure threshold is 10 MB (10 * 1024 * 1024 bytes)

### Cannot close modal
- This is expected! User must click "รับทราบ" button
- Backdrop click is intentionally disabled

## Notes

- Each test image is exactly 1 MB (1,048,576 bytes)
- Warning threshold is 10 MB (10,485,760 bytes)
- Modal uses `z-index: 50` to appear above all content
- Modal is non-dismissible except via button click
- Real-time calculation using React `useEffect` hook
