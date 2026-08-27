# 🛡️ Server Protection Guide - PDF Generation Feature

## ⚠️ ความเสี่ยงที่อาจเกิดขึ้น

### 1. **Memory Overflow (HIGH RISK)**
**อาการ**:
- Server out of memory
- Process killed by OOM killer
- Website down

**สาเหตุ**:
- Puppeteer ใช้ RAM: ~150-300MB per browser instance
- สร้าง PDF 400 โรงเรียน = ใช้หน่วยความจำมาก
- ZIP file ขนาดใหญ่เก็บใน memory

**การป้องกัน**:
✅ เพิ่ม Rate Limiter - จำกัดไม่เกิน 2 concurrent generation
✅ เพิ่ม Swap Space (ดูด้านล่าง)
✅ Monitor memory usage

### 2. **CPU Overload (MEDIUM RISK)**
**อาการ**:
- CPU 100% นาน
- Website slow ทั้งระบบ
- ผู้ใช้คนอื่นรู้สึกช้า

**สาเหตุ**:
- Puppeteer render HTML ใช้ CPU สูง
- หลายคนใช้งานพร้อมกัน

**การป้องกัน**:
✅ Rate Limiter จำกัดจำนวน concurrent
✅ ใช้ browser instance เดียว (reuse)
✅ Monitor CPU usage

### 3. **Timeout (MEDIUM RISK)**
**อาการ**:
- Request timeout หลัง 30-60 วินาที
- User ไม่ได้รับไฟล์

**สาเหตุ**:
- Nginx/Apache default timeout = 30s
- สร้าง PDF 400 โรงเรียนใช้เวลา 15-60 นาที

**การป้องกัน**:
✅ ใช้ SSE แทน long request
✅ เพิ่ม timeout ใน Nginx (ดูด้านล่าง)

---

## 🛡️ ระบบป้องกันที่เพิ่มเข้าไป

### 1. **Rate Limiter**
ไฟล์: `middleware/rateLimiter.ts`

**ข้อจำกัด**:
- **Per IP**: สูงสุด 2 ครั้งต่อนาที
- **Global**: สร้าง PDF ได้ไม่เกิน 2 รายการพร้อมกัน

**วิธีการทำงาน**:
```typescript
// ตรวจสอบก่อนสร้าง PDF
const rateLimitCheck = pdfRateLimiter.checkRateLimit(ip);
if (!rateLimitCheck.allowed) {
  return 429 Too Many Requests
}

// เริ่มสร้าง PDF
pdfRateLimiter.startGeneration();

// ... สร้าง PDF ...

// เสร็จแล้ว
pdfRateLimiter.endGeneration();
```

**ผลลัพธ์**:
- ป้องกัน memory overflow
- ป้องกัน CPU overload
- ผู้ใช้รอคิวตามลำดับ

### 2. **Error Handling**
- Puppeteer browser ปิดอัตโนมัติเมื่อเกิด error
- Memory leak prevention

### 3. **Resource Cleanup**
- ลบ temp ZIP files หลังดาวน์โหลดเสร็จ
- ปิด browser instance เมื่อเสร็จสิ้น

---

## ⚙️ การตั้งค่า Production

### 1. **เพิ่ม Swap Space** (ป้องกัน OOM)
```bash
# สร้าง swap file ขนาด 4GB
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# ตรวจสอบ
free -h

# ทำให้ถาวร (เพิ่มใน /etc/fstab)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# ปรับ swappiness (แนะนำ 10)
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### 2. **เพิ่ม Timeout ใน Nginx**
แก้ไขไฟล์ `/etc/nginx/sites-available/dcpschool100.net`:

```nginx
server {
    # ... existing config ...
    
    # เพิ่ม timeout สำหรับ PDF generation
    location /api/schools/download {
        proxy_pass http://localhost:3000;
        proxy_read_timeout 3600s;      # 1 ชั่วโมง
        proxy_connect_timeout 3600s;
        proxy_send_timeout 3600s;
        
        # SSE specific
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
    }
    
    # Existing config
    location / {
        proxy_pass http://localhost:3000;
        # ... other settings ...
    }
}
```

Restart Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 3. **เพิ่ม PM2 Memory Limit**
แก้ไขไฟล์ `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'thai-music-platform',
    script: 'npm',
    args: 'start',
    max_memory_restart: '2G',  // Restart ถ้าใช้ RAM เกิน 2GB
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Restart PM2:
```bash
pm2 restart ecosystem.config.js
```

### 4. **Monitor Memory Usage**
```bash
# ติดตั้ง monitoring tool
npm install -g pm2-server-monit

# เปิด monitoring
pm2 monit
```

---

## 📊 Resource Monitoring

### 1. **ตรวจสอบ Memory**
```bash
# แสดง memory usage
free -h

# แสดง memory แบบ real-time
watch -n 1 free -h

# ดู process ที่ใช้ memory มากสุด
ps aux --sort=-%mem | head -n 10
```

### 2. **ตรวจสอบ CPU**
```bash
# แสดง CPU usage
top

# หรือใช้ htop (ถ้าติดตั้งแล้ว)
htop
```

### 3. **ตรวจสอบ Disk Space**
```bash
# แสดงพื้นที่ disk
df -h

# แสดงขนาดโฟลเดอร์
du -sh /path/to/project
```

---

## 🚨 กรณีฉุกเฉิน: Server Down

### Scenario 1: Out of Memory
**อาการ**: Website ไม่ตอบสนอง, PM2 killed

**แก้ไข**:
```bash
# 1. Restart PM2
pm2 restart thai-music-platform

# 2. ตรวจสอบ memory
free -h

# 3. เพิ่ม swap (ถ้ายังไม่มี)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Scenario 2: CPU 100%
**อาการ**: Website ช้ามาก, CPU 100%

**แก้ไข**:
```bash
# 1. ดู process ที่ใช้ CPU สูง
top

# 2. Kill puppeteer processes (ถ้ามีค้าง)
pkill -f puppeteer
pkill -f chromium

# 3. Restart PM2
pm2 restart thai-music-platform
```

### Scenario 3: Nginx Timeout
**อาการ**: 504 Gateway Timeout

**แก้ไข**:
```bash
# 1. เพิ่ม timeout (ดูข้างบน)
# 2. Reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📈 Performance Benchmarks

### Memory Usage (ประมาณการ)
| จำนวนโรงเรียน | Short PDF | Full PDF   | Peak Memory |
|--------------|-----------|------------|-------------|
| 10 โรงเรียน   | ~200MB    | ~400MB     | 500MB       |
| 50 โรงเรียน   | ~500MB    | ~1GB       | 1.5GB       |
| 100 โรงเรียน  | ~1GB      | ~2GB       | 3GB         |
| 400 โรงเรียน  | ~2GB      | ~4GB       | 6GB         |

**แนะนำ**: Server ควรมี RAM อย่างน้อย **4GB** + **4GB Swap**

### Time Usage (ประมาณการ)
| จำนวนโรงเรียน | Short PDF | Full PDF |
|--------------|-----------|----------|
| 10 โรงเรียน   | 30s       | 2 min    |
| 50 โรงเรียน   | 2 min     | 8 min    |
| 100 โรงเรียน  | 4 min     | 15 min   |
| 400 โรงเรียน  | 15 min    | 60 min   |

---

## ✅ Deployment Checklist

**ก่อน Deploy**:
- [ ] อ่านคู่มือนี้ทั้งหมด
- [ ] ตรวจสอบ RAM server (ต้องมีอย่างน้อย 4GB)
- [ ] เตรียม swap space 4GB

**หลัง Deploy**:
- [ ] เพิ่ม swap space
- [ ] เพิ่ม timeout ใน Nginx
- [ ] ปรับ PM2 memory limit
- [ ] ทดสอบสร้าง PDF 10 โรงเรียน
- [ ] Monitor memory usage
- [ ] Monitor CPU usage
- [ ] ทดสอบสร้าง PDF 50 โรงเรียน
- [ ] เฝ้าดู logs

**สัปดาห์แรก**:
- [ ] ตรวจสอบ memory usage ทุกวัน
- [ ] ตรวจสอบ error logs
- [ ] เก็บข้อมูล performance metrics
- [ ] ปรับแต่งตาม usage จริง

---

## 🔧 Advanced Configuration

### แนะนำสำหรับ Production ขนาดใหญ่

1. **ใช้ Redis แทน Memory**
   - เก็บ temp ZIP ใน Redis แทน global variable
   - ป้องกัน memory leak

2. **ใช้ Queue System**
   - ใช้ Bull Queue / BullMQ
   - จัดการ PDF generation เป็น jobs
   - Scale ได้ดีกว่า

3. **ใช้ Separate Server**
   - แยก PDF generation ไปอีก server
   - Main server ไม่ได้รับผลกระทบ

4. **ใช้ Serverless**
   - AWS Lambda / Google Cloud Functions
   - ไม่กระทบ main server เลย

---

## 📞 Support & Monitoring

### Log Files
```bash
# PM2 logs
pm2 logs thai-music-platform

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u thai-music-platform -f
```

### Alerts ที่ควรตั้ง
1. Memory usage > 80%
2. CPU usage > 90% นาน > 5 นาที
3. Disk space < 10%
4. PM2 restart เกิน 3 ครั้ง/ชั่วโมง

---

**Created**: 2026-08-27  
**Last Updated**: 2026-08-27  
**Version**: 1.0
