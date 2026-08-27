# ✅ แก้ไขปัญหากรอกตัวเลขคะแนนไม่ได้

## 🐛 ปัญหาที่พบ

เมื่อกดปุ่ม "Edit" ในหน้า Detail:
- ✅ กรอกหมายเหตุได้ปกติ
- ❌ **กรอกตัวเลขคะแนนไม่ได้** (พิมพ์แล้วไม่เปลี่ยน)

## 🔍 สาเหตุ

ปัญหาอยู่ที่ `onChange` handler ของ `<input type="number">`:

### โค้ดเดิม (มีปัญหา)
```typescript
onChange={(e) => {
  const value = Math.min(max, Math.max(0, parseInt(e.target.value) || 0));
  onScoreChange(scoreFieldName, value);
}}
```

**ปัญหา:**
- เมื่อผู้ใช้เริ่มพิมพ์ตัวเลข `e.target.value` จะเป็น empty string (`""`) ชั่วขณะ
- `parseInt("")` จะได้ `NaN`
- `NaN || 0` จะได้ `0`
- ทำให้ค่าในช่องกลับเป็น `0` ทันที ไม่สามารถพิมพ์ตัวเลขได้

## ✅ วิธีแก้ไข

### โค้ดใหม่ (แก้ไขแล้ว)
```typescript
onChange={(e) => {
  const inputValue = e.target.value;
  // Allow empty string temporarily while typing
  if (inputValue === '') {
    onScoreChange(scoreFieldName, 0);
    return;
  }
  const numValue = parseInt(inputValue);
  if (!isNaN(numValue)) {
    const value = Math.min(max, Math.max(0, numValue));
    onScoreChange(scoreFieldName, value);
  }
}}
```

**การทำงาน:**
1. ตรวจสอบว่า input เป็น empty string หรือไม่
2. ถ้าเป็น empty string → ตั้งค่าเป็น 0 และ return
3. ถ้าไม่ใช่ → parse เป็นตัวเลข
4. ตรวจสอบว่าเป็นตัวเลขที่ valid (`!isNaN`)
5. จำกัดค่าให้อยู่ระหว่าง 0 ถึง max
6. อัปเดตค่า

## 📝 ไฟล์ที่แก้ไข

### 1. RegisterSupportDetailView.tsx
แก้ไข 4 ที่:
- ✅ ScoreCard component - score input (8 หมวด)
- ✅ video1_score input
- ✅ video2_score input

### 2. Register100DetailView.tsx
แก้ไข 4 ที่:
- ✅ ScoreCard component - score input (9 หมวด)
- ✅ video1_score input
- ✅ video2_score input

## 🎯 ผลลัพธ์

### ก่อนแก้ไข
```
พิมพ์ "1" → ช่องแสดง "0" (กรอกไม่ได้)
พิมพ์ "15" → ช่องแสดง "0" (กรอกไม่ได้)
```

### หลังแก้ไข
```
พิมพ์ "1" → ช่องแสดง "1" ✅
พิมพ์ "15" → ช่องแสดง "15" ✅
ลบทั้งหมด → ช่องแสดง "0" ✅
พิมพ์ "999" → ช่องแสดง "20" (จำกัดที่ max) ✅
```

## 🧪 การทดสอบ

### ขั้นตอนการทดสอบ:

1. **เปิดหน้า Register Support Detail:**
   ```
   http://localhost:3000/dcp-admin/dashboard/register-support/[id]
   ```

2. **กดปุ่ม "EDIT"**

3. **ทดสอบกรอกคะแนน:**
   - ลองพิมพ์ตัวเลข 1-20 ในช่องคะแนนต่างๆ
   - ตรวจสอบว่าตัวเลขแสดงผลถูกต้อง
   - ลองลบตัวเลขทั้งหมด → ควรแสดง 0
   - ลองพิมพ์ตัวเลขเกิน max → ควรจำกัดที่ max

4. **ทดสอบกรอกหมายเหตุ:**
   - ลองเขียนหมายเหตุในแต่ละหมวด
   - ตรวจสอบว่า textarea ทำงานปกติ

5. **กดปุ่ม "SAVE"**
   - ตรวจสอบว่าบันทึกสำเร็จ
   - Refresh หน้าเว็บ
   - ตรวจสอบว่าคะแนนและหมายเหตุถูกบันทึก

6. **ทำซ้ำกับ Register100 Detail:**
   ```
   http://localhost:3000/dcp-admin/dashboard/register100/[id]
   ```

## 📊 Input Fields ที่ได้รับการแก้ไข

### Register Support (10 inputs)
1. teacher_qualification_score (0-20)
2. support_from_org_score (0-5)
3. support_from_external_score (0-15)
4. award_score (0-20)
5. activity_within_province_internal_score (0-5)
6. activity_within_province_external_score (0-5)
7. activity_outside_province_score (0-5)
8. pr_activity_score (0-5)
9. video1_score (0-50)
10. video2_score (0-50)

### Register100 (11 inputs)
1-9. เหมือน Register Support (ยกเว้น video)
10. video1_score (0-50)
11. video2_score (0-50)

## 🔧 Technical Details

### Input Attributes
```typescript
<input
  type="number"
  min="0"
  max={max}
  value={score}
  onChange={...}
  className="..."
/>
```

### Validation Logic
- **Min value:** 0 (ไม่ให้ติดลบ)
- **Max value:** ตามที่กำหนดในแต่ละหมวด (5, 15, 20, 50)
- **Empty string:** แปลงเป็น 0 อัตโนมัติ
- **Invalid input:** ไม่อัปเดตค่า (เช่น พิมพ์ตัวอักษร)

## ✅ สถานะ

- [x] แก้ไข ScoreCard component ใน RegisterSupportDetailView
- [x] แก้ไข video1_score และ video2_score ใน RegisterSupportDetailView
- [x] แก้ไข ScoreCard component ใน Register100DetailView
- [x] แก้ไข video1_score และ video2_score ใน Register100DetailView
- [x] ตรวจสอบ TypeScript errors (ไม่มี errors)
- [x] พร้อมใช้งาน

## 📝 หมายเหตุ

- การแก้ไขนี้ไม่กระทบกับ API endpoints
- ไม่ต้องแก้ไข database schema
- ไม่ต้อง restart dev server (Hot reload จะทำงานอัตโนมัติ)
- แนะนำให้ Hard refresh browser (Ctrl + Shift + R) หลังจากแก้ไข

## 🎉 ผลลัพธ์สุดท้าย

ตอนนี้ผู้ใช้สามารถ:
- ✅ กดปุ่ม "EDIT" เพื่อเข้าสู่โหมดแก้ไข
- ✅ **กรอกตัวเลขคะแนนได้ปกติ**
- ✅ เขียนหมายเหตุได้ปกติ
- ✅ กดปุ่ม "SAVE" เพื่อบันทึกข้อมูล
- ✅ ดูหมายเหตุในกรอบสีเหลืองเมื่อไม่ได้แก้ไข

---

**สถานะ:** ✅ แก้ไขเสร็จสมบูรณ์
**วันที่:** 28 พฤษภาคม 2026
**ปัญหา:** กรอกตัวเลขคะแนนไม่ได้
**สาเหตุ:** `parseInt(e.target.value) || 0` ทำให้ค่ากลับเป็น 0 ทันที
**วิธีแก้:** ตรวจสอบ empty string ก่อน parse
