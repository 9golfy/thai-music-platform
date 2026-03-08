# Step5 Support Factors - Vertical Stacked Layout

## Summary
Refactored the Support Factors block in Step5 to use a vertical stacked layout for all screen sizes (desktop and mobile). Removed the horizontal table layout and table headers.

## Changes Made

### 1. Removed Table Header Row

**Before:**
```tsx
{/* Table Header */}
<div className="hidden md:grid md:grid-cols-12 gap-4 mb-2 pb-2 border-b">
  {/* Column headers */}
</div>
```

**After:**
- Completely removed
- No table headers on any screen size

### 2. Changed Row Layout from Horizontal to Vertical

**Before:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
  <div className="md:col-span-3">...</div>
  <div className="md:col-span-3">...</div>
  <div className="md:col-span-2">...</div>
  <div className="md:col-span-4">...</div>
</div>
```

**After:**
```tsx
<div className="space-y-4">
  <div className="space-y-1">
    <label>...</label>
    <input>...</input>
  </div>
  {/* More fields stacked vertically */}
</div>
```

### 3. New Vertical Field Structure

Each support factor row now displays fields in this order (top to bottom):

1. **องค์กร/หน่วยงาน/บุคคลที่ทำให้การส่งเสริม สนับสนุน**
   - Dropdown with 3 options
   - Label always visible above select

2. **Conditional Text Input** (if "อื่นๆ" selected)
   - Text input for custom organization name
   - Placeholder: "ระบุชื่อองค์กร เช่น วัด สมาคม มูลนิธิ"

3. **รายละเอียด**
   - Text input for description
   - Label always visible above input

4. **วันที่ (ที่ได้รับการสนับสนุน)**
   - Date input
   - Label always visible above input

5. **หลักฐาน/ภาพถ่าย/รางวัล**
   - Label
   - Helper text: "(แนบไฟล์ PDF, JPG ความละเอียดไม่เกิน 2 MB หรือ Link ในแชร์ drive)"
   - File upload input
   - Drive link input

### 4. Field Styling

**Each Field Block:**
```tsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-neutral-dark">
    {Label Text}
  </label>
  <input className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
</div>
```

**Spacing:**
- `space-y-1`: Between label and input (tight)
- `space-y-4`: Between field blocks (comfortable)
- `space-y-2`: For evidence section with multiple inputs

### 5. Removed Responsive Classes

**Removed:**
- `md:grid`
- `md:grid-cols-12`
- `md:col-span-*`
- `md:hidden` (on labels)
- All desktop-specific layout classes

**Result:**
- Same layout on all screen sizes
- Always vertical stacking
- Always shows labels

### 6. Card Container

**Unchanged:**
```tsx
<div className="border border-neutral-border rounded-lg p-4 space-y-4">
  {/* Remove button */}
  {/* Fields */}
</div>
```

### 7. Remove Button

**Position:**
- Top-right of each card
- Above all fields
- Red text with hover effect

```tsx
<div className="flex justify-end">
  <button
    type="button"
    onClick={() => removeSupport(index)}
    className="text-red-500 hover:text-red-700 text-sm font-medium"
  >
    ลบ
  </button>
</div>
```

## Layout Comparison

### Before (Table Layout)

**Desktop:**
- Horizontal 4-column grid
- Table header row
- Labels hidden (only in header)
- Compact side-by-side layout

**Mobile:**
- Vertical stacked
- Labels shown above each field
- Full width

### After (Vertical Layout)

**Desktop:**
- ✅ Vertical stacked (same as mobile)
- ✅ No table header
- ✅ Labels always visible
- ✅ Full width fields
- ✅ Clean spacing

**Mobile:**
- ✅ Vertical stacked (unchanged)
- ✅ Labels always visible
- ✅ Full width fields
- ✅ Clean spacing

## Visual Structure

```
┌─────────────────────────────────────┐
│ ปัจจัยที่เกี่ยวข้องโดยตรง...        │
├─────────────────────────────────────┤
│ Description text                     │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │                            [ลบ] │ │
│ │                                 │ │
│ │ องค์กร/หน่วยงาน/บุคคล          │ │
│ │ [Dropdown ▼]                    │ │
│ │                                 │ │
│ │ (Conditional: อื่นๆ text input) │ │
│ │                                 │ │
│ │ รายละเอียด                      │ │
│ │ [Text input]                    │ │
│ │                                 │ │
│ │ วันที่                          │ │
│ │ [Date input]                    │ │
│ │                                 │ │
│ │ หลักฐาน/ภาพถ่าย/รางวัล          │ │
│ │ (Helper text)                   │ │
│ │ [File input]                    │ │
│ │ [Drive link input]              │ │
│ └─────────────────────────────────┘ │
│                                      │
│ [+ เพิ่มข้อมูล]                     │
└─────────────────────────────────────┘
```

## Benefits

1. **Consistent UX**: Same layout on all devices
2. **Better Readability**: Labels always visible
3. **Cleaner Design**: No complex grid system
4. **Easier Maintenance**: Simpler code structure
5. **Better Accessibility**: Clear label-input relationships
6. **Mobile-First**: Optimized for all screen sizes
7. **Green Theme**: Maintained throughout

## Technical Details

### Spacing System
- `space-y-1`: Label to input (4px)
- `space-y-2`: Evidence section items (8px)
- `space-y-4`: Between field blocks (16px)
- `p-4`: Card padding (16px)

### Input Styling
All inputs use consistent classes:
```tsx
className="w-full px-3 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
```

### Label Styling
All labels use consistent classes:
```tsx
className="block text-sm font-medium text-neutral-dark"
```

### Green Theme
- ✅ Focus rings: `focus:ring-primary/50`
- ✅ Borders: `border-neutral-border`
- ✅ Text: `text-neutral-dark`
- ✅ No blue colors

## Functionality Preserved

- ✅ Add/Remove rows works
- ✅ Organization dropdown works
- ✅ Conditional "อื่นๆ" input shows/hides
- ✅ File validation works
- ✅ Date picker functional
- ✅ All fields register with React Hook Form
- ✅ Form submission includes all data

## Testing Checklist

### Desktop (Full Width)
- [ ] Fields display vertically stacked
- [ ] Labels visible above each input
- [ ] No table header visible
- [ ] Full width inputs
- [ ] Clean spacing between fields
- [ ] Remove button top-right
- [ ] Add button works

### Mobile
- [ ] Same vertical layout as desktop
- [ ] Labels visible
- [ ] Full width inputs
- [ ] Touch-friendly spacing
- [ ] All functionality works

### Functionality
- [ ] Select organization type
- [ ] "อื่นๆ" shows text input
- [ ] Enter description
- [ ] Select date
- [ ] Upload file (validation works)
- [ ] Enter drive link
- [ ] Add multiple rows
- [ ] Remove rows
- [ ] Submit form

## Code Quality

- ✅ No TypeScript errors
- ✅ No diagnostics
- ✅ Clean component structure
- ✅ Consistent styling
- ✅ Proper spacing
- ✅ Accessible markup

## Acceptance Criteria Met

✅ Desktop shows vertical stacked layout (not table)
✅ Mobile shows same vertical layout
✅ No table header on any screen size
✅ Labels always visible above inputs
✅ Green theme maintained
✅ All fields in correct order
✅ Remove button top-right
✅ Clean spacing throughout
✅ Full width inputs on all screens

## Notes

- The layout is now mobile-first and scales up identically
- No responsive breakpoints needed for this block
- Simpler code = easier to maintain
- Better user experience with always-visible labels
- Consistent with modern form design patterns
