# Dashboard Troubleshooting Guide

## Current Issue
ไม่เห็น left menu และไม่มีข้อมูลแสดงในหน้า dashboard

## Root Cause Analysis

The dashboard files are correctly in place:
- ✅ `app/(admin)/dashboard/layout.tsx` - Contains CoreUI sidebar
- ✅ `app/(admin)/dashboard/page.tsx` - Contains dashboard widgets
- ✅ `app/layout.tsx` - Imports CoreUI CSS
- ✅ CoreUI packages installed in package.json

**Most likely causes:**
1. Browser cache is showing old version
2. Dev server needs restart to pick up new files
3. CSS not loading due to cache

## Solution Steps (ทำตามลำดับ)

### Step 1: Kill All Node Processes
```bash
# Windows PowerShell
taskkill /F /IM node.exe

# Or find and kill manually
Get-Process node | Stop-Process -Force
```

### Step 2: Clear Next.js Cache
```bash
# Delete .next folder
rm -rf .next

# Or Windows
Remove-Item -Recurse -Force .next
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

### Step 4: Clear Browser Cache
1. เปิด Browser DevTools (กด F12)
2. คลิกขวาที่ปุ่ม Refresh
3. เลือก "Empty Cache and Hard Reload" หรือ "ล้างแคชและโหลดใหม่"

### Step 5: Test Login
1. ไปที่: http://localhost:3000/login
2. กรอก:
   - Username: `root`
   - Password: `admin`
3. กด "เข้าสู่ระบบ"
4. ควรเห็น sidebar menu ด้านซ้าย

## Verification Checklist

### ✅ Check Files Exist
```bash
# Check layout file
cat app/(admin)/dashboard/layout.tsx | Select-String -Pattern "CSidebar"

# Check page file
cat app/(admin)/dashboard/page.tsx | Select-String -Pattern "CWidgetStatsA"

# Check root layout
cat app/layout.tsx | Select-String -Pattern "coreui"
```

### ✅ Check Browser Console
1. เปิด DevTools (F12)
2. ไปที่ tab "Console"
3. ดูว่ามี error สีแดงหรือไม่
4. ถ้ามี error ให้ copy มาให้ดู

### ✅ Check Network Tab
1. เปิด DevTools (F12)
2. ไปที่ tab "Network"
3. Refresh หน้า
4. ดูว่า CSS files โหลดหรือไม่:
   - `coreui.min.css` ควรมี status 200
   - ถ้า status 404 แสดงว่า CSS ไม่โหลด

### ✅ Check Elements Tab
1. เปิด DevTools (F12)
2. ไปที่ tab "Elements"
3. ดูว่ามี `<div class="sidebar">` หรือไม่
4. ถ้าไม่มี แสดงว่า layout ไม่ render

## Common Issues & Solutions

### Issue 1: "Cannot find module '@coreui/react'"
**Solution:**
```bash
npm install @coreui/coreui @coreui/react @coreui/icons @coreui/icons-react
```

### Issue 2: CSS not loading
**Solution:**
```bash
# Verify import in app/layout.tsx
cat app/layout.tsx | Select-String -Pattern "coreui"

# Should see:
# import '@coreui/coreui/dist/css/coreui.min.css'
```

### Issue 3: Sidebar shows but no content
**Solution:**
Check that you're logged in:
```javascript
// Open browser console and run:
localStorage.getItem('isAuthenticated')
// Should return: "true"
```

### Issue 4: Still showing old "แดชบอร์ด" text
**Solution:**
```bash
# Force delete old files
rm app/(admin)/dashboard/page-old.tsx
rm app/(admin)/dashboard/layout-old.tsx

# Clear cache
rm -rf .next
npm run dev
```

## Quick Diagnostic Commands

Run these in PowerShell to check everything:

```powershell
# 1. Check CoreUI is installed
npm list @coreui/react

# 2. Check files exist
Test-Path app/(admin)/dashboard/layout.tsx
Test-Path app/(admin)/dashboard/page.tsx

# 3. Check for old files
Get-ChildItem app/(admin)/dashboard/*-new.tsx
Get-ChildItem app/(admin)/dashboard/*-old.tsx

# 4. Check dev server is running
Get-Process node

# 5. Check port 3000 is in use
netstat -ano | findstr :3000
```

## Expected Behavior After Fix

1. ✅ Login page shows CoreUI styled form
2. ✅ After login, redirect to `/dashboard`
3. ✅ Sidebar visible on left with menu items:
   - Dashboard
   - โรงเรียนดนตรีไทย 100%
   - โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย
   - Logout
4. ✅ Dashboard shows 4 statistics cards
5. ✅ Dashboard shows "กิจกรรมล่าสุด" card
6. ✅ Dashboard shows 2 quick link cards
7. ✅ User name "Admin" shows in header

## Still Not Working?

If after following all steps above, the dashboard still doesn't show:

1. **Take screenshots:**
   - Login page
   - Dashboard page (what you see)
   - Browser console (F12 → Console tab)
   - Browser network tab (F12 → Network tab)

2. **Check these files and send output:**
```bash
# Show first 50 lines of layout
Get-Content app/(admin)/dashboard/layout.tsx | Select-Object -First 50

# Show first 30 lines of page
Get-Content app/(admin)/dashboard/page.tsx | Select-Object -First 30

# Show root layout imports
Get-Content app/layout.tsx | Select-Object -First 20
```

3. **Check browser:**
   - Try different browser (Chrome, Edge, Firefox)
   - Try incognito/private mode
   - Disable browser extensions

## Contact Info

If issue persists, provide:
- Screenshots of what you see
- Browser console errors
- Output of diagnostic commands above
- Browser name and version

---

**Last Updated:** February 24, 2026 22:17  
**Status:** Troubleshooting in progress
