# Register Support Detail View - Step Reorganization Guide

## ปัญหาปัจจุบัน
ไฟล์ `components/admin/RegisterSupportDetailView.tsx` มีโครงสร้าง Step ที่ไม่ถูกต้อง:
- Step 1 ซ้ำกัน 2 ครั้ง (ประเภทโรงเรียน + ข้อมูลพื้นฐาน)
- Step 5 รวมการสนับสนุนและรางวัลไว้ด้วยกัน
- Step 6 เป็นสื่อและวิดีโอ (ควรเป็นการสนับสนุน)
- Step 7 เป็นกิจกรรม (ควรเป็นรางวัล)
- Step 8 เป็นประชาสัมพันธ์ (ควรเป็นกิจกรรม)
- ไม่มี Step 9 แยกออกมาชัดเจน

## โครงสร้างที่ถูกต้อง (ตาม register100)

### Step 1: ข้อมูลพื้นฐาน
- รวม "ประเภทโรงเรียนสนับสนุน" และ "ข้อมูลโรงเรียน" เข้าด้วยกัน
- Title: `"ข้อมูลพื้นฐาน"`
- stepNumber: `1`

### Step 2: ผู้บริหารสถานศึกษา
- ไม่ต้องเปลี่ยน (ถูกต้องแล้ว)
- Title: `"ผู้บริหารสถานศึกษา"`
- stepNumber: `2`

### Step 3: แผนการสอนดนตรีไทย
- ไม่ต้องเปลี่ยน (ถูกต้องแล้ว)
- Title: `"แผนการสอนดนตรีไทย"`
- stepNumber: `3`

### Step 4: ผู้สอนดนตรีไทย
- เอาเฉพาะส่วน "รายชื่อครู" และ "การเรียนการสอน" (checkbox 4 ตัว)
- ย้าย "สถานที่สอน" ไป Step 5
- Title: `"ผู้สอนดนตรีไทย"`
- stepNumber: `4`

### Step 5: สถานที่สอน (ใหม่)
- ย้ายจาก Step 4 เดิม
- เฉพาะ field "สถานที่สอน" (teachingLocation)
- Title: `"สถานที่สอน"`
- stepNumber: `5`

### Step 6: การสนับสนุน (ใหม่)
- แยกจาก Step 5 เดิม
- เฉพาะส่วน "การสนับสนุนจากองค์กร" และ "การสนับสนุนจากภายนอก"
- Title: `"การสนับสนุน"`
- stepNumber: `6`

### Step 7: รางวัล (ใหม่)
- แยกจาก Step 5 เดิม
- เฉพาะส่วน "รางวัล"
- เอา "กรอบหลักสูตร", "ผลการเรียนรู้", "บริบทการจัดการ" ออก (ไม่ใช่ส่วนของรางวัล)
- Title: `"รางวัล"`
- stepNumber: `7`

### Step 8: กิจกรรม (จาก Step 7 เดิม)
- ย้ายจาก Step 7 เดิม
- รวม 3 ประเภทกิจกรรม:
  - กิจกรรมภายในจังหวัด (ภายใน)
  - กิจกรรมภายในจังหวัด (ภายนอก)
  - กิจกรรมนอกจังหวัด
- Title: `"กิจกรรม"`
- stepNumber: `8`

### Step 9: ประชาสัมพันธ์ (จาก Step 8 เดิม)
- ย้ายจาก Step 8 เดิม
- กิจกรรมประชาสัมพันธ์ (prActivities)
- แหล่งข้อมูล (information sources)
- Title: `"ประชาสัมพันธ์"`
- stepNumber: `9`

## การแก้ไข

### 1. รวม Step 1 (บรรทัดประมาณ 800-850)

**ลบ:**
```tsx
<StepSection title="Step 1: ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย" stepNumber={1}>
  ...
</StepSection>
<StepSection title="Step 1: ข้อมูลพื้นฐาน" stepNumber={1}>
  ...
</StepSection>
```

**แทนที่ด้วย:**
```tsx
<StepSection title="ข้อมูลพื้นฐาน" stepNumber={1}>
  <div className="space-y-6">
    {/* ประเภทโรงเรียน */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">ประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย</h4>
      <div className="grid grid-cols-2 gap-6">
        <Field label="ประเภทที่เลือก" ... />
        <Field label={...} ... />
        <Field label="จำนวน (คน)" ... />
      </div>
    </div>

    {/* ข้อมูลโรงเรียน */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">ข้อมูลโรงเรียน</h4>
      <div className="grid grid-cols-2 gap-6">
        ... (ข้อมูลโรงเรียนทั้งหมด)
      </div>
    </div>

    {/* สถานที่ตั้ง */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">สถานที่ตั้ง</h4>
      <div className="grid grid-cols-2 gap-6">
        ... (ที่อยู่ทั้งหมด)
      </div>
    </div>
  </div>
</StepSection>
```

### 2. แก้ Step 4 - แยก "สถานที่สอน" ออก

**เปลี่ยนจาก:**
```tsx
<StepSection title="Step 4: ผู้สอนดนตรีไทย" stepNumber={4}>
  ...
  <Field label="สถานที่สอน" value={displayData?.teachingLocation} ... />
</StepSection>
```

**เป็น:**
```tsx
<StepSection title="ผู้สอนดนตรีไทย" stepNumber={4}>
  ... (เฉพาะครูและ checkbox การเรียนการสอน)
</StepSection>
```

### 3. เพิ่ม Step 5 ใหม่ - สถานที่สอน

**เพิ่มหลัง Step 4:**
```tsx
<StepSection title="สถานที่สอน" stepNumber={5}>
  <Field label="สถานที่สอน" value={displayData?.teachingLocation} fullWidth isEditMode={isEditMode} onChange={(val) => handleFieldChange('teachingLocation', val)} fieldName="teachingLocation" />
</StepSection>
```

### 4. แก้ Step 5 เดิม → Step 6 ใหม่ - การสนับสนุน

**เปลี่ยนจาก:**
```tsx
<StepSection title="Step 5: การสนับสนุนและรางวัล" stepNumber={5}>
```

**เป็น:**
```tsx
<StepSection title="การสนับสนุน" stepNumber={6}>
  ... (เฉพาะการสนับสนุนจากองค์กรและภายนอก)
  ... (ลบส่วนรางวัล, กรอบหลักสูตร, ผลการเรียนรู้, บริบทการจัดการออก)
</StepSection>
```

### 5. เพิ่ม Step 7 ใหม่ - รางวัล

**เพิ่มหลัง Step 6:**
```tsx
<StepSection title="รางวัล" stepNumber={7}>
  <div>
    <h4 className="font-semibold text-gray-900 mb-3">รางวัล</h4>
    ... (ย้ายส่วนรางวัลจาก Step 5 เดิมมาที่นี่)
  </div>
</StepSection>
```

### 6. แก้ Step 6 เดิม → ลบออก

**ลบ:**
```tsx
<StepSection title="Step 6: สื่อและวิดีโอ" stepNumber={6}>
  ...
</StepSection>
```

### 7. แก้ Step 7 เดิม → Step 8 ใหม่ - กิจกรรม

**เปลี่ยนจาก:**
```tsx
<StepSection title="Step 7: กิจกรรมและการเผยแพร่" stepNumber={7}>
```

**เป็น:**
```tsx
<StepSection title="กิจกรรม" stepNumber={8}>
  ... (เฉพาะ 3 ประเภทกิจกรรม)
</StepSection>
```

### 8. แก้ Step 8 เดิม → Step 9 ใหม่ - ประชาสัมพันธ์

**เปลี่ยนจาก:**
```tsx
<StepSection title="Step 8: ประชาสัมพันธ์และแหล่งข้อมูล" stepNumber={8}>
```

**เป็น:**
```tsx
<StepSection title="ประชาสัมพันธ์" stepNumber={9}>
  ... (กิจกรรมประชาสัมพันธ์และแหล่งข้อมูล)
</StepSection>
```

### 9. เพิ่ม Step 10 - ข้อมูลเพิ่มเติม (ถ้ามี)

หากมีส่วน "ปัญหาอุปสรรค", "ข้อเสนอแนะ", "รับรองความถูกต้อง" ให้ใส่ใน Step สุดท้าย

## สรุป

หลังจากแก้ไขจะได้โครงสร้าง 9 Steps ที่ชัดเจน:
1. ข้อมูลพื้นฐาน
2. ผู้บริหารสถานศึกษา
3. แผนการสอนดนตรีไทย
4. ผู้สอนดนตรีไทย
5. สถานที่สอน
6. การสนับสนุน
7. รางวัล
8. กิจกรรม
9. ประชาสัมพันธ์

ตรงกับโครงสร้างของ register100 และเงื่อนไขการให้คะแนน
