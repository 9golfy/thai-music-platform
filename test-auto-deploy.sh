#!/bin/bash

# Test Auto Deploy Script
# ใช้สำหรับทดสอบว่า GitHub Actions ทำงานหรือไม่

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Auto Deploy${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ตรวจสอบว่าอยู่ใน git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# ตรวจสอบว่ามี uncommitted changes หรือไม่
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}📝 Found uncommitted changes${NC}"
    git status -s
    echo ""
fi

# สร้าง test file
TEST_FILE="TEST-DEPLOY.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "${YELLOW}📝 Updating test file...${NC}"
cat > $TEST_FILE << EOF
# Test Auto Deploy

## Test Information

- **Date**: $TIMESTAMP
- **Purpose**: Test GitHub Actions auto deploy
- **Target Server**: 164.115.41.34
- **Test Number**: $(date +%s)

## Test Status

✅ File created and pushed to GitHub

---

## Expected Workflow

1. ✅ Push this file to GitHub
2. ⏳ GitHub Actions triggers automatically
3. ⏳ Actions SSH to server 164.115.41.34
4. ⏳ Server pulls latest code
5. ⏳ Server builds application
6. ⏳ Server restarts PM2
7. ⏳ Deploy complete!

---

## How to Check Results

### 1. Check GitHub Actions (ทันที)
\`\`\`
Go to: https://github.com/YOUR_REPO/actions
Look for latest workflow run
Check logs
\`\`\`

### 2. Check Server (หลัง deploy เสร็จ)
\`\`\`bash
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 20'
\`\`\`

### 3. Check if this file exists on server
\`\`\`bash
ssh ubuntu@164.115.41.34 'cat /home/ubuntu/thai-music-platform/TEST-DEPLOY.md'
\`\`\`

### 4. Check Application
\`\`\`bash
curl http://164.115.41.34/api/health
\`\`\`

---

## Success Criteria

- ✅ GitHub Actions workflow runs without errors
- ✅ This file appears on server
- ✅ Application restarts successfully
- ✅ Health check returns 200 OK

---

**If you see this file on the server with timestamp: $TIMESTAMP**
**Then auto deploy is working! 🎉**
EOF

echo -e "${GREEN}✓ Test file updated${NC}"
echo ""

# Git add
echo -e "${YELLOW}📦 Adding files to git...${NC}"
git add $TEST_FILE

# Git commit
COMMIT_MSG="test: Auto deploy test at $TIMESTAMP"
echo -e "${YELLOW}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"
echo -e "${GREEN}✓ Committed: $COMMIT_MSG${NC}"
echo ""

# ตรวจสอบ remote
REMOTE=$(git remote -v | grep push | awk '{print $2}')
BRANCH=$(git branch --show-current)

echo -e "${BLUE}📍 Repository Info:${NC}"
echo -e "   Remote: $REMOTE"
echo -e "   Branch: $BRANCH"
echo ""

# ถาม user ก่อน push
echo -e "${YELLOW}Ready to push to GitHub?${NC}"
echo -e "This will trigger GitHub Actions to deploy to 164.115.41.34"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Cancelled${NC}"
    exit 1
fi

# Git push
echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
git push origin $BRANCH

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Test file pushed to GitHub!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo -e "1. ${YELLOW}Check GitHub Actions:${NC}"
echo -e "   Go to your repository → Actions tab"
echo -e "   Look for workflow: 'Deploy to Production'"
echo -e "   Watch the logs in real-time"
echo ""
echo -e "2. ${YELLOW}Wait for deployment (2-3 minutes)${NC}"
echo ""
echo -e "3. ${YELLOW}Verify on server:${NC}"
echo -e "   ${GREEN}ssh ubuntu@164.115.41.34 'cat /home/ubuntu/thai-music-platform/TEST-DEPLOY.md'${NC}"
echo ""
echo -e "4. ${YELLOW}Check application:${NC}"
echo -e "   ${GREEN}curl http://164.115.41.34/api/health${NC}"
echo ""
echo -e "5. ${YELLOW}Check PM2 logs:${NC}"
echo -e "   ${GREEN}ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 20'${NC}"
echo ""
echo -e "${BLUE}🔗 Quick Links:${NC}"
echo -e "   GitHub Actions: ${REMOTE/\.git/}/actions"
echo -e "   Application: http://164.115.41.34"
echo -e "   Health Check: http://164.115.41.34/api/health"
echo ""
