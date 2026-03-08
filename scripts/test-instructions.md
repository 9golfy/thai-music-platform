# 🧪 Complete Draft Flow Test Instructions

## Current Test Data
- **Email**: 9golfy@gmail.com
- **Phone**: 0899297983
- **Latest Draft Token**: c63bb98c-ee1a-4a03-a1e9-83c267009eb1
- **School Name**: "ssssssss11111111"
- **Consent Status**: ✅ Already consented in database

## Test Scenario 1: Incognito Mode (Cross-Device Simulation)

### Steps:
1. **Open incognito window**
2. **Navigate to draft link**:
   ```
   http://localhost:3000/draft/c63bb98c-ee1a-4a03-a1e9-83c267009eb1
   ```
3. **Enter OTP** (check email 9golfy@gmail.com)
4. **After OTP verification**, you should be redirected to `/regist100`

### Expected Results:
- ✅ **NO ConsentModal** should appear (user already consented)
- ✅ **School name field** should show "ssssssss11111111"
- ✅ **Green success message** should appear: "โหลดข้อมูลที่บันทึกไว้เรียบร้อยแล้ว"
- ✅ **Form should be on step 1**

### Debug Steps (if issues occur):
1. **Open Developer Tools** (F12)
2. **Check Console** for these logs:
   ```
   🔍 ConsentModal: Checking consent status...
   📱 LocalStorage consent: null
   📋 Draft data: Found
   📧 Draft email: 9golfy@gmail.com
   🌐 API response: {success: true, hasConsented: true}
   ✅ User has consented before, hiding modal
   ```
3. **Check localStorage** in Application tab:
   - `draft_register100` should contain form data
   - `register100_consent_accepted` should be "true"

## Test Scenario 2: Fresh Registration

### Steps:
1. **Clear all data**:
   ```javascript
   // Run in browser console
   localStorage.clear();
   ```
2. **Go to**: http://localhost:3000/regist100
3. **Fill school name**: "Test School New"
4. **Click "บันทึก Draft"**
5. **Enter email**: test@example.com (different email)
6. **Enter phone**: 0899297983
7. **Check email and follow OTP link**

### Expected Results:
- ✅ **ConsentModal should appear** (new user)
- ✅ **After clicking "ยอมรับ"**, form should show with saved data
- ✅ **School name** should be "Test School New"

## Troubleshooting Guide

### Issue: ConsentModal still appears in incognito
**Possible Causes:**
1. **Timing issue** - ConsentModal loads before OTP data
2. **API error** - Consent check fails
3. **Draft data missing** - OTP verification didn't save properly

**Debug Steps:**
1. Check console logs for ConsentModal debug messages
2. Verify localStorage has draft data
3. Test consent API manually:
   ```javascript
   fetch('/api/consent/check', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({email: '9golfy@gmail.com', submissionType: 'register100'})
   }).then(r => r.json()).then(console.log)
   ```

### Issue: Form fields are empty
**Possible Causes:**
1. **Form restoration timing** - React Hook Form not ready
2. **Draft data structure** - Incorrect data format
3. **Component mounting** - Form not fully initialized

**Debug Steps:**
1. Check console for form restoration logs
2. Verify draft data structure in localStorage
3. Check React Hook Form state

### Issue: Success message but wrong data
**Possible Causes:**
1. **Old localStorage data** - Cached from previous session
2. **Draft token mismatch** - Using wrong draft
3. **Data corruption** - Invalid JSON in localStorage

**Debug Steps:**
1. Clear localStorage and test again
2. Verify draft token matches latest in database
3. Check MongoDB data directly

## Manual Verification Commands

### Check Latest Draft:
```bash
node scripts/check-latest-draft.js
```

### Check Consent Status:
```bash
node scripts/test-consent-api.js
```

### Debug Complete Flow:
```bash
node scripts/debug-complete-flow.js
```

## Success Criteria
- ✅ ConsentModal appears only once per user per submission type
- ✅ Cross-device draft restoration works without consent interruption
- ✅ Form fields populate correctly with saved data
- ✅ No console errors during restoration process
- ✅ Success message appears confirming data load