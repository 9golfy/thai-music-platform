#!/bin/bash

# สคริปต์สำหรับติดตั้งและตั้งค่าความปลอดภัย
# ใช้งาน: chmod +x setup-security.sh && sudo ./setup-security.sh

set -e

echo "================================"
echo "Security Setup Script"
echo "================================"
echo ""

# ตรวจสอบว่าเป็น root หรือไม่
if [ "$EUID" -ne 0 ]; then 
    echo "กรุณารันสคริปต์นี้ด้วย sudo"
    exit 1
fi

# 1. อัพเดทระบบ
echo "1. อัพเดทระบบ..."
apt-get update
apt-get upgrade -y

# 2. ติดตั้ง nginx-extras (สำหรับ more_clear_headers)
echo ""
echo "2. ติดตั้ง nginx-extras..."
apt-get install -y nginx-extras

# 3. ติดตั้ง certbot สำหรับ Let's Encrypt SSL
echo ""
echo "3. ติดตั้ง Certbot..."
apt-get install -y certbot python3-certbot-nginx

# 4. สร้าง Diffie-Hellman parameters
echo ""
echo "4. สร้าง Diffie-Hellman parameters (อาจใช้เวลาสักครู่)..."
if [ ! -f /etc/ssl/certs/dhparam.pem ]; then
    openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
    echo "สร้าง dhparam.pem เรียบร้อย"
else
    echo "dhparam.pem มีอยู่แล้ว"
fi

# 5. แก้ไข nginx.conf เพื่อซ่อน server version
echo ""
echo "5. แก้ไข nginx.conf..."
if ! grep -q "server_tokens off;" /etc/nginx/nginx.conf; then
    sed -i '/http {/a \    server_tokens off;' /etc/nginx/nginx.conf
    echo "เพิ่ม server_tokens off; แล้ว"
else
    echo "server_tokens off; มีอยู่แล้ว"
fi

# 6. สร้างโฟลเดอร์สำหรับ SSL certificates (ถ้ายังไม่มี)
echo ""
echo "6. เตรียมโฟลเดอร์สำหรับ SSL..."
mkdir -p /etc/letsencrypt/live

# 7. ตรวจสอบ nginx configuration
echo ""
echo "7. ตรวจสอบ nginx configuration..."
nginx -t

# 8. Restart nginx
echo ""
echo "8. Restart nginx..."
systemctl restart nginx
systemctl enable nginx

echo ""
echo "================================"
echo "✅ ติดตั้งเสร็จสมบูรณ์!"
echo "================================"
echo ""
echo "ขั้นตอนถัดไป:"
echo ""
echo "1. แก้ไขไฟล์ nginx.conf.example:"
echo "   - เปลี่ยน your-domain.com เป็นโดเมนของคุณ"
echo "   - คัดลอกไปที่ /etc/nginx/sites-available/your-domain"
echo ""
echo "2. สร้าง symlink:"
echo "   sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/"
echo ""
echo "3. ขอ SSL certificate จาก Let's Encrypt:"
echo "   sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo ""
echo "4. ตั้งค่า auto-renewal:"
echo "   sudo certbot renew --dry-run"
echo ""
echo "5. Restart nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "6. ทดสอบความปลอดภัย:"
echo "   - https://www.ssllabs.com/ssltest/"
echo "   - https://securityheaders.com"
echo ""
