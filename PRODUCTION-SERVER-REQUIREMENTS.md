# Production Server Requirements - Thai Music Platform

## 📋 Tech Stack Overview

### Application Stack
- **Frontend**: Next.js 16.1.6 (React 19.2.3)
- **Backend**: Next.js API Routes (Node.js 22)
- **Database**: MongoDB 7.0
- **Runtime**: Node.js 22 LTS
- **Package Manager**: npm
- **Containerization**: Docker + Docker Compose

### Key Technologies
- **Authentication**: JWT (jose), bcryptjs
- **Email**: Nodemailer (Gmail SMTP)
- **File Upload**: Native Node.js file handling
- **PDF Generation**: jsPDF, html2pdf.js
- **Excel Export**: xlsx
- **UI Framework**: React, Radix UI, Tailwind CSS
- **Database Admin**: Mongo Express

---

## 🐧 Linux Server Requirements (Ubuntu/Debian - Recommended)

### System Requirements

#### Minimum Specifications
- **OS**: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS / Debian 12
- **CPU**: 2 vCPU (2.5 GHz+)
- **RAM**: 4 GB
- **Storage**: 20 GB SSD
- **Network**: 1 Gbps

#### Recommended Specifications
- **OS**: Ubuntu 24.04 LTS
- **CPU**: 4 vCPU (3.0 GHz+)
- **RAM**: 8 GB
- **Storage**: 40 GB SSD
- **Network**: 1 Gbps

---

### Required Software Installation

#### 1. System Update
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Essential Tools
```bash
# Build tools and utilities
sudo apt install -y \
  curl \
  wget \
  git \
  unzip \
  vim \
  nano \
  htop \
  net-tools \
  ca-certificates \
  gnupg \
  lsb-release
```

#### 3. Docker Engine
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version
# Expected: Docker version 27.x.x or higher
```

#### 4. Docker Compose
```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
# Expected: Docker Compose version v2.x.x or higher
```

#### 5. Node.js 22 LTS (Optional - for development/debugging)
```bash
# Install Node.js 22 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Expected: v22.x.x
npm --version   # Expected: 10.x.x
```

#### 6. Git
```bash
# Install Git
sudo apt install -y git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify installation
git --version
# Expected: git version 2.x.x or higher
```

#### 7. Nginx (Reverse Proxy - Optional but Recommended)
```bash
# Install Nginx
sudo apt install -y nginx

# Enable Nginx service
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify installation
nginx -v
# Expected: nginx version 1.x.x

# Check status
sudo systemctl status nginx
```

#### 8. UFW Firewall
```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

#### 9. Certbot (SSL Certificate - Optional)
```bash
# Install Certbot for Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

#### 10. Monitoring Tools (Optional)
```bash
# Install monitoring tools
sudo apt install -y \
  htop \
  iotop \
  nethogs \
  ncdu \
  glances

# Docker monitoring
docker stats
```

---

### Software Versions Summary (Linux)

| Software | Version | Required | Purpose |
|----------|---------|----------|---------|
| Ubuntu | 22.04 LTS / 24.04 LTS | ✅ Yes | Operating System |
| Docker | 27.x+ | ✅ Yes | Container Runtime |
| Docker Compose | 2.x+ | ✅ Yes | Multi-container Orchestration |
| Git | 2.x+ | ✅ Yes | Version Control |
| Node.js | 22.x LTS | ⚠️ Optional | Development/Debugging |
| npm | 10.x+ | ⚠️ Optional | Package Manager |
| Nginx | 1.x+ | ⚠️ Recommended | Reverse Proxy |
| UFW | Latest | ⚠️ Recommended | Firewall |
| Certbot | Latest | ⚠️ Optional | SSL Certificate |

---

## 🪟 Windows Server Requirements

### System Requirements

#### Minimum Specifications
- **OS**: Windows Server 2022 / Windows 11 Pro
- **CPU**: 2 vCPU (2.5 GHz+)
- **RAM**: 8 GB (Windows requires more RAM)
- **Storage**: 40 GB SSD
- **Network**: 1 Gbps

#### Recommended Specifications
- **OS**: Windows Server 2022
- **CPU**: 4 vCPU (3.0 GHz+)
- **RAM**: 16 GB
- **Storage**: 60 GB SSD
- **Network**: 1 Gbps

---

### Required Software Installation

#### 1. Windows Updates
```powershell
# Run Windows Update
# Settings > Update & Security > Windows Update > Check for updates
```

#### 2. Docker Desktop for Windows
```powershell
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop/

# System Requirements:
# - Windows 11 64-bit: Pro, Enterprise, or Education
# - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19044+)
# - WSL 2 feature enabled
# - Hyper-V and Containers Windows features enabled

# After installation, verify:
docker --version
docker-compose --version
```

#### 3. WSL 2 (Windows Subsystem for Linux)
```powershell
# Enable WSL 2
wsl --install

# Set WSL 2 as default
wsl --set-default-version 2

# Install Ubuntu
wsl --install -d Ubuntu-24.04

# Verify installation
wsl --list --verbose
```

#### 4. Git for Windows
```powershell
# Download Git from:
# https://git-scm.com/download/win

# Or install via Chocolatey:
choco install git -y

# Verify installation
git --version
```

#### 5. Node.js 22 LTS (Optional)
```powershell
# Download Node.js from:
# https://nodejs.org/en/download/

# Or install via Chocolatey:
choco install nodejs-lts -y

# Verify installation
node --version
npm --version
```

#### 6. Windows Terminal (Recommended)
```powershell
# Install from Microsoft Store:
# https://aka.ms/terminal

# Or via winget:
winget install Microsoft.WindowsTerminal
```

#### 7. PowerShell 7+ (Recommended)
```powershell
# Install PowerShell 7
winget install Microsoft.PowerShell

# Verify installation
pwsh --version
```

#### 8. IIS (Internet Information Services - Alternative to Nginx)
```powershell
# Enable IIS via PowerShell
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ApplicationDevelopment

# Or via Server Manager:
# Server Manager > Add Roles and Features > Web Server (IIS)
```

#### 9. Windows Firewall Configuration
```powershell
# Allow HTTP (Port 80)
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow

# Allow HTTPS (Port 443)
New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow

# Allow Docker (Port 3000)
New-NetFirewallRule -DisplayName "Allow Docker App" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Allow MongoDB (Port 27017)
New-NetFirewallRule -DisplayName "Allow MongoDB" -Direction Inbound -LocalPort 27017 -Protocol TCP -Action Allow
```

#### 10. Chocolatey Package Manager (Optional)
```powershell
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Verify installation
choco --version
```

---

### Software Versions Summary (Windows)

| Software | Version | Required | Purpose |
|----------|---------|----------|---------|
| Windows Server | 2022 | ✅ Yes | Operating System |
| Docker Desktop | Latest | ✅ Yes | Container Runtime |
| WSL 2 | Latest | ✅ Yes | Linux Subsystem |
| Git for Windows | 2.x+ | ✅ Yes | Version Control |
| Node.js | 22.x LTS | ⚠️ Optional | Development/Debugging |
| npm | 10.x+ | ⚠️ Optional | Package Manager |
| Windows Terminal | Latest | ⚠️ Recommended | Terminal Emulator |
| PowerShell | 7.x+ | ⚠️ Recommended | Shell |
| IIS | 10.x+ | ⚠️ Optional | Web Server |

---

## 🐳 Docker Containers (Both Linux & Windows)

### Container Images Used

| Container | Image | Version | Port | Purpose |
|-----------|-------|---------|------|---------|
| Web Application | node:22-alpine | 22-alpine | 3000 | Next.js Application |
| MongoDB | mongo | 7 | 27017 | Database |
| Mongo Express | mongo-express | 1 | 8081 | Database Admin UI |

### Container Resource Requirements

#### Web Application Container
- **CPU**: 1-2 cores
- **Memory**: 1-2 GB
- **Storage**: 2 GB

#### MongoDB Container
- **CPU**: 1-2 cores
- **Memory**: 2-4 GB
- **Storage**: 10-20 GB (depends on data)

#### Mongo Express Container
- **CPU**: 0.5 cores
- **Memory**: 256 MB
- **Storage**: 100 MB

---

## 🌐 Network Requirements

### Ports to Open

| Port | Protocol | Service | Required |
|------|----------|---------|----------|
| 22 | TCP | SSH (Linux only) | ✅ Yes |
| 80 | TCP | HTTP | ✅ Yes |
| 443 | TCP | HTTPS | ⚠️ Recommended |
| 3000 | TCP | Next.js Application | ✅ Yes |
| 8081 | TCP | Mongo Express | ⚠️ Optional |
| 27017 | TCP | MongoDB | ⚠️ Internal Only |

### Security Recommendations
- ✅ Use firewall (UFW on Linux, Windows Firewall on Windows)
- ✅ Close port 27017 to external access (internal Docker network only)
- ✅ Use strong passwords for MongoDB
- ✅ Enable SSL/TLS for production (port 443)
- ✅ Restrict Mongo Express access (use authentication or VPN)
- ✅ Use SSH key authentication (Linux)
- ✅ Enable automatic security updates

---

## 📦 Application Dependencies (Inside Docker)

### Runtime Dependencies (package.json)
```json
{
  "node": "22.x",
  "next": "16.1.6",
  "react": "19.2.3",
  "mongodb": "7.1.0",
  "bcryptjs": "3.0.3",
  "jose": "6.1.3",
  "nodemailer": "8.0.1",
  "zod": "3.24.1"
}
```

### Build Dependencies
- TypeScript 5.x
- Tailwind CSS 4.x
- ESLint 9.x
- PostCSS 8.x

---

## 🔧 Environment Variables Required

### Production Environment (.env.production)
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://your-domain.com
PORT=3000

# MongoDB
MONGODB_URI=mongodb://thai-music-mongo:27017/thai_music_school
MONGO_DB=thai_music_school

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/public/uploads
```

---

## 📊 Storage Requirements

### Disk Space Breakdown

| Component | Size | Purpose |
|-----------|------|---------|
| OS (Linux) | 5-10 GB | Ubuntu/Debian |
| OS (Windows) | 20-30 GB | Windows Server |
| Docker Images | 2-3 GB | node:22-alpine, mongo:7, mongo-express:1 |
| Application Code | 500 MB | Next.js build + node_modules |
| MongoDB Data | 5-20 GB | Database (grows with usage) |
| File Uploads | 5-50 GB | User uploaded files (grows with usage) |
| Logs | 1-5 GB | Application and system logs |
| Backups | 10-50 GB | Database and file backups |

**Total Recommended**: 40 GB (Linux) / 60 GB (Windows)

---

## 🔐 Security Software (Optional but Recommended)

### Linux
```bash
# Fail2Ban (Brute force protection)
sudo apt install -y fail2ban

# ClamAV (Antivirus)
sudo apt install -y clamav clamav-daemon

# Logwatch (Log monitoring)
sudo apt install -y logwatch

# AIDE (File integrity monitoring)
sudo apt install -y aide
```

### Windows
- Windows Defender (Built-in)
- Windows Firewall (Built-in)
- Windows Update (Built-in)

---

## 📈 Monitoring Tools (Optional)

### Linux
```bash
# Prometheus + Grafana (Metrics)
docker run -d -p 9090:9090 prom/prometheus
docker run -d -p 3001:3000 grafana/grafana

# Portainer (Docker GUI)
docker run -d -p 9000:9000 --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

### Windows
- Docker Desktop Dashboard (Built-in)
- Windows Performance Monitor (Built-in)
- Task Manager (Built-in)

---

## 🚀 Quick Start Commands

### Linux (Ubuntu/Debian)
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Install Git
sudo apt install -y git

# 5. Clone repository
git clone https://github.com/your-repo/thai-music-platform.git
cd thai-music-platform

# 6. Deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

### Windows (PowerShell)
```powershell
# 1. Install Docker Desktop (Manual download)
# Download from: https://www.docker.com/products/docker-desktop/

# 2. Install WSL 2
wsl --install

# 3. Install Git
choco install git -y

# 4. Clone repository
git clone https://github.com/your-repo/thai-music-platform.git
cd thai-music-platform

# 5. Deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## ✅ Pre-Deployment Checklist

### Linux Server
- [ ] Ubuntu 22.04 LTS or higher installed
- [ ] System updated (apt update && apt upgrade)
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Git installed
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication configured
- [ ] Non-root user created with sudo access
- [ ] Nginx installed (optional)
- [ ] SSL certificate configured (optional)

### Windows Server
- [ ] Windows Server 2022 or Windows 11 Pro installed
- [ ] Windows updates installed
- [ ] Docker Desktop installed and running
- [ ] WSL 2 enabled and configured
- [ ] Git for Windows installed
- [ ] Windows Firewall configured
- [ ] PowerShell 7+ installed
- [ ] IIS installed (optional)
- [ ] SSL certificate configured (optional)

### Both Platforms
- [ ] Minimum 4 GB RAM available
- [ ] Minimum 20 GB disk space available
- [ ] Network ports 80, 443, 3000 accessible
- [ ] Domain name configured (optional)
- [ ] Environment variables prepared
- [ ] Database backup strategy planned
- [ ] Monitoring tools configured (optional)

---

## 📚 Additional Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Docker: https://docs.docker.com/
- MongoDB: https://docs.mongodb.com/
- Node.js: https://nodejs.org/docs/

### Tutorials
- Docker on Ubuntu: https://docs.docker.com/engine/install/ubuntu/
- Docker Desktop on Windows: https://docs.docker.com/desktop/install/windows-install/
- Next.js Deployment: https://nextjs.org/docs/deployment

---

## 🆘 Support

### Common Issues
1. **Docker permission denied**: Add user to docker group
2. **Port already in use**: Check and stop conflicting services
3. **Out of memory**: Increase RAM or optimize containers
4. **Disk space full**: Clean up Docker images and logs

### Useful Commands
```bash
# Check Docker status
docker ps
docker stats

# Check disk space
df -h

# Check memory
free -h

# Check logs
docker logs <container-name>

# Clean up Docker
docker system prune -a
```

---

**Last Updated**: 2026-03-20  
**Version**: 1.0  
**Project**: Thai Music Platform
