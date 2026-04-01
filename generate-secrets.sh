#!/bin/bash

# สคริปต์สำหรับสร้าง secure passwords และ secrets
# ใช้งาน: chmod +x generate-secrets.sh && ./generate-secrets.sh

echo "================================"
echo "Generate Secure Secrets"
echo "================================"
echo ""

# ตรวจสอบว่ามี openssl หรือไม่
if ! command -v openssl &> /dev/null; then
    echo "❌ Error: openssl ไม่ได้ติดตั้ง"
    echo "ติดตั้งด้วย: sudo apt-get install openssl"
    exit 1
fi

echo "กำลังสร้าง secure secrets..."
echo ""

# 1. MongoDB Password
MONGO_PASSWORD=$(openssl rand -base64 24)
echo "1. MongoDB Root Password:"
echo "   $MONGO_PASSWORD"
echo ""

# 2. JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
echo "2. JWT Secret:"
echo "   $JWT_SECRET"
echo ""

# 3. Session Secret
SESSION_SECRET=$(openssl rand -base64 32)
echo "3. Session Secret (สำรอง):"
echo "   $SESSION_SECRET"
echo ""

# 4. API Key
API_KEY=$(openssl rand -hex 32)
echo "4. API Key (สำรอง):"
echo "   $API_KEY"
echo ""

echo "================================"
echo "✅ สร้าง secrets เรียบร้อย!"
echo "================================"
echo ""
echo "⚠️  คำเตือน:"
echo "- เก็บ secrets เหล่านี้ไว้ในที่ปลอดภัย"
echo "- อย่าเปิดเผยต่อสาธารณะ"
echo "- อย่า commit ลง git"
echo "- ใช้ environment variables หรือ secrets manager"
echo ""
echo "📝 ขั้นตอนถัดไป:"
echo "1. คัดลอก secrets ไปใส่ใน .env.production"
echo "2. หรือตั้งค่าใน environment variables"
echo "3. หรือใช้ secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)"
echo ""

# สร้างไฟล์ตัวอย่าง (optional)
read -p "ต้องการสร้างไฟล์ .env.production.generated หรือไม่? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > .env.production.generated << EOF
# Generated Secrets - $(date)
# ⚠️  ห้ามเปิดเผยไฟล์นี้ต่อสาธารณะ!

# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=$MONGO_PASSWORD
MONGO_DATABASE=thai_music_school_prod
MONGODB_URI=mongodb://admin:$MONGO_PASSWORD@mongodb:27017/thai_music_school_prod?authSource=admin

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# Email Configuration (ต้องแก้ไขเอง)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Application URL (ต้องแก้ไขเอง)
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Node Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF

    echo "✅ สร้างไฟล์ .env.production.generated แล้ว"
    echo ""
    echo "⚠️  อย่าลืม:"
    echo "1. แก้ไข GMAIL_USER และ GMAIL_APP_PASSWORD"
    echo "2. แก้ไข NEXT_PUBLIC_APP_URL"
    echo "3. เปลี่ยนชื่อเป็น .env.production"
    echo "4. ลบไฟล์นี้หลังใช้งาน: rm .env.production.generated"
    echo ""
fi

echo "================================"
echo "เสร็จสิ้น!"
echo "================================"
