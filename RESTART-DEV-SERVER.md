# 🔄 Restart Dev Server

## ปัญหา
- Register100 แก้ไขคะแนนได้แล้ว ✅
- Register Support ยังแก้ไขคะแนนไม่ได้ ❌

## สาเหตุที่เป็นไปได้
1. Browser cache ยังใช้โค้ดเก่า
2. Next.js dev server ยังไม่ได้ compile โค้ดใหม่
3. Hot reload ไม่ทำงาน

## วิธีแก้ไข

### Option 1: Restart Dev Server (แนะนำ)
```bash
# 1. หยุด dev server
กด Ctrl + C ใน Terminal ที่รัน npm run dev

# 2. ลบ .next cache
rmdir /s /q .next

# 3. รัน dev server ใหม่
npm run dev

# 4. รอจนกว่าจะเห็นข้อความ
# ✓ Ready in X.Xs
# ○ Local: http://localhost:3000

# 5. เปิด browser ใหม่
# กด Ctrl + Shift + R เพื่อ hard refresh
```

### Option 2: Clear Browser Cache
```
1. กด Ctrl + Shift + Delete
2. เลือก "Cached images and files"
3. เลือก "All time"
4. กด "Clear data"
5. ปิด browser แล้วเปิดใหม่
```

### Option 3: ใช้ Incognito Mode
```
1. กด Ctrl + Shift + N (Chrome) หรือ Ctrl + Shift + P (Firefox)
2. เปิด http://localhost:3000/dcp-admin/dashboard/register-support/6a0d3a91ce726e5f0dd457e0?mode=edit
3. ทดสอบแก้ไขคะแนน
```

## ตรวจสอบว่าโค้ดถูก compile แล้ว

### ใน Browser Console (F12)
```javascript
// ตรวจสอบว่า input มี onChange handler ที่ถูกต้อง
const inputs = document.querySelectorAll('input[type="number"]');
console.log('Total number inputs:', inputs.length);

inputs.forEach((input, i) => {
  const parent = input.closest('[class*="purple-50"], [class*="teal-50"], [class*="orange-50"]');
  if (parent) {
    console.log(`Score input ${i}:`, {
      value: input.value,
      min: input.min,
      max: input.max,
      hasOnChange: !!input.onchange
    });
  }
});
```

ถ้าเห็น `hasOnChange: true` แสดงว่าโค้ดถูก compile แล้ว

## ทดสอบหลัง Restart

1. เปิด http://localhost:3000/dcp-admin/dashboard/register-support/6a0d3a91ce726e5f0dd457e0?mode=edit
2. ลองพิมพ์ตัวเลขในช่องคะแนน
3. ถ้ายังไม่ได้ → ส่ง screenshot Console errors มา

---

**หมายเหตุ:** ถ้า restart แล้วยังไม่ได้ อาจจะมีปัญหาอื่น ให้ส่ง screenshot มาดูครับ
