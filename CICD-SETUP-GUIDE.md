# CI/CD Setup Guide
## Thai Music Platform - Automated Deployment

---

## วิธีที่ 1: GitHub Actions (แนะนำ)

### ข้อดี:
- ✅ ฟรี และใช้งานง่าย
- ✅ Auto deploy เมื่อ push ไป master
- ✅ มี UI สวยงาม ดู logs ได้
- ✅ ไม่ต้องติดตั้งอะไรเพิ่ม

### Setup:

#### 1. สร้าง SSH Key บน Server

```bash
# สร้าง SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy

# เพิ่ม public key ใน authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys

# Copy private key (เก็บไว้ใช้ใน GitHub)
cat ~/.ssh/github_deploy
```

#### 2. เพิ่ม Secrets ใน GitHub

ไปที่: `GitHub Repo → Settings → Secrets and variables → Actions`

เพิ่ม secrets:
- `SSH_PRIVATE_KEY`: private key ที่ copy มา
- `SSH_HOST`: `164.115.41.34`
- `SSH_USER`: `root`
- `SSH_PORT`: `22`

#### 3. Push Workflow File

ไฟล์ `.github/workflows/deploy.yml` ถูกสร้างไว้แล้ว

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions CI/CD"
git push origin master
```

#### 4. ทดสอบ

- Push code ไป master → จะ auto deploy
- หรือไปที่ `Actions` tab ใน GitHub → เลือก workflow → Run workflow

---

## วิธีที่ 2: Webhook Deploy (ไม่ต้องเปิด SSH)

### ข้อดี:
- ✅ ไม่ต้องเปิด SSH จาก internet
- ✅ ควบคุมได้เอง 100%
- ✅ เบากว่า GitLab

### Setup:

#### 1. สร้าง Webhook Secret

```bash
# สร้าง random secret
openssl rand -hex 32
# เก็บ secret นี้ไว้
```

#### 2. เพิ่ม Webhook Service ใน PM2

แก้ไข `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'thai-music-platform',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/thai-music-platform',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'webhook-deploy',
      script: 'webhook-deploy.js',
      cwd: '/var/www/thai-music-platform',
      instances: 1,
      autorestart: true,
      env: {
        WEBHOOK_SECRET: 'your-secret-from-step-1'
      }
    }
  ]
}
```

```bash
# Restart PM2
pm2 restart ecosystem.config.js
pm2 save
```

#### 3. เปิด Port 9000

```bash
sudo ufw allow 9000/tcp
```

#### 4. ตั้งค่า Webhook ใน GitHub

ไปที่: `GitHub Repo → Settings → Webhooks → Add webhook`

- Payload URL: `http://164.115.41.34:9000/webhook`
- Content type: `application/json`
- Secret: secret ที่สร้างใน step 1
- Events: `Just the push event`
- Active: ✅

#### 5. ทดสอบ

Push code → GitHub จะส่ง webhook → Server จะ auto deploy

---

## วิธีที่ 3: Manual Deploy Script

### ใช้เมื่อ:
- ต้องการ deploy manual
- ทดสอบก่อน deploy จริง

### Setup:

```bash
# ให้สิทธิ์ execute
chmod +x /var/www/thai-music-platform/deploy.sh

# รัน deploy
cd /var/www/thai-music-platform
./deploy.sh
```

---

## วิธีที่ 4: GitLab CI/CD (Advanced)

### ข้อดี:
- ✅ Features ครบที่สุด
- ✅ มี Container Registry
- ✅ มี Security Scanning

### ข้อเสีย:
- ❌ ต้องติดตั้ง GitLab (ใช้ RAM 4GB+)
- ❌ ซับซ้อน
- ❌ ต้อง migrate จาก GitHub

### ไม่แนะนำสำหรับ project นี้

---

## 📊 เปรียบเทียบ

| Feature | GitHub Actions | Webhook | GitLab CI/CD |
|---------|---------------|---------|--------------|
| ความง่าย | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| ฟรี | ✅ | ✅ | ⚠️ (limited) |
| UI | ✅ | ❌ | ✅ |
| Features | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Resource | น้อย | น้อยมาก | เยอะมาก |

---

## 🎯 คำแนะนำ

### สำหรับ Project นี้:
1. **เริ่มต้น**: ใช้ **GitHub Actions** (ง่ายและฟรี)
2. **ถ้าไม่อยากเปิด SSH**: ใช้ **Webhook**
3. **ถ้าต้องการ manual control**: ใช้ **Deploy Script**

### ไม่แนะนำ:
- ❌ GitLab CI/CD (overkill สำหรับ project นี้)

---

## 🔒 Security Best Practices

### 1. ใช้ Deploy Key แทน Personal Access Token

```bash
# สร้าง deploy key (read-only)
ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/deploy_key
cat ~/.ssh/deploy_key.pub
# เพิ่มใน GitHub → Settings → Deploy keys
```

### 2. จำกัด IP ที่เข้าถึง Webhook

```bash
# ใน webhook-deploy.js เพิ่ม IP whitelist
const ALLOWED_IPS = [
  '140.82.112.0/20',  // GitHub webhooks
  '143.55.64.0/20'
];
```

### 3. ใช้ Environment Variables

```bash
# อย่า hardcode secrets ในโค้ด
# ใช้ .env หรือ PM2 env แทน
```

---

## 🚀 Quick Start (GitHub Actions)

```bash
# 1. สร้าง SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys

# 2. Copy private key
cat ~/.ssh/github_deploy

# 3. เพิ่ม secrets ใน GitHub
# (ทำผ่าน web UI)

# 4. Push workflow file
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD"
git push origin master

# 5. ดูผลลัพธ์ที่ Actions tab
```

---

## 📝 Troubleshooting

### GitHub Actions ไม่ทำงาน

```bash
# ตรวจสอบ SSH connection
ssh -i ~/.ssh/github_deploy root@164.115.41.34

# ตรวจสอบ permissions
chmod 600 ~/.ssh/github_deploy
chmod 644 ~/.ssh/github_deploy.pub
```

### Webhook ไม่ทำงาน

```bash
# ดู logs
pm2 logs webhook-deploy

# ทดสอบ webhook
curl -X POST http://localhost:9000/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/master"}'
```

### Deploy ล้มเหลว

```bash
# ดู PM2 logs
pm2 logs thai-music-platform

# ทดสอบ deploy manual
cd /var/www/thai-music-platform
./deploy.sh
```

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Webhooks](https://docs.github.com/en/webhooks)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)
