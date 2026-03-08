# Delete regist-100 - Safe Removal Plan

## Current Usage Analysis

### ✅ Safe to Delete (No Impact)
These files/folders can be deleted without affecting current system:

1. **Page Files**
   - `app/(front)/regist-100/` (entire folder)

2. **API Files**
   - `app/api/register-100/` (entire folder)

3. **Component Files**
   - `components-regist/` (entire folder - old Register69 form)

### ⚠️ Need Updates (References to regist-100)

#### 1. Test Files (8 files)
These tests reference `/regist-100` URL:
- `tests/teacher-score-test.spec.ts`
- `tests/register100-regression.spec.ts`
- `tests/register-100.spec.ts`
- `tests/register-100-selenium.test.ts`
- `tests/full-form-test.spec.ts`
- `tests/check-autocomplete-css.spec.ts`
- `tests/run-selenium-test.bat`

**Action:** Update URLs from `/regist-100` to `/regist100` (current active form)

#### 2. Documentation Files (4 files)
- `README.md`
- `MIGRATION_GUIDE.md`
- `FRONTEND-CSS-FIX.md`
- `CLONE-REGIST-SUPPORT-GUIDE.md`

**Action:** Update documentation to reflect current structure

#### 3. Security Testing Config
- `security-testing/config/targets.json`

**Action:** Remove `/regist-100` from targets, keep `/regist100`

#### 4. Package.json
- Script: `test:selenium`

**Action:** Update script to use correct test file

## Deletion Steps

### Step 1: Backup (Optional)
```powershell
# Create backup
New-Item -ItemType Directory -Force -Path "backup-regist-100"
Copy-Item -Path "app/(front)/regist-100" -Destination "backup-regist-100/" -Recurse
Copy-Item -Path "app/api/register-100" -Destination "backup-regist-100/" -Recurse
Copy-Item -Path "components-regist" -Destination "backup-regist-100/" -Recurse
```

### Step 2: Delete Folders
```powershell
# Delete page folder
Remove-Item -Recurse -Force "app/(front)/regist-100"

# Delete API folder
Remove-Item -Recurse -Force "app/api/register-100"

# Delete old components folder
Remove-Item -Recurse -Force "components-regist"
```

### Step 3: Update Test Files

**Find & Replace in all test files:**
```
/regist-100  →  /regist100
```

Files to update:
- tests/teacher-score-test.spec.ts
- tests/register100-regression.spec.ts
- tests/register-100.spec.ts
- tests/register-100-selenium.test.ts
- tests/full-form-test.spec.ts
- tests/check-autocomplete-css.spec.ts

### Step 4: Update Documentation

**README.md**
```diff
- │   └── regist-100/      # ลงทะเบียน (from regist)
+ │   ├── regist100/       # ลงทะเบียนโรงเรียนดนตรีไทย 100%
+ │   └── regist-support/  # ลงทะเบียนโรงเรียนสนับสนุนฯ

- - `/regist` → `app/(front)/regist-100/` และ `app/api/register-100/`
+ - `/regist` → `app/(front)/regist100/` และ `app/api/register100/`
```

**MIGRATION_GUIDE.md**
```diff
- - ✅ `/regist-100` - ลงทะเบียน (จาก regist)
+ - ✅ `/regist100` - ลงทะเบียนโรงเรียนดนตรีไทย 100%
+ - ✅ `/regist-support` - ลงทะเบียนโรงเรียนสนับสนุนฯ

- - ✅ `/api/register-100` - API สำหรับลงทะเบียน (เปลี่ยนจาก register-69)
+ - ✅ `/api/register100` - API สำหรับลงทะเบียนโรงเรียนดนตรีไทย 100%
+ - ✅ `/api/register-support` - API สำหรับลงทะเบียนโรงเรียนสนับสนุนฯ

- - http://localhost:3000/regist-100 - Registration form
+ - http://localhost:3000/regist100 - Registration form (โรงเรียนดนตรีไทย 100%)
+ - http://localhost:3000/regist-support - Registration form (โรงเรียนสนับสนุนฯ)
```

### Step 5: Update Security Config

**security-testing/config/targets.json**
```diff
  "public_pages": [
    "/",
    "/about",
-   "/regist-100",
+   "/regist100",
+   "/regist-support",
    "/certificate",
    "/download"
  ]
```

### Step 6: Update Package.json

**package.json**
```diff
  "scripts": {
-   "test:selenium": "ts-node tests/register-100-selenium.test.ts"
+   "test:selenium": "ts-node tests/register100-selenium.test.ts"
  }
```

Or remove if not used.

### Step 7: Rename Test File (Optional)

```powershell
# Rename test file to match new convention
Move-Item "tests/register-100.spec.ts" "tests/register100-basic.spec.ts"
Move-Item "tests/register-100-selenium.test.ts" "tests/register100-selenium.test.ts"
```

## Verification Checklist

After deletion, verify:

- [ ] No 404 errors when visiting `/regist100`
- [ ] No 404 errors when visiting `/regist-support`
- [ ] Tests run successfully with updated URLs
- [ ] No broken links in documentation
- [ ] API endpoints work: `/api/register100` and `/api/register-support`
- [ ] No import errors in components
- [ ] Dev server starts without errors

## Commands to Run

```powershell
# 1. Delete folders
Remove-Item -Recurse -Force "app/(front)/regist-100"
Remove-Item -Recurse -Force "app/api/register-100"
Remove-Item -Recurse -Force "components-regist"

# 2. Search for remaining references
rg "regist-100" --type ts --type tsx

# 3. Restart dev server
npm run dev

# 4. Test URLs
# Visit: http://localhost:3000/regist100
# Visit: http://localhost:3000/regist-support

# 5. Run tests (after updating URLs)
npm run test
```

## Impact Assessment

### ✅ No Impact On:
- Current production forms (`/regist100`, `/regist-support`)
- Dashboard functionality
- Database (separate collections)
- User experience

### ⚠️ Requires Updates:
- Test files (8 files) - URL changes
- Documentation (4 files) - Content updates
- Security config (1 file) - Target list
- Package.json (1 file) - Script update

### 🗑️ Will Be Removed:
- Old registration form (Register69)
- Unused API endpoints
- Deprecated page routes

## Rollback Plan

If issues occur:
```powershell
# Restore from backup
Copy-Item -Path "backup-regist-100/*" -Destination "./" -Recurse -Force
```

## Timeline

- **Preparation:** 5 minutes (backup)
- **Deletion:** 2 minutes
- **Updates:** 15 minutes (tests + docs)
- **Verification:** 10 minutes
- **Total:** ~30 minutes

---

**Status:** Ready to execute  
**Risk Level:** Low (with proper updates)  
**Recommended:** Yes, safe to delete after updates
