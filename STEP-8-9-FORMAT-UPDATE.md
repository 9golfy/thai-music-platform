# Step 8 & 9 Format Update - RegisterSupportDetailView

## Summary
Updated Step 8 and Step 9 in RegisterSupportDetailView to match the format used in Register100DetailView.

## Changes Made

### 1. ActivityList Component Update
Updated the `ActivityList` component in `RegisterSupportDetailView.tsx` to match the Register100 format:

**Key Changes:**
- Added numbered circular badges (1, 2, 3...) on the left side of each activity item
- Changed layout from simple grid to flex layout with numbered badge
- Added `hasPlatform` prop to conditionally show platform field for PR activities
- Updated field labels to match Register100:
  - "ชื่อกิจกรรม" → "ชื่อกิจกรรม/งาน"
  - "วันที่" → "วันที่เผยแพร่"
  - "ลิงก์หลักฐาน" → "หลักฐานการเผยแพร่ (Link/URL)"
  - Added "แหล่งเผยแพร่/ประชาสัมพันธ์ในสื่อสังคมออนไลน์" for platform field

**Visual Changes:**
```
Before:
┌─────────────────────────────────────────────────┐
│ ชื่อกิจกรรม | วันที่ | ลิงก์หลักฐาน           │
└─────────────────────────────────────────────────┘

After:
┌─────────────────────────────────────────────────┐
│ ⓵ ชื่อกิจกรรม/งาน | วันที่เผยแพร่ | หลักฐาน  │
└─────────────────────────────────────────────────┘
```

### 2. Step 9 PR Activities Update
Added `hasPlatform` prop to the PR activities ActivityList to show the platform field:
- This ensures the platform field is displayed for PR activities
- Matches the behavior in Register100DetailView

## Files Modified
- `components/admin/RegisterSupportDetailView.tsx`

## Testing
To verify the changes:
1. Navigate to: http://localhost:3000/dcp-admin/dashboard/register-support/[id]
2. Check Step 8 - should see numbered badges (1, 2, 3...) for each activity
3. Check Step 9 - should see numbered badges and platform field for PR activities
4. Compare with: http://localhost:3000/dcp-admin/dashboard/register100/[id]
5. Both should now have the same format for Step 8 and 9

## Status
✅ Complete - Step 8 and 9 now match the Register100 format with numbered badges and consistent field labels.
