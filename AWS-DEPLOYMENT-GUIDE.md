# คู่มือการ Deploy Thai Music Platform ขึ้น AWS

## สารบัญ
1. [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น)
2. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
3. [การเตรียม AWS Services](#การเตรียม-aws-services)
4. [การ Deploy ด้วย Docker](#การ-deploy-ด้วย-docker)
5. [การตั้งค่า Environment Variables](#การตั้งค่า-environment-variables)
6. [การตั้งค่า MongoDB](#การตั้งค่า-mongodb)
7. [การตั้งค่า Domain และ SSL](#การตั้งค่า-domain-และ-ssl)
8. [การ Monitor และ Maintenance](#การ-monitor-และ-maintenance)
9. [Troubleshooting](#troubleshooting)

---

## ข้อกำหนดเบื้องต้น

### เครื่องมือที่ต้องมี
- AWS Account พร้อม IAM User ที่มีสิทธิ์เหมาะสม
- AWS CLI ติดตั้งและตั้งค่าแล้ว
- Docker และ Docker Compose
- Git
- SSH Key สำหรับเข้า EC2

### ความรู้พื้นฐาน
- Linux command line
- Docker basics
- AWS EC2, RDS, S3
- MongoDB

---

## สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              CloudFront (CDN + SSL)                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Application Load Balancer (ALB)                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              EC2 Instance(s)                            │
│         (Next.js App in Docker)                         │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│  MongoDB Atlas │      │   S3 Bucket     │
│  or RDS        │      │  (File Storage) │
└────────────────┘      └─────────────────┘
```

---

## การเตรียม AWS Services

### 1. สร้าง VPC และ Security Groups

#### สร้าง VPC
```bash
# สร้าง VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=thai-music-vpc}]'

# สร้าง Subnet (Public)
aws ec2 create-subnet \
  --vpc-id <VPC_ID> \
  --cidr-block 10.0.1.0/24 \
  --availability-zone ap-southeast-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=thai-music-public-subnet}]'

# สร้าง Internet Gateway
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=thai-music-igw}]'

# Attach Internet Gateway
aws ec2 attach-internet-gateway \
  --vpc-id <VPC_ID> \
  --internet-gateway-id <IGW_ID>
```

#### สร้าง Security Group
```bash
# Security Group สำหรับ EC2
aws ec2 create-security-group \
  --group-name thai-music-app-sg \
  --description "Security group for Thai Music Platform" \
  --vpc-id <VPC_ID>

# เปิด Port 80 (HTTP)
aws ec2 authorize-security-group-ingress \
  --group-id <SG_ID> \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# เปิด Port 443 (HTTPS)
aws ec2 authorize-security-group-ingress \
  --group-id <SG_ID> \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# เปิด Port 22 (SSH) - จำกัดเฉพาะ IP ของคุณ
aws ec2 authorize-security-group-ingress \
  --group-id <SG_ID> \
  --protocol tcp \
  --port 22 \
  --cidr <YOUR_IP>/32

# เปิด Port 3000 (Next.js App)
aws ec2 authorize-security-group-ingress \
  --group-id <SG_ID> \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0
```

### 2. สร้าง EC2 Instance

#### เลือก AMI และ Instance Type
- **AMI**: Ubuntu Server 22.04 LTS
- **Instance Type**: t3.medium (2 vCPU, 4 GB RAM) หรือสูงกว่า
- **Storage**: 30 GB gp3 SSD ขึ้นไป

#### สร้าง Instance ผ่าน AWS Console
1. ไปที่ EC2 Dashboard
2. คลิก "Launch Instance"
3. เลือก Ubuntu Server 22.04 LTS
4. เลือก Instance Type: t3.medium
5. เลือก VPC และ Subnet ที่สร้างไว้
6. เลือก Security Group ที่สร้างไว้
7. เพิ่ม Storage: 30 GB
8. สร้าง Key Pair หรือใช้ที่มีอยู่
9. Launch Instance

#### หรือสร้างผ่าน CLI
```bash
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name <YOUR_KEY_NAME> \
  --security-group-ids <SG_ID> \
  --subnet-id <SUBNET_ID> \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":30,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=thai-music-app}]'
```

### 3. Elastic IP (Optional แต่แนะนำ)
```bash
# จอง Elastic IP
aws ec2 allocate-address --domain vpc

# Attach กับ Instance
aws ec2 associate-address \
  --instance-id <INSTANCE_ID> \
  --allocation-id <ALLOCATION_ID>
```

---

## การตั้งค่า EC2 Instance

### 1. เชื่อมต่อกับ EC2
```bash
ssh -i <YOUR_KEY.pem> ubuntu@<EC2_PUBLIC_IP>
```

### 2. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. ติดตั้ง Docker
```bash
# ติดตั้ง Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# เพิ่ม user ปัจจุบันเข้า docker group
sudo usermod -aG docker $USER

# ติดตั้ง Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout และ Login ใหม่เพื่อให้ group มีผล
exit
```

### 4. ติดตั้ง Git และ Node.js (สำหรับ build)
```bash
# Git
sudo apt install git -y

# Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# ตรวจสอบ version
node --version
npm --version
```

### 5. ติดตั้ง Nginx (Reverse Proxy)
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## การ Deploy ด้วย Docker

### 1. Clone Repository
```bash
cd /home/ubuntu
git clone https://github.com/9golfy/thai-music-platform.git
cd thai-music-platform
```

### 2. สร้าง Environment File
```bash
# สร้างไฟล์ .env.production
nano .env.production
```

เพิ่มเนื้อหา:
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/thai-music?retryWrites=true&w=majority

# JWT Secret (สร้าง random string ที่ปลอดภัย)
JWT_SECRET=<GENERATE_RANDOM_STRING_HERE>

# Email Configuration (ถ้าใช้)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/public/uploads

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Build Docker Image
```bash
# Build image
docker build -t thai-music-platform:latest .

# ตรวจสอบ image
docker images
```

### 4. สร้าง Docker Network
```bash
docker network create thai-music-network
```

### 5. Run MongoDB (ถ้าใช้ local MongoDB)
```bash
# สร้าง volume สำหรับ MongoDB
docker volume create mongodb-data

# Run MongoDB container
docker run -d \
  --name mongodb \
  --network thai-music-network \
  -v mongodb-data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=<STRONG_PASSWORD> \
  -p 27017:27017 \
  mongo:7
```

### 6. Run Application Container
```bash
docker run -d \
  --name thai-music-app \
  --network thai-music-network \
  -p 3000:3000 \
  --env-file .env.production \
  -v /home/ubuntu/thai-music-platform/public/uploads:/app/public/uploads \
  --restart unless-stopped \
  thai-music-platform:latest
```

### 7. ตรวจสอบ Container
```bash
# ดู logs
docker logs -f thai-music-app

# ตรวจสอบสถานะ
docker ps

# ทดสอบ
curl http://localhost:3000
```

---

## การตั้งค่า Nginx Reverse Proxy

### 1. สร้าง Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/thai-music
```

เพิ่มเนื้อหา:
```nginx
upstream thai_music_app {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (หลังติดตั้ง SSL)
    # return 301 https://$server_name$request_uri;

    client_max_body_size 20M;

    location / {
        proxy_pass http://thai_music_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files
    location /_next/static {
        proxy_pass http://thai_music_app;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Uploads
    location /uploads {
        proxy_pass http://thai_music_app;
        proxy_cache_valid 200 24h;
        add_header Cache-Control "public";
    }
}
```

### 2. Enable Site
```bash
# สร้าง symbolic link
sudo ln -s /etc/nginx/sites-available/thai-music /etc/nginx/sites-enabled/

# ลบ default site
sudo rm /etc/nginx/sites-enabled/default

# ทดสอบ configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## การตั้งค่า SSL ด้วย Let's Encrypt

### 1. ติดตั้ง Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. ขอ SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Auto-renewal
```bash
# ทดสอบ renewal
sudo certbot renew --dry-run

# Certbot จะตั้ง cron job ให้อัตโนมัติ
# ตรวจสอบได้ที่
sudo systemctl status certbot.timer
```

---

## การตั้งค่า MongoDB

### Option 1: MongoDB Atlas (แนะนำ)

1. ไปที่ https://www.mongodb.com/cloud/atlas
2. สร้าง Free Cluster
3. ตั้งค่า Network Access: เพิ่ม IP ของ EC2
4. สร้าง Database User
5. คัดลอก Connection String
6. อัพเดท MONGODB_URI ใน .env.production

### Option 2: MongoDB บน EC2

ถ้าใช้ MongoDB container ตาม step ที่แล้ว:

```bash
# เข้าไปใน MongoDB container
docker exec -it mongodb mongosh -u admin -p <PASSWORD>

# สร้าง database และ user
use thai-music
db.createUser({
  user: "thaimusic",
  pwd: "<STRONG_PASSWORD>",
  roles: [{ role: "readWrite", db: "thai-music" }]
})

# ออกจาก mongosh
exit
```

อัพเดท MONGODB_URI:
```env
MONGODB_URI=mongodb://thaimusic:<PASSWORD>@mongodb:27017/thai-music?authSource=thai-music
```

---

## การสร้าง Admin User แรก

### 1. เข้าไปใน Application Container
```bash
docker exec -it thai-music-app sh
```

### 2. รัน Setup Script
```bash
# ถ้ามี script setup
node scripts/create-system-admin.js

# หรือใช้ API endpoint
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "YourStrongPassword123!",
    "name": "System Admin"
  }'
```

---

## Docker Compose (Alternative)

สร้างไฟล์ `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: thai-music-app
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    volumes:
      - ./public/uploads:/app/public/uploads
    depends_on:
      - mongodb
    restart: unless-stopped
    networks:
      - thai-music-network

  mongodb:
    image: mongo:7
    container_name: mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    volumes:
      - mongodb-data:/data/db
    ports:
      - "27017:27017"
    restart: unless-stopped
    networks:
      - thai-music-network

volumes:
  mongodb-data:

networks:
  thai-music-network:
    driver: bridge
```

Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## การ Update Application

### 1. Pull Latest Code
```bash
cd /home/ubuntu/thai-music-platform
git pull origin master
```

### 2. Rebuild และ Restart
```bash
# Stop container
docker stop thai-music-app
docker rm thai-music-app

# Rebuild image
docker build -t thai-music-platform:latest .

# Run new container
docker run -d \
  --name thai-music-app \
  --network thai-music-network \
  -p 3000:3000 \
  --env-file .env.production \
  -v /home/ubuntu/thai-music-platform/public/uploads:/app/public/uploads \
  --restart unless-stopped \
  thai-music-platform:latest
```

### 3. Zero-Downtime Deployment (Advanced)
```bash
# สร้าง script deploy.sh
nano deploy.sh
```

```bash
#!/bin/bash
set -e

echo "Pulling latest code..."
git pull origin master

echo "Building new image..."
docker build -t thai-music-platform:new .

echo "Starting new container..."
docker run -d \
  --name thai-music-app-new \
  --network thai-music-network \
  -p 3001:3000 \
  --env-file .env.production \
  -v /home/ubuntu/thai-music-platform/public/uploads:/app/public/uploads \
  thai-music-platform:new

echo "Waiting for new container to be ready..."
sleep 10

echo "Switching traffic..."
# Update Nginx upstream
sudo sed -i 's/localhost:3000/localhost:3001/' /etc/nginx/sites-available/thai-music
sudo nginx -s reload

echo "Stopping old container..."
docker stop thai-music-app
docker rm thai-music-app

echo "Renaming new container..."
docker rename thai-music-app-new thai-music-app

echo "Updating port..."
docker stop thai-music-app
docker rm thai-music-app
docker run -d \
  --name thai-music-app \
  --network thai-music-network \
  -p 3000:3000 \
  --env-file .env.production \
  -v /home/ubuntu/thai-music-platform/public/uploads:/app/public/uploads \
  --restart unless-stopped \
  thai-music-platform:new

sudo sed -i 's/localhost:3001/localhost:3000/' /etc/nginx/sites-available/thai-music
sudo nginx -s reload

echo "Deployment complete!"
```

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## การ Backup

### 1. Backup MongoDB
```bash
# สร้าง backup script
nano backup-mongodb.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker exec mongodb mongodump \
  --username admin \
  --password <PASSWORD> \
  --authenticationDatabase admin \
  --out /tmp/backup

docker cp mongodb:/tmp/backup $BACKUP_DIR/backup_$DATE

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

```bash
chmod +x backup-mongodb.sh

# เพิ่มใน crontab (backup ทุกวันเวลา 2:00 AM)
crontab -e
```

เพิ่ม:
```
0 2 * * * /home/ubuntu/backup-mongodb.sh >> /home/ubuntu/backup.log 2>&1
```

### 2. Backup Uploads
```bash
# Sync ไป S3
aws s3 sync /home/ubuntu/thai-music-platform/public/uploads s3://your-bucket/uploads/
```

---

## การ Monitor

### 1. ติดตั้ง Monitoring Tools
```bash
# htop
sudo apt install htop -y

# Docker stats
docker stats
```

### 2. Application Logs
```bash
# Real-time logs
docker logs -f thai-music-app

# Last 100 lines
docker logs --tail 100 thai-music-app

# Logs with timestamp
docker logs -t thai-music-app
```

### 3. Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 4. System Resources
```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top
```

---

## Troubleshooting

### Container ไม่ start
```bash
# ดู logs
docker logs thai-music-app

# ตรวจสอบ port conflict
sudo netstat -tulpn | grep 3000

# ตรวจสอบ environment variables
docker exec thai-music-app env
```

### Database Connection Error
```bash
# ทดสอบ MongoDB connection
docker exec -it mongodb mongosh -u admin -p <PASSWORD>

# ตรวจสอบ network
docker network inspect thai-music-network

# Ping MongoDB จาก app container
docker exec thai-music-app ping mongodb
```

### Out of Memory
```bash
# เพิ่ม swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# ทำให้ permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Disk Full
```bash
# ลบ unused Docker images
docker image prune -a

# ลบ unused volumes
docker volume prune

# ลบ logs เก่า
sudo find /var/log -name "*.log" -mtime +30 -delete
```

### SSL Certificate Issues
```bash
# Renew manually
sudo certbot renew

# ตรวจสอบ certificate
sudo certbot certificates

# Test SSL
curl -vI https://yourdomain.com
```

---

## Security Best Practices

### 1. Firewall
```bash
# ติดตั้ง UFW
sudo apt install ufw -y

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### 2. Fail2ban
```bash
# ติดตั้ง
sudo apt install fail2ban -y

# Configure
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Regular Updates
```bash
# Auto security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. MongoDB Security
- ใช้ strong password
- Enable authentication
- จำกัด network access
- Regular backups
- Update เป็นประจำ

---

## Performance Optimization

### 1. Enable Gzip ใน Nginx
```nginx
# เพิ่มใน /etc/nginx/nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Cache Static Assets
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. MongoDB Indexes
```javascript
// สร้าง indexes สำหรับ queries ที่ใช้บ่อย
db.register100.createIndex({ schoolId: 1 })
db.register100.createIndex({ createdAt: -1 })
db.registerSupport.createIndex({ schoolId: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## Cost Optimization

### 1. EC2 Instance
- ใช้ Reserved Instances สำหรับ production (ประหยัดได้ถึง 72%)
- ใช้ Spot Instances สำหรับ development/testing
- Right-size instance ตาม usage

### 2. Storage
- ใช้ S3 Intelligent-Tiering สำหรับ uploads
- Enable S3 Lifecycle policies
- ใช้ CloudFront CDN

### 3. Database
- MongoDB Atlas Free Tier (512 MB) สำหรับ development
- Shared Cluster สำหรับ production ขนาดเล็ก

---

## Checklist ก่อน Go Live

- [ ] SSL Certificate ติดตั้งและทำงานถูกต้อง
- [ ] Database backup automated
- [ ] Monitoring setup
- [ ] Error logging configured
- [ ] Environment variables ตั้งค่าถูกต้อง
- [ ] Admin user สร้างแล้ว
- [ ] Security groups configured properly
- [ ] Firewall rules set
- [ ] Domain DNS configured
- [ ] Email service working (ถ้ามี)
- [ ] File upload working
- [ ] Performance tested
- [ ] Load tested (ถ้าคาดว่ามี traffic สูง)

---

## ติดต่อและ Support

- GitHub: https://github.com/9golfy/thai-music-platform
- Issues: https://github.com/9golfy/thai-music-platform/issues

---

**หมายเหตุ**: คู่มือนี้เป็นแนวทางทั่วไป อาจต้องปรับแต่งตามความต้องการเฉพาะของโปรเจค
