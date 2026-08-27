# Thai Music Platform - Site Structure (Latest - June 2026)

## 🎯 Production Info
- **URL:** https://dcpschool100.net
- **Server:** root@041034-U
- **Path:** /var/www/thai-music-platform
- **PM2:** thai-music-platform
- **Latest Commit:** fd447a8 (Fix register-support score overwrite)

---

## 📊 System Overview

### Total Submissions
- **Register100:** ~1 schools
- **Register-Support:** ~408 schools (production)
- **Total Users:** Admins + Teachers
- **Certificates Issued:** Varies

### Key Features Status
✅ Draft system with OTP
✅ Multi-step forms (10 steps)
✅ Admin dashboard with stats
✅ Score management (auto + manual)
✅ Export to Excel/PDF
✅ Server-side filtering
✅ Smart pagination
✅ Certificate management
✅ User management
✅ Draft management
✅ Registration control

---

## 🏗️ Site Structure

### Public Pages
- `/` - Home
- `/about` - About
- `/regist100` ✅ - Register100 form
- `/regist-support` ✅ - Register-Support form
- `/draft/[token]` ✅ - Continue draft
- `/certificate` - Verify certificate
- `/contract` - Documents
- `/download` - Downloads

### Admin Portal (/dcp-admin)

#### Dashboard Pages
- `/dcp-admin` ✅ - Admin login
- `/dcp-admin/dashboard` ✅ - Overview with stats
- `/dcp-admin/dashboard/register100` ✅ - List all Register100
- `/dcp-admin/dashboard/register100/[id]` ✅ - View/Edit details
- `/dcp-admin/dashboard/register-support` ✅ - List all Register-Support
- `/dcp-admin/dashboard/register-support/[id]` ✅ - View/Edit details (with score editing)
- `/dcp-admin/dashboard/drafts` ✅ - Manage drafts
- `/dcp-admin/dashboard/users` ✅ - User management
- `/dcp-admin/dashboard/users/create` ✅ - Create user
- `/dcp-admin/dashboard/users/[id]` ✅ - Edit user
- `/dcp-admin/dashboard/certificates` ✅ - Certificate list
- `/dcp-admin/dashboard/certificates/create` ✅ - Create certificate
- `/dcp-admin/dashboard/certificates/[id]` ✅ - View certificate
- `/dcp-admin/dashboard/registration-control` ✅ - Enable/disable registration

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/admin-login` ✅
- `POST /api/auth/check-email` ✅
- `POST /api/auth/logout` ✅

### Draft System
- `POST /api/draft/save` ✅
- `GET /api/draft/[token]` ✅
- `POST /api/draft/[token]/request-otp` ✅
- `POST /api/draft/[token]/verify-otp` ✅
- `POST /api/draft/[token]/submit` ✅

### Register100
- `POST /api/register100` ✅
- `GET /api/register100/list?page=1&limit=10&province=&level=&search=` ✅
- `GET /api/register100/[id]` ✅
- `PUT /api/register100/[id]` ✅
- `DELETE /api/register100/[id]` ✅
- `GET /api/register100/[id]/export/pdf` ✅
- `GET /api/register100/[id]/export/excel` ✅

### Register-Support
- `POST /api/register-support` ✅
- `GET /api/register-support/list?page=1&limit=10&province=&level=&search=` ✅
- `GET /api/register-support/[id]` ✅
- `PUT /api/register-support/[id]` ✅ (with score preservation)
- `DELETE /api/register-support/[id]` ✅
- `GET /api/register-support/[id]/export/pdf` ✅
- `GET /api/register-support/[id]/export/excel` ✅

### Users & Certificates
- `GET/POST/PUT/DELETE /api/users/*` ✅
- `GET/POST/PUT/DELETE /api/certificates/*` ✅

### Admin
- `GET /api/admin/drafts` ✅
- `POST /api/admin/drafts/[id]/refresh-token` ✅
- `GET /api/registration/status` ✅
- `PUT /api/registration/settings` ✅

---

## 📊 Database Schema

### Collections
1. **users** - Admin/Teacher accounts
2. **draft_submissions** - Saved drafts with OTP
3. **register100_submissions** - Completed Register100
4. **register_support_submissions** - Completed Register-Support
5. **certificates** - Issued certificates
6. **registration_settings** - Registration on/off

### Key Fields (Register-Support)
```javascript
{
  // Scores (Part 1)
  teacher_qualification_score: Number,      // 0-20
  support_from_org_score: Number,           // 0-5
  support_from_external_score: Number,      // 0-15
  award_score: Number,                      // 0-20
  activity_within_province_internal_score,  // 0-5
  activity_within_province_external_score,  // 0-5
  activity_outside_province_score,          // 0-5
  pr_activity_score: Number,                // 0-5
  total_score: Number,                      // Part 1 total (0-80)
  
  // Scores (Part 2)
  video1_score: Number,                     // 0-50
  video2_score: Number,                     // 0-50
  
  // Admin Notes
  teacher_qualification_note: String,
  support_from_org_note: String,
  // ... (each score has a note field)
}
```

---

## 🎨 Components

### Admin Components
- `SchoolsDataTable.tsx` ✅ - Smart data table
- `Register100DetailView.tsx` ✅ - View/Edit Register100
- `RegisterSupportDetailView.tsx` ✅ - View/Edit with score editing
- `DashboardStats.tsx` ✅ - Statistics cards
- `GradeDistributionChart.tsx` ✅ - Grade charts
- `DeleteSchoolButton.tsx` ✅ - Confirm delete

### Form Components  
- `Register100Form.tsx` ✅ - 10-step wizard
- `RegisterSupportForm.tsx` ✅ - 10-step wizard
- `StepIndicator.tsx` ✅ - Progress indicator
- `FileUpload.tsx` ✅ - File uploader
- `OTPVerification.tsx` ✅ - OTP input

---

## ⚙️ Features Breakdown

### 1. Draft System ✅
- Auto-save every 30 seconds
- Email-based OTP verification
- 6-digit OTP with bcrypt hash
- Token expiry: 7 days
- Rate limit: 5 OTP per 30 minutes
- Max attempts: 5 wrong OTPs

### 2. Data Table ✅
- **Smart Pagination:**
  - Initial load: 10 items (fast)
  - Filter/search: Load all (accurate)
- **Server-side filtering:**
  - Province, Level, Search
- **Client-side filtering:**
  - Grade (requires calculation)
- **Export:** Excel/PDF

### 3. Score Management ✅

**Register100:**
- Auto-calculated from form data
- No manual editing
- Updates on data change

**Register-Support:**
- **Manual Edit Mode:** Admin edits scores directly → Preserved on save
- **Normal Edit Mode:** Edit other data → Scores recalculated
- Admin can add notes to each score
- API detects manual edits via presence of score fields in request

### 4. Grade Calculation ✅
**Register100 (max 200):**
- A: 160+ (ระดับดีเด่น)
- B: 140-159 (ระดับดีมาก)
- C: 120-139 (ระดับดี)
- D: 100-119 (ระดับชมเชย)
- F: 0-99 (ต่ำกว่าเกณฑ์)

**Register-Support (max 180):**
- A: 144+ (ระดับดีเด่น)
- B: 126-143 (ระดับดีมาก)
- C: 108-125 (ระดับดี)
- D: 90-107 (ระดับชมเชย)
- F: 0-89 (ต่ำกว่าเกณฑ์)

---

## 🛠️ Utility Scripts

### Backup & Restore
- `check-backup-data.js` - View backup contents
- `compare-backup-production.js` - Find missing data
- `restore-from-backup.js` - Restore deleted schools

### Score Verification
- `check-school-scores.js <id>` - Check single school
- `find-missing-scores.js` - Find all schools with issues

### Draft Management
- `generate-otp-for-draft.js <token>` - Generate new OTP
- `view-otp-for-draft.js <token>` - View OTP info
- `set-otp-123456.js` - Set test OTP
- `fix-invalid-drafts.js` - Cleanup expired

### Database Queries
- `check-draft-by-email.js <email>` - Find draft
- `search-email.js <email>` - Search everywhere

---

## 🐛 Fixed Issues

### Issue 1: Score Overwrite (fd447a8) ✅
**Problem:** Admin แก้คะแนน 5 → Save → เป็น 4  
**Cause:** API คำนวณใหม่ทุกครั้ง  
**Fix:** Detect manual scores, preserve them  
**File:** `app/api/register-support/[id]/route.ts`

### Issue 2: Performance (cf2a797) ✅
**Problem:** โหลด 408 โรงเรียนทุกครั้ง  
**Cause:** ไม่มี pagination  
**Fix:** Smart loading (10 first, full on filter)  
**Files:** `app/api/*/list/route.ts`, `SchoolsDataTable.tsx`

### Issue 3: Dashboard (ad81d33) ✅
**Problem:** แสดง 10 โรงเรียนแทน 408  
**Cause:** ใช้ paginated API  
**Fix:** เพิ่ม `?loadAll=true`  
**Files:** `dashboard/page.tsx`, `GradeDistributionChart.tsx`

---

## 🚀 Deployment Guide

### 1. Pull Latest Code
```bash
ssh root@041034-U
cd /var/www/thai-music-platform
git pull origin master
```

### 2. Install & Build
```bash
npm install
rm -rf .next  # If build issues
npm run build
```

### 3. Restart PM2
```bash
pm2 restart thai-music-platform
pm2 logs thai-music-platform --lines 50
```

### 4. Verify
- Check https://dcpschool100.net
- Test admin login
- Test data table filters
- Test score editing

---

## 📝 Recent Commits

```
fd447a8 - Fix register-support score overwrite issue
cf2a797 - Fix data table performance and items per page dropdown
ad81d33 - Fix dashboard showing only 10 schools
2465f73 - Fix pagination not showing on initial load
6929646 - Fix TypeScript error in retry button
```

---

## 🔐 Security

- JWT authentication
- bcrypt password hashing
- HttpOnly cookies
- Role-based access (Root/Admin)
- OTP rate limiting
- Email duplicate checking
- CSRF protection
- XSS prevention

---

## 📞 Support Commands

### MongoDB Direct
```javascript
// Check draft OTP
db.draft_submissions.findOne({ token: "..." })

// Reset OTP limit
db.draft_submissions.updateOne(
  { token: "..." },
  { $set: { 
    otpRequestCount: 0,
    lastOtpRequestAt: new Date(Date.now() - 31*60*1000)
  }}
)

// Extend draft
db.draft_submissions.updateOne(
  { token: "..." },
  { $set: { 
    expiresAt: new Date(Date.now() + 30*24*60*60*1000)
  }}
)
```

---

**Last Updated:** June 24, 2026  
**Maintained By:** Development Team
