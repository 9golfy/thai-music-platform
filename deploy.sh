#!/bin/bash

# Thai Music Platform - Deploy Script
# Server: 164.115.41.34
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment to 164.115.41.34..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="/var/www/thai-music-platform"

# Navigate to project
cd $PROJECT_DIR

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
git pull origin main || git pull origin master

# Check if package.json changed
if git diff HEAD@{1} --name-only | grep -q "package.json"; then
    echo -e "${YELLOW}📦 package.json changed, installing dependencies...${NC}"
    npm ci --only=production
else
    echo -e "${GREEN}✓ No dependency changes, skipping npm install${NC}"
fi

# Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Restart PM2
echo -e "${YELLOW}🔄 Restarting application...${NC}"
pm2 restart thai-music-platform || pm2 start npm --name thai-music-platform -- start
pm2 save

# Reload Nginx
echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
sudo systemctl reload nginx 2>/dev/null || echo -e "${YELLOW}⚠️  Nginx reload skipped (no sudo access)${NC}"

# Show status
echo -e "${GREEN}✅ Deployment completed!${NC}"
pm2 status

# Show logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
pm2 logs thai-music-platform --lines 20 --nostream

echo ""
echo -e "${GREEN}🌐 Application URL: http://164.115.41.34${NC}"
echo ""
