#!/bin/bash

# Setup Webhook Auto Deploy on Server 164.115.41.34
# Run this script ON THE SERVER as root

set -e

echo "🚀 Setting up Webhook Auto Deploy..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/var/www/thai-music-platform"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root${NC}"
    exit 1
fi

# Navigate to project
cd $PROJECT_DIR

echo -e "${BLUE}Step 1: Generate WEBHOOK_SECRET${NC}"
echo "================================"

# Check if WEBHOOK_SECRET already exists
if grep -q "WEBHOOK_SECRET=" .env.production 2>/dev/null; then
    echo -e "${YELLOW}⚠️  WEBHOOK_SECRET already exists in .env.production${NC}"
    echo -e "${YELLOW}Do you want to generate a new one? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        # Remove old secret
        sed -i '/WEBHOOK_SECRET=/d' .env.production
        echo -e "${GREEN}✓ Removed old WEBHOOK_SECRET${NC}"
    else
        # Use existing secret
        WEBHOOK_SECRET=$(grep "WEBHOOK_SECRET=" .env.production | cut -d '=' -f2)
        echo -e "${GREEN}✓ Using existing WEBHOOK_SECRET${NC}"
    fi
fi

# Generate new secret if needed
if [ -z "$WEBHOOK_SECRET" ]; then
    WEBHOOK_SECRET=$(openssl rand -hex 32)
    echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env.production
    echo -e "${GREEN}✓ Generated new WEBHOOK_SECRET${NC}"
fi

echo ""
echo -e "${YELLOW}🔑 Your Webhook Secret:${NC}"
echo -e "${BLUE}$WEBHOOK_SECRET${NC}"
echo ""
echo -e "${RED}⚠️  SAVE THIS SECRET! You'll need it for GitHub webhook configuration${NC}"
echo ""

# Wait for user to save the secret
echo -e "${YELLOW}Press Enter after you've saved the secret...${NC}"
read

echo ""
echo -e "${BLUE}Step 2: Restart Webhook Server${NC}"
echo "================================"

# Check if webhook-deploy is running
if pm2 list | grep -q "webhook-deploy"; then
    pm2 restart webhook-deploy
    echo -e "${GREEN}✓ Restarted webhook-deploy${NC}"
else
    # Start webhook server
    pm2 start webhook-deploy.js --name webhook-deploy
    pm2 save
    echo -e "${GREEN}✓ Started webhook-deploy${NC}"
fi

echo ""
echo -e "${YELLOW}Checking webhook server status...${NC}"
sleep 2
pm2 logs webhook-deploy --lines 5 --nostream

echo ""
echo -e "${BLUE}Step 3: Configure Nginx${NC}"
echo "================================"

# Find nginx config file
NGINX_CONFIG=""
if [ -f "/etc/nginx/sites-available/dcpschool100.net" ]; then
    NGINX_CONFIG="/etc/nginx/sites-available/dcpschool100.net"
elif [ -f "/etc/nginx/sites-available/default" ]; then
    NGINX_CONFIG="/etc/nginx/sites-available/default"
else
    echo -e "${RED}❌ Could not find Nginx config file${NC}"
    echo -e "${YELLOW}Please manually add webhook location to your Nginx config${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found Nginx config: $NGINX_CONFIG${NC}"

# Check if webhook location already exists
if grep -q "location /webhook" "$NGINX_CONFIG"; then
    echo -e "${YELLOW}⚠️  Webhook location already exists in Nginx config${NC}"
else
    echo -e "${YELLOW}Adding webhook location to Nginx config...${NC}"
    echo ""
    echo -e "${RED}⚠️  MANUAL STEP REQUIRED:${NC}"
    echo -e "${YELLOW}Please add this to your Nginx config inside the SSL server block (port 443):${NC}"
    echo ""
    echo "    # Webhook endpoint"
    echo "    location /webhook {"
    echo "        proxy_pass http://localhost:9000/webhook;"
    echo "        proxy_http_version 1.1;"
    echo "        proxy_set_header Host \$host;"
    echo "        proxy_set_header X-Real-IP \$remote_addr;"
    echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
    echo "        proxy_set_header X-Forwarded-Proto \$scheme;"
    echo "        proxy_set_header X-Hub-Signature-256 \$http_x_hub_signature_256;"
    echo "        proxy_set_header X-GitHub-Event \$http_x_github_event;"
    echo "        proxy_connect_timeout 60s;"
    echo "        proxy_send_timeout 60s;"
    echo "        proxy_read_timeout 60s;"
    echo "    }"
    echo ""
    echo -e "${YELLOW}Edit the file with:${NC}"
    echo "sudo nano $NGINX_CONFIG"
    echo ""
    echo -e "${YELLOW}Press Enter after you've added the location block...${NC}"
    read
fi

# Test nginx config
echo ""
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
    
    # Reload nginx
    echo -e "${YELLOW}Reloading Nginx...${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${RED}❌ Nginx config has errors${NC}"
    echo -e "${YELLOW}Please fix the errors and run: sudo systemctl reload nginx${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 4: Test Webhook Endpoint${NC}"
echo "================================"

echo -e "${YELLOW}Testing local endpoint...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:9000/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test"}')

if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Local endpoint working (HTTP $RESPONSE)${NC}"
else
    echo -e "${RED}❌ Local endpoint failed (HTTP $RESPONSE)${NC}"
fi

echo ""
echo -e "${YELLOW}Testing HTTPS endpoint...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://dcpschool100.net/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test"}')

if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ HTTPS endpoint working (HTTP $RESPONSE)${NC}"
else
    echo -e "${RED}❌ HTTPS endpoint failed (HTTP $RESPONSE)${NC}"
    echo -e "${YELLOW}Check Nginx configuration${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Configure GitHub Webhook:"
echo "   URL: https://github.com/9golfy/thai-music-platform/settings/hooks"
echo ""
echo "2. Add webhook with these settings:"
echo "   - Payload URL: https://dcpschool100.net/webhook"
echo "   - Content type: application/json"
echo "   - Secret: $WEBHOOK_SECRET"
echo "   - Events: Just the push event"
echo ""
echo "3. Test by pushing code:"
echo "   git commit -m 'Test auto deploy'"
echo "   git push origin master"
echo ""
echo "4. Monitor logs:"
echo "   pm2 logs webhook-deploy"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""
