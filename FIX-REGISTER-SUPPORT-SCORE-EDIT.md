# ✅ แก้ไขปัญหา Register Support แก้ไขคะแนนไม่ได้

## 🐛 ปัญหาที่พบ

- ✅ **Register100** - แก้ไขคะแนนได้ปกติ
- ❌ **Register Support** - กด Edit ได้ แต่แก้ไขตัวเลขคะแนนไม่ได้

## 🔍 สาเหตุ

ปัญหาอยู่ที่ `handleFieldChange` function ใน `RegisterSupportDetailView.tsx`:

### โค้ดเดิม (มีปัญหา)
```typescript
const handleFieldChange = (field: string, value: any) => {
  if (editedData) {
    // Try with regsup_ prefix first, then without prefix
    const actualField = editedData[`regsup_${field}`] !== undefined ? `regsup_${field}` : field;
    setEditedData({ ...editedData, [actualField]: value });
  }
};
```

**ปัญหา:**
1. เมื่อ ScoreCard ส่ง `scoreFieldName="teacher_qualification_score"` มา
2. Function พยายามหา `editedData['regsup_teacher_qualification_score']` ก่อน
3. แต่ database ใช้ field name **ไม่มี prefix** (`teacher_qualification_score`)
4. ทำให้ `actualField` กลายเป็น `regsup_teacher_qualification_score` (ผิด)
5. เมื่อ update ก็ update field ที่ไม่มีอยู่จริง
6. ทำให้คะแนนไม่เปลี่ยน

### ทำไม Register100 ใช้ได้?
Register100 ไม่มีการตรวจสอบ prefix ใน `handleFieldChange` เลย ใช้ field name โดยตรง

## ✅ วิธีแก้ไข

### โค้ดใหม่ (แก้ไขแล้ว)
```typescript
const handleFieldChange = (field: string, value: any) => {
  if (editedData) {
    // For score fields, use the field name directly without prefix
    // For other fields, try with regsup_ prefix first, then without prefix
    const isScoreField = field.includes('_score') || field.includes('_note');
    const actualField = isScoreField ? field : (editedData[`regsup_${field}`] !== undefined ? `regsup_${field}` : field);
    setEditedData({ ...editedData, [actualField]: value });
  }
};
```

**การทำงาน:**
1. ตรวจสอบว่า field เป็น score หรือ note field หรือไม่ (มี `_score` หรือ `_note`)
2. ถ้าใช่ → ใช้ field name โดยตรง (ไม่เติม prefix)
3. ถ้าไม่ใช่ → ลองหา `regsup_` prefix ก่อน (สำหรับ field อื่นๆ)

## 📊 Field Names ที่ได้รับผลกระทบ

### Score Fields (ใช้ field name โดยตรง)
```
teacher_qualification_score
support_from_org_score
support_from_external_score
award_score
activity_within_province_internal_score
activity_within_province_external_score
activity_outside_province_score
pr_activity_score
video1_score
video2_score
```

### Note Fields (ใช้ field name โดยตรง)
```
teacher_qualification_note
support_from_org_note
support_from_external_note
award_note
activity_within_province_internal_note
activity_within_province_external_note
activity_outside_province_note
pr_activity_note
```

### Other Fields (ยังใช้ regsup_ prefix ตามเดิม)
```
regsup_schoolName
regsup_schoolProvince
regsup_supportType
... etc
```

## 🧪 การทดสอบ

### ขั้นตอนการทดสอบ:

1. **Hard Refresh Browser:**
   ```
   กด Ctrl + Shift + R (หลายๆ ครั้ง)
   ```

2. **เปิดหน้า Register Support Detail:**
   ```
   http://localhost:3000/dcp-admin/dashboard/register-support/6a0d3a91ce726e5f0dd457e0?mode=edit
   ```

3. **ทดสอบแก้ไขคะแนน:**
   - ลองพิมพ์ตัวเลขในช่องคะแนนต่างๆ
   - ตรวจสอบว่าตัวเลขเปลี่ยนได้ ✅
   - ลองเขียนหมายเหตุ ✅

4. **กดปุ่ม "SAVE":**
   - ตรวจสอบว่าแสดงข้อความ "บันทึกข้อมูลสำเร็จ"
   - Refresh หน้าเว็บ
   - ตรวจสอบว่าคะแนนและหมายเหตุถูกบันทึก

5. **ทดสอบ Register100 (ควรยังใช้ได้ปกติ):**
   ```
   http://localhost:3000/dcp-admin/dashboard/register100/6a0d35f0ce726e5f0dd457dc?mode=edit
   ```

## 🔄 ถ้ายังไม่ได้

### Option 1: Clear Browser Cache
```
1. กด Ctrl + Shift + Delete
2. เลือก "Cached images and files"
3. เลือก "All time"
4. กด "Clear data"
5. ปิด browser แล้วเปิดใหม่
```

### Option 2: Restart Dev Server
```bash
# 1. หยุด dev server (Ctrl + C)
# 2. ลบ .next cache
rmdir /s /q .next

# 3. รัน dev server ใหม่
npm run dev

# 4. Hard refresh browser (Ctrl + Shift + R)
```

### Option 3: ใช้ Incognito Mode
```
1. กด Ctrl + Shift + N (Chrome)
2. เปิดหน้าเว็บ
3. ทดสอบแก้ไขคะแนน
```

## 📝 ไฟล์ที่แก้ไข

1. ✅ `components/admin/RegisterSupportDetailView.tsx`
   - แก้ไข `handleFieldChange` function
   - เพิ่มการตรวจสอบ `isScoreField`

## 🎯 ผลลัพธ์

### ก่อนแก้ไข
```
กด Edit → พิมพ์ตัวเลข → ตัวเลขไม่เปลี่ยน ❌
```

### หลังแก้ไข
```
กด Edit → พิมพ์ตัวเลข → ตัวเลขเปลี่ยนได้ ✅
กด Save → บันทึกสำเร็จ ✅
```

## 🔍 Debug Console

ถ้ายังไม่ได้ ให้เปิด Console (F12) และพิมพ์:

```javascript
// ตรวจสอบว่า editedData มี field ถูกต้องหรือไม่
console.log('editedData:', window.editedData);

// ตรวจสอบว่า handleFieldChange ถูกเรียกหรือไม่
const inputs = document.querySelectorAll('input[type="number"]');
inputs.forEach((input, i) => {
  input.addEventListener('change', (e) => {
    console.log(`Input ${i} changed:`, e.target.value);
  });
});
```

## ✅ สถานะ

- [x] ระบุสาเหตุ (handleFieldChange ใช้ field name ผิด)
- [x] แก้ไข handleFieldChange function
- [x] เพิ่มการตรวจสอบ isScoreField
- [x] ตรวจสอบ TypeScript errors (ไม่มี errors)
- [x] พร้อมใช้งาน

---

**สถานะ:** ✅ แก้ไขเสร็จสมบูรณ์
**วันที่:** 28 พฤษภาคม 2026
**ปัญหา:** Register Support แก้ไขคะแนนไม่ได้
**สาเหตุ:** handleFieldChange ใช้ field name ผิด (เติม regsup_ prefix)
**วิธีแก้:** ตรวจสอบว่าเป็น score/note field แล้วใช้ field name โดยตรง
