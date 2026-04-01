#!/bin/bash

# Test Webhook Deployment
# Run this script to test if webhook is working

echo "🧪 Testing Webhook Deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test 1: Local endpoint
echo -e "${BLUE}Test 1: Local Endpoint (http://localhost:9000)${NC}"
echo "================================================"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:9000/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test","pusher":{"name":"test-user"}}')

if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASS - Local endpoint responding (HTTP $RESPONSE)${NC}"
else
    echo -e "${RED}✗ FAIL - Local endpoint not responding (HTTP $RESPONSE)${NC}"
fi

echo ""

# Test 2: Health check
echo -e "${BLUE}Test 2: Health Check${NC}"
echo "================================================"

HEALTH=$(curl -s http://localhost:9000/health)

if [ "$HEALTH" = "Webhook server is running" ]; then
    echo -e "${GREEN}✓ PASS - Health check OK${NC}"
    echo "  Response: $HEALTH"
else
    echo -e "${RED}✗ FAIL - Health check failed${NC}"
    echo "  Response: $HEALTH"
fi

echo ""

# Test 3: HTTPS endpoint (if on server)
echo -e "${BLUE}Test 3: HTTPS Endpoint (https://dcpschool100.net)${NC}"
echo "================================================"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://dcpschool100.net/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test","pusher":{"name":"test-user"}}' 2>/dev/null)

if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASS - HTTPS endpoint responding (HTTP $RESPONSE)${NC}"
elif [ "$RESPONSE" = "000" ]; then
    echo -e "${YELLOW}⚠ SKIP - Cannot reach HTTPS endpoint (not on server or DNS issue)${NC}"
else
    echo -e "${RED}✗ FAIL - HTTPS endpoint error (HTTP $RESPONSE)${NC}"
fi

echo ""

# Test 4: PM2 Status
echo -e "${BLUE}Test 4: PM2 Status${NC}"
echo "================================================"

if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "webhook-deploy"; then
        STATUS=$(pm2 list | grep "webhook-deploy" | awk '{print $10}')
        if [ "$STATUS" = "online" ]; then
            echo -e "${GREEN}✓ PASS - webhook-deploy is running${NC}"
        else
            echo -e "${RED}✗ FAIL - webhook-deploy status: $STATUS${NC}"
        fi
    else
        echo -e "${RED}✗ FAIL - webhook-deploy not found in PM2${NC}"
    fi
else
    echo -e "${YELLOW}⚠ SKIP - PM2 not installed${NC}"
fi

echo ""

# Test 5: Check logs
echo -e "${BLUE}Test 5: Recent Logs${NC}"
echo "================================================"

if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Last 10 lines from webhook-deploy:${NC}"
    pm2 logs webhook-deploy --lines 10 --nostream 2>/dev/null || echo "No logs available"
else
    echo -e "${YELLOW}⚠ SKIP - PM2 not installed${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Summary${NC}"
echo ""
echo "If all tests pass, your webhook is ready!"
echo ""
echo "Next steps:"
echo "1. Configure GitHub webhook at:"
echo "   https://github.com/9golfy/thai-music-platform/settings/hooks"
echo ""
echo "2. Test by pushing code:"
echo "   git commit -m 'Test auto deploy'"
echo "   git push origin master"
echo ""
echo "3. Monitor deployment:"
echo "   pm2 logs webhook-deploy"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
