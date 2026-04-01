#!/bin/bash

# Check Deploy Status Script
# ใช้สำหรับตรวจสอบสถานะการ deploy

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SERVER_IP="164.115.41.34"
SERVER_USER="ubuntu"
APP_DIR="/home/ubuntu/thai-music-platform"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Check Deploy Status${NC}"
echo -e "${BLUE}Server: $SERVER_IP${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. Check if TEST-DEPLOY.md exists on server
echo -e "${YELLOW}1. Checking if test file exists on server...${NC}"
if ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "test -f $APP_DIR/TEST-DEPLOY.md" 2>/dev/null; then
    echo -e "${GREEN}✅ Test file found on server!${NC}"
    echo ""
    echo -e "${BLUE}File content:${NC}"
    ssh $SERVER_USER@$SERVER_IP "head -20 $APP_DIR/TEST-DEPLOY.md"
    echo ""
else
    echo -e "${RED}❌ Test file not found on server${NC}"
    echo -e "${YELLOW}This could mean:${NC}"
    echo -e "   - Deploy hasn't completed yet (wait 2-3 minutes)"
    echo -e "   - GitHub Actions failed (check GitHub → Actions)"
    echo -e "   - SSH connection issue"
    echo ""
fi

# 2. Check PM2 status
echo -e "${YELLOW}2. Checking PM2 status...${NC}"
if ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "pm2 status" 2>/dev/null; then
    echo -e "${GREEN}✅ PM2 is running${NC}"
    echo ""
else
    echo -e "${RED}❌ Cannot connect to PM2${NC}"
    echo ""
fi

# 3. Check application health
echo -e "${YELLOW}3. Checking application health...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP/api/health 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Application is healthy (HTTP $HTTP_CODE)${NC}"
    echo ""
    echo -e "${BLUE}Response:${NC}"
    curl -s http://$SERVER_IP/api/health | jq . 2>/dev/null || curl -s http://$SERVER_IP/api/health
    echo ""
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}❌ Cannot connect to application${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Application returned HTTP $HTTP_CODE${NC}"
    echo ""
fi

# 4. Check recent PM2 logs
echo -e "${YELLOW}4. Checking recent PM2 logs...${NC}"
if ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "pm2 logs thai-music --lines 10 --nostream" 2>/dev/null; then
    echo -e "${GREEN}✅ Logs retrieved${NC}"
    echo ""
else
    echo -e "${RED}❌ Cannot retrieve logs${NC}"
    echo ""
fi

# 5. Check last git commit on server
echo -e "${YELLOW}5. Checking last git commit on server...${NC}"
REMOTE_COMMIT=$(ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "cd $APP_DIR && git log -1 --format='%h - %s (%ar)'" 2>/dev/null || echo "Cannot retrieve")
echo -e "${BLUE}Server commit:${NC} $REMOTE_COMMIT"

LOCAL_COMMIT=$(git log -1 --format='%h - %s (%ar)' 2>/dev/null || echo "Cannot retrieve")
echo -e "${BLUE}Local commit:${NC}  $LOCAL_COMMIT"
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$HTTP_CODE" = "200" ] && ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "test -f $APP_DIR/TEST-DEPLOY.md" 2>/dev/null; then
    echo -e "${GREEN}🎉 Auto deploy is working!${NC}"
    echo ""
    echo -e "✅ Test file deployed successfully"
    echo -e "✅ Application is running"
    echo -e "✅ Health check passed"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "1. Check GitHub Actions logs for details"
    echo -e "2. Test your application features"
    echo -e "3. Monitor logs: ${GREEN}ssh $SERVER_USER@$SERVER_IP 'pm2 logs thai-music'${NC}"
else
    echo -e "${YELLOW}⚠️  Deploy status unclear${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "1. Check GitHub Actions: Go to repository → Actions tab"
    echo -e "2. Check if workflow completed successfully"
    echo -e "3. Review workflow logs for errors"
    echo -e "4. Verify GitHub Secrets are set correctly:"
    echo -e "   - SSH_HOST: $SERVER_IP"
    echo -e "   - SSH_USER: $SERVER_USER"
    echo -e "   - SSH_PRIVATE_KEY: (set)"
    echo -e "   - SSH_PORT: 22"
    echo ""
    echo -e "5. Manual check: ${GREEN}ssh $SERVER_USER@$SERVER_IP${NC}"
fi

echo ""
echo -e "${BLUE}🔗 Useful Links:${NC}"
echo -e "   Application: ${GREEN}http://$SERVER_IP${NC}"
echo -e "   Health Check: ${GREEN}http://$SERVER_IP/api/health${NC}"
echo -e "   SSH: ${GREEN}ssh $SERVER_USER@$SERVER_IP${NC}"
echo ""
