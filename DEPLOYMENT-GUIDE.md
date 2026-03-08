# Deployment Guide - Thai Music Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB 7+ running
- Docker & Docker Compose (optional)
- Gmail account for email service

---

## 📦 Step 1: Install Dependencies

```bash
npm install
```

This will install:
- next, react, react-dom
- mongodb
- bcryptjs, jose (authentication)
- nodemailer (email)
- @radix-ui components
- lucide-react (icons)
- tailwindcss

---

## 🔧 Step 2: Environment Variables

Create `.env` file in root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Gmail for Email Service
GMAIL_USER=thaimusicplatform@gmail.com
GMAIL_APP_PASSWORD=dijn vbmw jcxh efxb

# App URL
NEXT_PUBLIC_APP_URL=http://13.228.225.47:3000
```

### How to get Gmail App Password:
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. App passwords → Create new
4. Copy the 16-character password
5. Paste in `GMAIL_APP_PASSWORD`

---

## 🗄️ Step 3: Setup Database

### Option A: Automatic Setup (Recommended)

```bash
node scripts/setup-database.js
```

This will:
- Create all collections
- Create indexes
- Create root user (root@thaimusic.com / admin123)
- Show summary

### Option B: Manual Setup

```bash
# Connect to MongoDB
mongosh

# Switch to database
use thai_music_school

# Create root user
db.users.insertOne({
  email: "root@thaimusic.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "root",
  firstName: "System",
  lastName: "Administrator",
  phone: "0000000000",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.certificates.createIndex({ schoolId: 1 })
```

---

## 🏗️ Step 4: Build & Run

### Development Mode

```bash
npm run dev
```

Access at: http://localhost:3000

### Production Mode

```bash
# Build
npm run build

# Start
npm start
```

### Docker Mode

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker logs thai-music-web
docker logs thai-music-mongo

# Stop
docker-compose down
```

Services:
- Web: http://localhost:3000
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081

---

## 🧪 Step 5: Test the System

### 1. Test Admin Login
```
URL: http://13.228.225.47:3000/dcp-admin
Email: root@thaimusic.com
Password: admin123
```

Expected: Redirect to dashboard with stats

### 2. Test Dashboard
- Check statistics cards
- View recent submissions
- Navigate through sidebar

### 3. Test Schools Management
- Go to "โรงเรียน 100%"
- View list of schools
- Click on a school to view details
- Test delete (with confirmation)

### 4. Test User Management
- Go to "User Management"
- View Admin and Teacher tabs
- Click "เพิ่มผู้ใช้งาน" (Root only)
- Create a test teacher user

### 5. Test Teacher Login
```
URL: http://13.228.225.47:3000/teacher-login
Email: (teacher email)
Password: (6-digit password)
School ID: (from user creation)
```

Expected: Redirect to teacher dashboard

### 6. Test Certificate Management
- Go to "e-Certificate"
- Click "สร้างใบประกาศ"
- Select a school
- Preview and create

---

## 🔒 Security Checklist

### Before Production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change root password after first login
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set secure cookies (HTTPS only)
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Backup database regularly
- [ ] Set up monitoring & logging
- [ ] Review and update dependencies

### Recommended JWT_SECRET:
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🐳 Docker Deployment

### docker-compose.yml
```yaml
services:
  mongo:
    image: mongo:7
    container_name: thai-music-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: thai-music-web
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - mongo

volumes:
  mongo_data:
```

### Commands:
```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 🌐 AWS EC2 Deployment

### 1. Connect to EC2
```bash
ssh -i your-key.pem ubuntu@13.228.225.47
```

### 2. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y
```

### 3. Clone & Setup
```bash
# Clone repository
git clone https://github.com/your-repo/thai-music-platform.git
cd thai-music-platform

# Create .env file
nano .env
# (paste environment variables)

# Setup database
node scripts/setup-database.js

# Build and start
docker-compose up -d --build
```

### 4. Configure Firewall
```bash
# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000

# Enable firewall
sudo ufw enable
```

### 5. Setup Nginx (Optional)
```bash
# Install Nginx
sudo apt install nginx -y

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/thai-music

# Add configuration:
server {
    listen 80;
    server_name 13.228.225.47;

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
```

---

## 📊 Monitoring

### Check Application Status
```bash
# Docker
docker ps
docker logs thai-music-web

# Process
pm2 status
pm2 logs thai-music

# System
htop
df -h
free -m
```

### Check Database
```bash
# Connect to MongoDB
docker exec -it thai-music-mongo mongosh

# Show databases
show dbs

# Use database
use thai_music_school

# Show collections
show collections

# Count documents
db.users.countDocuments()
db.register100_submissions.countDocuments()
```

---

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest code
git pull origin master

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart (Docker)
docker-compose restart web

# Restart (PM2)
pm2 restart thai-music
```

### Backup Database
```bash
# Backup
docker exec thai-music-mongo mongodump --out /backup

# Restore
docker exec thai-music-mongo mongorestore /backup
```

---

## 🐛 Troubleshooting

### Application won't start
```bash
# Check logs
docker logs thai-music-web

# Check environment variables
docker exec thai-music-web env | grep MONGODB

# Restart
docker-compose restart
```

### Cannot connect to MongoDB
```bash
# Check MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker logs thai-music-mongo

# Test connection
docker exec thai-music-mongo mongosh --eval "db.adminCommand('ping')"
```

### Login not working
```bash
# Check JWT_SECRET is set
echo $JWT_SECRET

# Check root user exists
docker exec -it thai-music-mongo mongosh
use thai_music_school
db.users.findOne({ role: "root" })
```

### Email not sending
```bash
# Check Gmail credentials
echo $GMAIL_USER
echo $GMAIL_APP_PASSWORD

# Test email
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

---

## 📝 Post-Deployment Checklist

- [ ] Application is accessible
- [ ] Admin login works
- [ ] Teacher login works
- [ ] Dashboard displays correctly
- [ ] Schools list loads
- [ ] User management works
- [ ] Certificate creation works
- [ ] Email service works
- [ ] Database is backed up
- [ ] Monitoring is set up
- [ ] SSL certificate installed (production)
- [ ] Firewall configured
- [ ] Root password changed

---

## 🎉 Success!

Your Thai Music Platform is now deployed and ready to use!

**Access URLs:**
- Admin: http://13.228.225.47:3000/dcp-admin
- Teacher: http://13.228.225.47:3000/teacher-login
- Public: http://13.228.225.47:3000

**Default Credentials:**
- Email: root@thaimusic.com
- Password: admin123
- ⚠️ Change password immediately!

