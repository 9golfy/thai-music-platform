# Test Auto Deploy

## Test Information

- **Date**: 2026-04-01
- **Purpose**: Test GitHub Actions auto deploy
- **Target Server**: 164.115.41.34

## Test Results

### Test 1: Initial Push
- Status: Testing...
- Time: Pending
- Result: Pending

---

## Expected Workflow

1. Push this file to GitHub
2. GitHub Actions triggers automatically
3. Actions SSH to server 164.115.41.34
4. Server pulls latest code
5. Server builds application
6. Server restarts PM2
7. Deploy complete!

---

## How to Check

### 1. Check GitHub Actions
- Go to: https://github.com/YOUR_REPO/actions
- Look for latest workflow run
- Check logs

### 2. Check Server
```bash
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 20'
```

### 3. Check Application
```bash
curl http://164.115.41.34/api/health
```

---

## Notes

If this file appears on the server, auto deploy is working! ✅
