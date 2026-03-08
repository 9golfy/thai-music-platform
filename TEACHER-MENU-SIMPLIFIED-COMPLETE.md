# Teacher Menu Simplified - Complete

## Summary
Simplified the teacher sidebar menu to only 3 main items (Dashboard, ข้อมูลโรงเรียน, ใบประกาศนียบัตร) plus Logout, and updated the header to show only the page title with a hamburger menu button.

## Changes Made

### 1. Sidebar Menu - Simplified

#### Before (5 items)
- Dashboard
- โรงเรียนดนตรีไทย 100%
- โรงเรียนสนับสนุนและส่งเสริม
- User Management
- e-Certificate

#### After (3 items + Logout)
- **Dashboard** - Home icon
- **ข้อมูลโรงเรียน** - Building icon
- **ใบประกาศนียบัตร** - Certificate icon
- **Logout** - Exit icon (at bottom)

### 2. Header - Simplified

#### Before
- Page title
- User info with avatar
- User name and role

#### After
- Hamburger menu button (mobile)
- Page title only: "ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์"
- Clean, minimal design

### 3. School Info Page

Created a redirect page that:
1. Gets the teacher's school ID from session
2. Finds the submission (register100 or register-support)
3. Redirects to the appropriate detail view

**Route**: `/teacher/school-info`
**Redirects to**: `/teacher/dashboard/[type]/[id]`

## Menu Structure

```
┌─────────────────────────────────┐
│  [Logo]  โครงการคัดเลือก...    │
│          สนับสนุนโรงเรียน...    │
│          ๑๐๐ เปอร์เซ็นต์       │
├─────────────────────────────────┤
│  โรงเรียนดนตรีไทย              │
├─────────────────────────────────┤
│  🏠 Dashboard                   │
│  🏢 ข้อมูลโรงเรียน              │
│  ✓  ใบประกาศนียบัตร            │
│                                  │
│  (bottom)                        │
│  ➡️ Logout                      │
└─────────────────────────────────┘
```

## Header Structure

```
┌──────────────────────────────────────────────────────────┐
│ ☰  ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย...  │
└──────────────────────────────────────────────────────────┘
```

## Navigation Flow

### Dashboard
```
/teacher/dashboard
→ Shows welcome page with school info
→ Quick access to view submission
```

### ข้อมูลโรงเรียน (School Info)
```
/teacher/school-info
→ Finds submission by schoolId
→ Redirects to /teacher/dashboard/[type]/[id]
→ Shows full submission details (read-only, no scores)
```

### ใบประกาศนียบัตร (Certificate)
```
/teacher/certificate
→ Shows certificate page
→ Download/view certificate
```

### Logout
```
→ Calls /api/auth/logout
→ Redirects to /teacher-login
```

## Component Updates

### TeacherSidebar.tsx
```typescript
const menuItems = [
  {
    href: '/teacher/dashboard',
    label: 'Dashboard',
    icon: <HomeIcon />
  },
  {
    href: '/teacher/school-info',
    label: 'ข้อมูลโรงเรียน',
    icon: <BuildingIcon />
  },
  {
    href: '/teacher/certificate',
    label: 'ใบประกาศนียบัตร',
    icon: <CertificateIcon />
  },
];
```

### TeacherHeader.tsx
```typescript
<header>
  <button>☰</button>  {/* Mobile menu */}
  <h1>ระบบบริหารจัดการข้อมูลกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</h1>
  <div></div>  {/* Empty space for balance */}
</header>
```

## Visual Design

### Colors (Unchanged)
- **Sidebar Background**: Green gradient (green-600 to green-700)
- **Active State**: White 20% opacity with shadow
- **Hover State**: White 10% opacity
- **Text**: White and green shades

### Typography
- **Header Title**: 
  - Desktop: text-xl (20px)
  - Mobile: text-lg (18px)
  - Font weight: Semibold
  - Color: Gray-800

### Spacing
- **Menu Items**: py-3 (12px vertical padding)
- **Icon-Text Gap**: gap-3 (12px)
- **Menu Item Margin**: mb-1 (4px bottom margin)

## Responsive Behavior

### Desktop
- Sidebar: Fixed 256px width
- Header: Offset by sidebar width (left-64)
- Hamburger menu: Hidden

### Mobile (Future)
- Sidebar: Collapsible/overlay
- Header: Full width
- Hamburger menu: Visible

## User Experience

### Simplified Navigation
- **3 clear options** instead of 5
- **Logical grouping**: Dashboard → School Info → Certificate
- **Easy to understand** for teachers
- **Less cognitive load**

### Direct Access
- "ข้อมูลโรงเรียน" directly shows their submission
- No need to choose between register100 or register-support
- System automatically detects the correct type

### Clean Header
- **Focus on content** - no distractions
- **Professional appearance**
- **Consistent with admin theme**

## Files Created/Modified

### Created
- ✅ `app/(teacher)/teacher/school-info/page.tsx` - Redirect page to submission detail

### Modified
- ✅ `components/teacher/TeacherSidebar.tsx` - Simplified to 3 menu items
- ✅ `components/teacher/TeacherHeader.tsx` - Simplified to title only

## Testing Checklist
- [ ] Dashboard link works
- [ ] ข้อมูลโรงเรียน redirects to correct detail view
- [ ] ใบประกาศนียบัตร link works
- [ ] Logout button functions correctly
- [ ] Active state highlights current page
- [ ] Hover states work on all menu items
- [ ] Header displays correctly on desktop
- [ ] Header displays correctly on mobile
- [ ] Hamburger menu button visible on mobile
- [ ] Page title is readable and properly formatted

## Next Steps
None - feature is complete and ready for testing.
