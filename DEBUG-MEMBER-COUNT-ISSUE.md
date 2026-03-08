# Debug Member Count Issue

## 🚨 Problem
`supportTypeMemberCount` shows as empty string `""` in localStorage even after typing a number.

## 🔧 Debug Steps

### Step 1: Open the Form
1. Go to `http://localhost:3000/regist-support`
2. Open browser console (F12)

### Step 2: Fill the Form
1. Select a support type (e.g., "กลุ่ม")
2. Type a name in the corresponding field (e.g., "กลุ่มทดสอบ")
3. Type a number in the member count field (e.g., "25")

### Step 3: Run Debug Script
Copy and paste the content of `scripts/browser-debug-script.js` into the browser console.

### Step 4: Check Results
Look for these key indicators:

#### ✅ Good Signs:
- `Member count input type: "text"` (not "number")
- `Member count input value: "25"` (has the value you typed)
- `supportTypeMemberCount: "25"` in React Hook Form values
- `supportTypeMemberCount: "25"` in Complete Form Data

#### ❌ Bad Signs:
- `Member count input type: "number"` (should be "text")
- `Member count input value: ""` (empty even after typing)
- `supportTypeMemberCount: ""` in form values
- `Member count input disabled: true` (should be false for selected type)

### Step 5: Test Save Draft
1. Click "Save Draft" button
2. Enter email and phone
3. Check localStorage: `JSON.parse(localStorage.getItem("draft_register_support") || "{}")`
4. Look for `supportTypeMemberCount` field

## 🔍 Common Issues & Solutions

### Issue 1: Input Type is "number"
**Problem**: `type="number"` inputs behave strangely with empty values
**Solution**: Should be `type="text"` with `inputMode="numeric"`

### Issue 2: Field Not Registered
**Problem**: React Hook Form doesn't know about the field
**Solution**: Check if `register('supportTypeMemberCount')` is called correctly

### Issue 3: Field Clearing Logic
**Problem**: useEffect is clearing the field after user types
**Solution**: Check `isRestoringData` flag in clearing logic

### Issue 4: DOM Element Not Found
**Problem**: `getCompleteFormData` can't find the input element
**Solution**: Check if input has correct `name` attribute

## 🚀 Expected Fix Results

After fixing, you should see:
```javascript
// In localStorage
{
  "formData": {
    "supportType": "กลุ่ม",
    "supportTypeGroupName": "กลุ่มทดสอบ", 
    "supportTypeMemberCount": "25",  // ← This should NOT be empty!
    "supportTypeTitle": "กลุ่มทดสอบ"
  }
}
```

## 🔧 Quick Fixes to Try

### Fix 1: Force Text Input
In `Step1.tsx`, ensure all member count inputs use:
```tsx
type="text"
inputMode="numeric"
pattern="[0-9]*"
```

### Fix 2: Debug Form Registration
Add to component:
```tsx
useEffect(() => {
  console.log('Member count field registered:', form.formState.dirtyFields.supportTypeMemberCount);
  console.log('Member count value:', form.getValues('supportTypeMemberCount'));
}, [form.watch('supportTypeMemberCount')]);
```

### Fix 3: Check Field Clearing
Look for any `setValue('supportTypeMemberCount', '')` calls that might be clearing the field.

## 📞 If Still Not Working

1. Check browser network tab for API calls
2. Verify the API is receiving the correct data
3. Check if the issue is in frontend collection or backend storage
4. Test with different browsers
5. Clear browser cache and localStorage

## 🎯 Success Criteria

- ✅ User can type numbers in member count field
- ✅ Numbers are preserved when switching between fields
- ✅ Save draft preserves the member count
- ✅ localStorage shows the correct member count
- ✅ Draft restoration shows the correct member count