# Docker Rebuild & Testing Guide

## Available Scripts

### 1. 🔄 Quick Restart (Recommended for most cases)
```powershell
./docker-restart.ps1
```
**What it does:**
- Stops all containers
- Starts all containers
- Waits for services to be ready
- Shows container status

**Use when:**
- You made code changes and want to restart
- Services are acting weird
- Quick refresh needed

---

### 2. 🔨 Rebuild with Options (Interactive)
```powershell
./rebuild-and-test.ps1
```
**What it does:**
- Stops all containers
- Asks if you want to clean MongoDB data
- Rebuilds containers (no cache)
- Starts containers
- Shows logs and status
- Offers to run tests automatically

**Use when:**
- You want control over what gets cleaned
- You want to rebuild after major changes
- You want to run tests immediately after rebuild

---

### 3. 🧹 Complete Clean Rebuild (Nuclear option)
```powershell
./docker-clean-rebuild.ps1
```
**What it does:**
- Stops and removes ALL containers
- Removes ALL Docker images
- Deletes ALL MongoDB data
- Cleans uploads folder
- Rebuilds everything from scratch
- Starts fresh containers

**Use when:**
- Something is seriously broken
- You want a completely fresh start
- Testing from absolute zero state
- Docker cache is causing issues

---

## Manual Docker Commands

### Stop containers
```powershell
docker-compose down
```

### Stop and remove volumes
```powershell
docker-compose down -v
```

### Build without cache
```powershell
docker-compose build --no-cache
```

### Start containers
```powershell
docker-compose up -d
```

### View logs (follow mode)
```powershell
docker-compose logs -f
```

### View logs for specific service
```powershell
docker-compose logs -f nextjs
docker-compose logs -f mongodb
```

### Check container status
```powershell
docker-compose ps
```

### Restart specific service
```powershell
docker-compose restart nextjs
docker-compose restart mongodb
```

### Access MongoDB shell
```powershell
docker exec -it mongodb mongosh
```

### View MongoDB databases
```powershell
docker exec -it mongodb mongosh --eval "show dbs"
```

### Check submissions count
```powershell
docker exec -it mongodb mongosh thai_music_school --eval "db.register_support_submissions.countDocuments()"
```

---

## Testing After Rebuild

### Run full automated test (9 teachers, 100 points)
```powershell
npx playwright test tests/regist-support-full-9teachers-db-check.spec.ts --headed
```

### Run quick test (2 teachers)
```powershell
npx playwright test tests/regist-support-2teachers-quick.spec.ts --headed
```

### Run 100 points test
```powershell
npx playwright test tests/regist-support-full-100points.spec.ts --headed
```

---

## Troubleshooting

### Containers won't start
```powershell
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :27017

# Kill process using port (replace PID)
taskkill /PID <PID> /F
```

### MongoDB connection issues
```powershell
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Next.js build issues
```powershell
# View Next.js logs
docker-compose logs nextjs

# Rebuild Next.js only
docker-compose build --no-cache nextjs
docker-compose up -d nextjs
```

### Clean everything (including Docker system)
```powershell
# Stop all containers
docker-compose down -v

# Remove all unused containers, networks, images
docker system prune -a --volumes

# Then rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## Application URLs

- **Frontend:** http://localhost:3000
- **Register Support Form:** http://localhost:3000/regist-support
- **Admin Dashboard:** http://localhost:3000/dashboard
- **Admin Login:** http://localhost:3000/login

---

## MongoDB Data Location

- **Data folder:** `./mongo-data/`
- **To backup:** Copy the entire `mongo-data` folder
- **To restore:** Replace `mongo-data` folder and restart containers

---

## Recent Fixes Applied

### ✅ Double Modal Display Fix
- Added `useRef` to track submission attempts
- Prevents duplicate form submissions
- Added logging to track modal display
- Guards against multiple state updates

### ✅ Image Display Fix
- Images stored as base64 in MongoDB
- Proper image rendering in detail view
- No external file dependencies

### ✅ Scoring System
- 100 points maximum achievable
- All scoring rules implemented correctly
- Verified in automated tests

---

## Quick Reference

| Task | Command |
|------|---------|
| Quick restart | `./docker-restart.ps1` |
| Rebuild with options | `./rebuild-and-test.ps1` |
| Complete clean | `./docker-clean-rebuild.ps1` |
| View logs | `docker-compose logs -f` |
| Stop containers | `docker-compose down` |
| Start containers | `docker-compose up -d` |
| Run full test | `npx playwright test tests/regist-support-full-9teachers-db-check.spec.ts --headed` |

---

## Notes

- Always wait 10-15 seconds after starting containers for services to be ready
- MongoDB data persists between restarts unless explicitly cleaned
- Use `--headed` flag with Playwright to see the browser during tests
- Check `test-results/` folder for screenshots after tests
