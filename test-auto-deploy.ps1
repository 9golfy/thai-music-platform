# Test Auto Deploy Script (PowerShell)
# ใช้สำหรับทดสอบว่า GitHub Actions ทำงานหรือไม่

$ErrorActionPreference = "Stop"

# Colors
function Write-Color {
    param($Text, $Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

Write-Color "========================================" "Blue"
Write-Color "Test Auto Deploy" "Blue"
Write-Color "========================================" "Blue"
Write-Host ""

# ตรวจสอบว่าอยู่ใน git repository
try {
    git rev-parse --git-dir | Out-Null
} catch {
    Write-Color "❌ Error: Not in a git repository" "Red"
    exit 1
}

# ตรวจสอบว่ามี uncommitted changes หรือไม่
$status = git status -s
if ($status) {
    Write-Color "📝 Found uncommitted changes" "Yellow"
    git status -s
    Write-Host ""
}

# สร้าง test file
$TEST_FILE = "TEST-DEPLOY.md"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$TEST_NUMBER = [int](Get-Date -UFormat %s)

Write-Color "📝 Updating test file..." "Yellow"

$content = @"
# Test Auto Deploy

## Test Information

- **Date**: $TIMESTAMP
- **Purpose**: Test GitHub Actions auto deploy
- **Target Server**: 164.115.41.34
- **Test Number**: $TEST_NUMBER

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
``````
Go to: https://github.com/YOUR_REPO/actions
Look for latest workflow run
Check logs
``````

### 2. Check Server (หลัง deploy เสร็จ)
``````bash
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 20'
``````

### 3. Check if this file exists on server
``````bash
ssh ubuntu@164.115.41.34 'cat /home/ubuntu/thai-music-platform/TEST-DEPLOY.md'
``````

### 4. Check Application
``````bash
curl http://164.115.41.34/api/health
``````

---

## Success Criteria

- ✅ GitHub Actions workflow runs without errors
- ✅ This file appears on server
- ✅ Application restarts successfully
- ✅ Health check returns 200 OK

---

**If you see this file on the server with timestamp: $TIMESTAMP**
**Then auto deploy is working! 🎉**
"@

$content | Out-File -FilePath $TEST_FILE -Encoding UTF8
Write-Color "✓ Test file updated" "Green"
Write-Host ""

# Git add
Write-Color "📦 Adding files to git..." "Yellow"
git add $TEST_FILE

# Git commit
$COMMIT_MSG = "test: Auto deploy test at $TIMESTAMP"
Write-Color "💾 Committing changes..." "Yellow"
git commit -m $COMMIT_MSG
Write-Color "✓ Committed: $COMMIT_MSG" "Green"
Write-Host ""

# ตรวจสอบ remote
$REMOTE = (git remote -v | Select-String "push" | ForEach-Object { $_.ToString().Split()[1] })
$BRANCH = git branch --show-current

Write-Color "📍 Repository Info:" "Blue"
Write-Host "   Remote: $REMOTE"
Write-Host "   Branch: $BRANCH"
Write-Host ""

# ถาม user ก่อน push
Write-Color "Ready to push to GitHub?" "Yellow"
Write-Host "This will trigger GitHub Actions to deploy to 164.115.41.34"
Write-Host ""
$response = Read-Host "Continue? (y/n)"

if ($response -ne "y" -and $response -ne "Y") {
    Write-Color "❌ Cancelled" "Red"
    exit 1
}

# Git push
Write-Color "🚀 Pushing to GitHub..." "Yellow"
git push origin $BRANCH

Write-Host ""
Write-Color "========================================" "Green"
Write-Color "✅ Test file pushed to GitHub!" "Green"
Write-Color "========================================" "Green"
Write-Host ""
Write-Color "📋 Next Steps:" "Blue"
Write-Host ""
Write-Color "1. Check GitHub Actions:" "Yellow"
Write-Host "   Go to your repository → Actions tab"
Write-Host "   Look for workflow: 'Deploy to Production'"
Write-Host "   Watch the logs in real-time"
Write-Host ""
Write-Color "2. Wait for deployment (2-3 minutes)" "Yellow"
Write-Host ""
Write-Color "3. Verify on server:" "Yellow"
Write-Color "   ssh ubuntu@164.115.41.34 'cat /home/ubuntu/thai-music-platform/TEST-DEPLOY.md'" "Green"
Write-Host ""
Write-Color "4. Check application:" "Yellow"
Write-Color "   curl http://164.115.41.34/api/health" "Green"
Write-Host ""
Write-Color "5. Check PM2 logs:" "Yellow"
Write-Color "   ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 20'" "Green"
Write-Host ""
Write-Color "🔗 Quick Links:" "Blue"
$repoUrl = $REMOTE -replace '.git$',''
Write-Host "   GitHub Actions: $repoUrl/actions"
Write-Host "   Application: http://164.115.41.34"
Write-Host "   Health Check: http://164.115.41.34/api/health"
Write-Host ""
