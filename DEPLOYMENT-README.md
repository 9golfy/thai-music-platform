# คู่มือการใช้งานไฟล์ Deployment

> ⚠️ **คำเตือนสำคัญ**: ไฟล์เหล่านี้มีข้อมูล credentials จริง และถูก ignore โดย Git แล้ว

---

## ไฟล์ที่สร้างขึ้น

### 1. DEPLOYMENT-STEPS-REAL.md
คู่มือการ deploy แบบ step-by-step พร้อมข้อมูลจริงทั้งหมด

**เนื้อหาประกอบด้วย**:
- ข้อมูล Server (IP, SSH Key, Directory)
- การติดตั้ง Docker และ dependencies
- การสร้าง environment files พร้อม credentials จริง
- การตั้งค่า MongoDB
- การสร้าง Admin user
- การตั้งค่า Nginx
- Backup scripts
- Update scripts
- คำสั่งที่ใช้บ่อย
- Troubleshooting

### 2. deploy-to-aws.sh
Script สำหรับ deploy อัตโนมัติ

**ฟังก์ชัน**:
- Pull code ล่าสุดจาก Git
- Build Docker images ใหม่
- Restart containers
- แสดง logs และสถานะ

**วิธีใช้**:
```bash
# ทำให้ execute ได้ (ครั้งแรก)
chmod +x deploy-to-aws.sh

# Run deployment
./deploy-to-aws.sh
```

### 3. quick-commands.sh
Menu-driven script สำหรับจัดการ server

**ฟังก์ชัน**:
1. SSH to server
2. View application logs
3. View all logs
4. Restart application
5. Restart all services
6. Check container status
7. Deploy latest code
8. Backup database
9. Open Mongo shell
10. Check disk usage
11. Check memory usage
12. Clean Docker

**วิธีใช้**:
```bash
# ทำให้ execute ได้ (ครั้งแรก)
chmod +x quick-commands.sh

# Run menu
./quick-commands.sh
```

---

## Quick Start

### การ Deploy ครั้งแรก

1. **เปิดคู่มือ**:
   ```bash
   # Windows
   notepad DEPLOYMENT-STEPS-REAL.md
   
   # หรือใช้ editor อื่น
   code DEPLOYMENT-STEPS-REAL.md
   ```

2. **ทำตาม STEP 1-11** ในคู่มือ

3. **ตรวจสอบว่าทุกอย่างทำงาน**

### การ Deploy ครั้งต่อไป

**วิธีที่ 1: ใช้ Script (แนะนำ)**
```bash
./deploy-to-aws.sh
```

**วิธีที่ 2: Manual**
```bash
# SSH to server
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84

# Go to app directory
cd ~/registerForm-platform

# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f web
```

---

## คำสั่งที่ใช้บ่อย

### SSH to Server
```bash
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84
```

### View Logs
```bash
# จาก local (ผ่าน SSH)
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84 "cd ~/registerForm-platform && docker-compose logs -f web"

# หรือใช้ quick-commands.sh
./quick-commands.sh
# เลือก option 2
```

### Restart Application
```bash
# ใช้ quick-commands.sh
./quick-commands.sh
# เลือก option 4

# หรือ manual
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84 "cd ~/registerForm-platform && docker-compose restart web"
```

### Backup Database
```bash
# ใช้ quick-commands.sh
./quick-commands.sh
# เลือก option 8

# หรือ manual
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84 "/home/ubuntu/backup.sh"
```

---

## URLs สำคัญ

- **Application**: http://18.138.63.84
- **Mongo Express**: http://18.138.63.84/mongo-express
- **API**: http://18.138.63.84:3000/api

---

## Credentials สำคัญ

### SSH
- **Key**: `D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem`
- **IP**: 18.138.63.84
- **User**: ubuntu

### MongoDB
- **Username**: root
- **Password**: ThaiMusic2024!Secure#Pass
- **Database**: thai_music_school

### Admin User
- **Email**: admin@thaimusicplatform.com
- **Password**: Admin2024!Secure#Pass

### Gmail SMTP
- **Email**: thaimusicplatform@gmail.com
- **App Password**: heqwnhneswksqlze

---

## Troubleshooting

### ไฟล์ไม่ execute ได้
```bash
# Windows Git Bash
chmod +x deploy-to-aws.sh
chmod +x quick-commands.sh

# หรือใช้ Git Bash
bash deploy-to-aws.sh
bash quick-commands.sh
```

### SSH Connection Failed
1. ตรวจสอบว่า SSH key อยู่ที่ `D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem`
2. ตรวจสอบ permissions ของ key:
   ```bash
   # Git Bash
   chmod 400 "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem"
   ```
3. ตรวจสอบว่า IP ถูกต้อง: 18.138.63.84

### Container ไม่ start
```bash
# SSH to server
ssh -i "D:\Fatcat\ThaiMusic\aws-credential\thai-music-key.pem" ubuntu@18.138.63.84

# ดู logs
cd ~/registerForm-platform
docker-compose logs web

# Restart
docker-compose restart web
```

---

## Security Notes

1. **ห้าม commit ไฟล์เหล่านี้ขึ้น Git**
   - DEPLOYMENT-STEPS-REAL.md
   - deploy-to-aws.sh
   - quick-commands.sh
   
2. **เก็บไฟล์ไว้ในที่ปลอดภัย**
   - อย่าแชร์ผ่าน email
   - อย่าอัพโหลดไปที่อื่น
   - เก็บไว้ใน local machine เท่านั้น

3. **เปลี่ยน passwords เป็นประจำ**
   - MongoDB password
   - Admin password
   - JWT secret

4. **Backup เป็นประจำ**
   - Database backup ทุกวัน (automated)
   - Manual backup ก่อน deploy ใหญ่

---

## Support

หากมีปัญหา:
1. ดูที่ DEPLOYMENT-STEPS-REAL.md section "Troubleshooting"
2. ตรวจสอบ logs: `./quick-commands.sh` → option 2
3. ตรวจสอบ container status: `./quick-commands.sh` → option 6

---

**หมายเหตุ**: ไฟล์นี้ (DEPLOYMENT-README.md) ไม่มี credentials จึงปลอดภัยที่จะ commit ขึ้น Git
