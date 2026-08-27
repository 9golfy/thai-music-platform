# Production Setup Guide: PDF Export Feature

## ✅ Commit Status
- **Commit Hash**: `eaac81a`
- **Branch**: `master`
- **Status**: Pushed to GitHub successfully

---

## 📦 Required Dependencies

### 1. **Puppeteer** (สำหรับสร้าง PDF)
```bash
npm install puppeteer@23.11.1
```

**หน้าที่**: Server-side headless browser สำหรับแปลง HTML เป็น PDF

**ข้อกำหนดระบบ**:
- **Linux/Ubuntu Server**:
  ```bash
  # ติดตั้ง dependencies ที่จำเป็นสำหรับ Chromium
  sudo apt-get update
  sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils
  ```

- **Memory**: แนะนำอย่างน้อย **2GB RAM** (สำหรับสร้าง PDF หลายไฟล์พร้อมกัน)
- **Disk Space**: ประมาณ **500MB** สำหรับ Chromium binary

### 2. **JSZip** (สำหรับสร้าง ZIP)
```bash
npm install jszip@3.10.1
```

**หน้าที่**: สร้างไฟล์ ZIP จาก PDF หลายไฟล์

---

## 🚀 Deployment Steps

### Step 1: Pull Code จาก GitHub
```bash
cd /path/to/your/project
git pull origin master
```

### Step 2: ติดตั้ง Dependencies
```bash
npm install
```

**หมายเหตุ**: คำสั่งนี้จะติดตั้ง puppeteer และ jszip ที่อยู่ใน `package.json` แล้ว

### Step 3: ตรวจสอบว่า Puppeteer ติดตั้งสำเร็จ
```bash
node -e "const puppeteer = require('puppeteer'); console.log('Puppeteer version:', puppeteer.version);"
```

**ผลลัพธ์ที่คาดหวัง**:
```
Puppeteer version: 23.11.1
```

### Step 4: ทดสอบ Puppeteer บน Server
สร้างไฟล์ทดสอบ `test-puppeteer.js`:
```javascript
const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('✅ Browser launched successfully!');
    
    const page = await browser.newPage();
    await page.setContent('<h1>Test</h1>');
    
    const pdf = await page.pdf({ format: 'A4' });
    console.log('✅ PDF generated:', pdf.length, 'bytes');
    
    await browser.close();
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
```

รันทดสอบ:
```bash
node test-puppeteer.js
```

### Step 5: Build Project
```bash
npm run build
```

### Step 6: Restart Server
```bash
# ถ้าใช้ PM2
pm2 restart thai-music-platform

# หรือถ้าใช้ systemd
sudo systemctl restart thai-music-platform
```

### Step 7: ตรวจสอบ Logs
```bash
# PM2
pm2 logs thai-music-platform

# systemd
sudo journalctl -u thai-music-platform -f
```

---

## ⚙️ Environment Configuration

### Optional: เพิ่ม Environment Variables (ถ้าต้องการ)
ในไฟล์ `.env.production`:
```bash
# Puppeteer Configuration
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser  # ถ้าต้องการใช้ chromium ที่ติดตั้งเอง
```

---

## 🧪 Testing on Production

### 1. เข้าสู่ระบบ Admin Dashboard
```
https://dcpschool100.net/dcp-admin/dashboard/register100
```

### 2. ทดสอบปุ่ม "All School Page (ZIP)"
- คลิกปุ่ม **"All School Page (ZIP)"** (สีม่วง)
- ควรเห็น progress modal แสดงความคืบหน้า
- ตรวจสอบว่าดาวน์โหลด ZIP ได้
- เปิดไฟล์ PDF ใน ZIP ตรวจสอบเนื้อหา (Section 1 เท่านั้น)

### 3. ทดสอบปุ่ม "Full School Page (ZIP)"
- คลิกปุ่ม **"Full School Page (ZIP)"** (สีฟ้า-เขียว)
- ควรเห็น progress modal แสดงความคืบหน้า
- ตรวจสอบว่าดาวน์โหลด ZIP ได้
- เปิดไฟล์ PDF ใน ZIP ตรวจสอบเนื้อหา (ครบทุก Section, ~20 หน้า)
- ตรวจสอบว่ารูปภาพแสดงผลถูกต้อง

### 4. ทดสอบปุ่ม "SchoolPage" ในหน้า Detail
- เข้าหน้า detail ของโรงเรียนใดก็ได้
- คลิกปุ่ม **"SchoolPage"**
- ควรดาวน์โหลด PDF ของโรงเรียนนั้นได้

---

## 🐛 Troubleshooting

### ปัญหา 1: Puppeteer ไม่สามารถ launch browser
**อาการ**: Error `Failed to launch browser`

**แก้ไข**:
```bash
# ติดตั้ง dependencies ที่ขาด
sudo apt-get install -y \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0
```

### ปัญหา 2: รูปภาพไม่แสดงใน PDF
**อาการ**: PDF สร้างได้แต่รูปไม่มา

**สาเหตุ**:
- URL รูปภาพไม่สามารถเข้าถึงได้จาก server
- รูปภาพโหลดช้าเกินไป

**แก้ไข**:
- ตรวจสอบว่า server เข้าถึง internet ได้
- ตรวจสอบว่า firewall ไม่บล็อก outgoing requests
- เพิ่ม timeout ในโค้ด (ปรับแล้ว)

### ปัญหา 3: Out of Memory
**อาการ**: Server crash เมื่อสร้าง PDF จำนวนมาก

**แก้ไข**:
```bash
# เพิ่ม swap space
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# หรือเพิ่ม RAM ของ server
```

### ปัญหา 4: Timeout เมื่อสร้าง PDF
**อาการ**: Request timeout หลัง 30 วินาที

**แก้ไข**: เพิ่ม timeout ใน Nginx/Apache
```nginx
# Nginx
proxy_read_timeout 300s;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
```

---

## 📊 Performance Considerations

### จำนวนโรงเรียนและเวลาที่ใช้ (ประมาณการ)

| จำนวนโรงเรียน | Short PDF (~1 หน้า) | Full PDF (~20 หน้า) |
|--------------|---------------------|---------------------|
| 10 โรงเรียน   | ~30 วินาที          | ~2 นาที             |
| 50 โรงเรียน   | ~2 นาที             | ~8 นาที             |
| 100 โรงเรียน  | ~4 นาที             | ~15 นาที            |
| 400 โรงเรียน  | ~15 นาที            | ~60 นาที            |

**หมายเหตุ**: เวลาขึ้นอยู่กับ:
- CPU ของ server
- RAM ที่มี
- ความเร็ว internet (สำหรับโหลดรูปภาพ)
- จำนวนรูปภาพในแต่ละโรงเรียน

---

## 🔐 Security Notes

1. **Puppeteer ต้องรัน no-sandbox mode** บน production:
   - โค้ดใช้ `--no-sandbox` และ `--disable-setuid-sandbox` แล้ว
   - ปลอดภัยเพราะรันภายใน Next.js API route

2. **File Storage**:
   - ZIP files เก็บใน memory ชั่วคราว (global variable)
   - ถูกลบหลังดาวน์โหลดเสร็จ
   - สำหรับ production ขนาดใหญ่ ควรใช้ Redis หรือ file system

3. **Rate Limiting**:
   - ควรเพิ่ม rate limit สำหรับ API endpoint เหล่านี้
   - ป้องกันการใช้งาน CPU มากเกินไป

---

## 📝 API Endpoints Summary

### New Endpoints:
1. `GET /api/schools/download-all-pdf?type=register100&stream=true`
   - สร้าง ZIP ของ PDF แบบสั้น (Section 1)
   - รองรับ SSE progress

2. `GET /api/schools/download-full-pdf?type=register100&stream=true`
   - สร้าง ZIP ของ PDF แบบเต็ม (ทุก Section)
   - รองรับ SSE progress

3. `GET /api/school/[schoolId]/pdf`
   - HTML สำหรับ PDF โรงเรียนเดียว (แบบสั้น)

4. `GET /api/school/[schoolId]/download-pdf`
   - ดาวน์โหลด PDF โรงเรียนเดียว

5. `GET /api/school/[schoolId]`
   - หน้าแสดงข้อมูลโรงเรียนแบบ public

---

## ✅ Deployment Checklist

- [x] Git commit และ push แล้ว
- [ ] Pull code บน production server
- [ ] ติดตั้ง system dependencies (Ubuntu packages)
- [ ] รัน `npm install`
- [ ] ทดสอบ Puppeteer ด้วย test script
- [ ] รัน `npm run build`
- [ ] Restart server (PM2/systemd)
- [ ] ตรวจสอบ logs หา error
- [ ] ทดสอบปุ่ม "All School Page (ZIP)"
- [ ] ทดสอบปุ่ม "Full School Page (ZIP)"
- [ ] ทดสอบปุ่ม "SchoolPage" ในหน้า detail
- [ ] ตรวจสอบรูปภาพใน PDF
- [ ] ทดสอบกับข้อมูลจริง 400+ โรงเรียน

---

## 📞 Support

หากพบปัญหาในการติดตั้ง สามารถตรวจสอบ:
1. Server logs: `pm2 logs` หรือ `journalctl`
2. Browser console (Network tab) สำหรับ frontend errors
3. ไฟล์ logs ของ Next.js

---

**Created**: 2026-08-27  
**Last Updated**: 2026-08-27  
**Version**: 1.0
