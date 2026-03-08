# AWS Deployment Guide

## ตัวเลือกการ Deploy บน AWS

### 1. AWS ECS (Elastic Container Service) - แนะนำ
ใช้ Docker container, auto-scaling, managed service

### 2. AWS EC2 + Docker
ควบคุมได้มากที่สุด, ต้องจัดการ server เอง

### 3. AWS App Runner
ง่ายที่สุด, deploy จาก Docker image โดยตรง

---

## วิธีที่ 1: AWS ECS (แนะนำ)

### ขั้นตอนการ Deploy

#### 1. สร้าง ECR Repository (เก็บ Docker image)

```bash
# Login to AWS
aws configure

# Create ECR repository
aws ecr create-repository --repository-name thai-music-platform --region ap-southeast-1

# Get login command
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com
```

#### 2. Build และ Push Docker Image

```bash
# Build production image
docker build -f Dockerfile.prod -t thai-music-platform:latest .

# Tag image
docker tag thai-music-platform:latest <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest

# Push to ECR
docker push <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest
```

#### 3. สร้าง MongoDB (เลือก 1 ใน 2)

**Option A: MongoDB Atlas (แนะนำ)**
- ไปที่ https://www.mongodb.com/cloud/atlas
- สร้าง Free Tier cluster
- Get connection string

**Option B: AWS DocumentDB**
```bash
aws docdb create-db-cluster \
  --db-cluster-identifier thai-music-db \
  --engine docdb \
  --master-username admin \
  --master-user-password YourPassword123
```

#### 4. สร้าง ECS Task Definition

สร้างไฟล์ `ecs-task-definition.json`:

```json
{
  "family": "thai-music-platform",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "<your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "MONGODB_URI",
          "value": "mongodb+srv://username:password@cluster.mongodb.net/thai-music-platform"
        },
        {
          "name": "NEXT_PUBLIC_API_URL",
          "value": "https://your-domain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/thai-music-platform",
          "awslogs-region": "ap-southeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### 5. สร้าง ECS Service

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name thai-music-cluster --region ap-southeast-1

# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create service
aws ecs create-service \
  --cluster thai-music-cluster \
  --service-name thai-music-service \
  --task-definition thai-music-platform \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

#### 6. สร้าง Application Load Balancer (ALB)

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name thai-music-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx

# Create target group
aws elbv2 create-target-group \
  --name thai-music-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --target-type ip

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn <alb-arn> \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=<target-group-arn>
```

---

## วิธีที่ 2: AWS EC2 + Docker (ง่ายกว่า)

### ขั้นตอน

#### 1. สร้าง EC2 Instance

```bash
# Launch EC2 instance (Ubuntu 22.04)
# Instance type: t3.small หรือ t3.medium
# Security Group: เปิด port 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

#### 2. เชื่อมต่อและติดตั้ง Docker

```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# Install Docker Compose V2
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Clone Repository

```bash
git clone https://github.com/9golfy/thai-music-platform.git
cd thai-music-platform
```

#### 4. สร้าง .env.production

```bash
cat > .env.production << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thai-music-platform
NEXT_PUBLIC_API_URL=http://<ec2-public-ip>
NODE_ENV=production
EOF
```

#### 5. Run Docker Compose

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### 6. ตั้งค่า Nginx (Optional - สำหรับ HTTPS)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/thai-music

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/thai-music /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## วิธีที่ 3: AWS App Runner (ง่ายที่สุด)

### ขั้นตอน

#### 1. Push Image to ECR (เหมือนวิธีที่ 1)

#### 2. สร้าง App Runner Service

```bash
aws apprunner create-service \
  --service-name thai-music-platform \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "<your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "3000",
        "RuntimeEnvironmentVariables": {
          "NODE_ENV": "production",
          "MONGODB_URI": "mongodb+srv://...",
          "NEXT_PUBLIC_API_URL": "https://xxx.ap-southeast-1.awsapprunner.com"
        }
      }
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }'
```

---

## ⚠️ สิ่งสำคัญที่ต้องแก้ไข

### 1. Image Upload Storage

ตอนนี้ใช้ `public/uploads/` ใน container ซึ่งจะหายเมื่อ restart

**แก้ไข: ใช้ AWS S3**

ต้องแก้ไขไฟล์:
- `app/api/register-support/route.ts`
- `app/api/register100/route.ts`

เปลี่ยนจาก local file storage เป็น S3

### 2. Environment Variables

ต้องตั้งค่า:
- `MONGODB_URI` - MongoDB connection string
- `NEXT_PUBLIC_API_URL` - Public URL ของ application
- `AWS_ACCESS_KEY_ID` - สำหรับ S3 (ถ้าใช้)
- `AWS_SECRET_ACCESS_KEY` - สำหรับ S3 (ถ้าใช้)
- `AWS_REGION` - เช่น ap-southeast-1
- `S3_BUCKET_NAME` - ชื่อ S3 bucket

---

## ค่าใช้จ่ายโดยประมาณ (Bangkok Region)

### ECS Fargate
- 0.5 vCPU, 1GB RAM: ~$15-20/เดือน
- MongoDB Atlas Free Tier: $0
- ALB: ~$20/เดือน
- **รวม: ~$35-40/เดือน**

### EC2
- t3.small (2 vCPU, 2GB RAM): ~$15/เดือน
- MongoDB Atlas Free Tier: $0
- **รวม: ~$15/เดือน** (ถูกที่สุด)

### App Runner
- 1 vCPU, 2GB RAM: ~$25-30/เดือน
- MongoDB Atlas Free Tier: $0
- **รวม: ~$25-30/เดือน**

---

## แนะนำสำหรับคุณ

**เริ่มต้น: EC2 + Docker (วิธีที่ 2)**
- ง่าย ถูก ควบคุมได้
- เหมาะสำหรับ MVP และ testing

**Production: ECS Fargate (วิธีที่ 1)**
- Auto-scaling
- Managed service
- เหมาะสำหรับ production ที่มี traffic สูง

---

## ต้องการความช่วยเหลือ?

บอกผมว่าคุณเลือกวิธีไหน แล้วผมจะช่วย:
1. สร้าง scripts สำหรับ deploy
2. แก้ไข code ให้รองรับ S3
3. สร้าง CI/CD pipeline
