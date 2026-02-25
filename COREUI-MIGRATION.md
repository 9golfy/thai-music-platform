# CoreUI Dashboard Migration Guide

## Overview

This guide explains how to migrate the admin dashboard to use CoreUI React template with light theme.

## What's Been Created

### 1. New Layout with Sidebar Menu
**File:** `app/(admin)/dashboard/layout-new.tsx`

Features:
- ✅ Sidebar navigation with menu items
- ✅ Light theme
- ✅ Responsive design
- ✅ Collapsible sidebar
- ✅ Header with user info

Menu Structure:
1. Dashboard
2. โรงเรียนดนตรีไทย
   - โรงเรียนดนตรีไทย 100% → `/dashboard/register100`
   - โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย → `/dashboard/register-support`
3. Logout

### 2. Dashboard Home Page
**File:** `app/(admin)/dashboard/page-new.tsx`

Features:
- ✅ Statistics widgets
- ✅ Quick links to sub-pages
- ✅ Recent activities section
- ✅ Real-time data from API

### 3. Register100 Page
**File:** `app/(admin)/dashboard/register100/page-new.tsx`

Features:
- ✅ Wrapped in CoreUI Card
- ✅ Uses existing Register100DataTable component
- ✅ Consistent styling with dashboard

### 4. Register Support Page
**File:** `app/(admin)/dashboard/register-support/page.tsx`

Features:
- ✅ Placeholder page
- ✅ Ready for future development
- ✅ Consistent styling

## Migration Steps

### Step 1: Backup Current Files

```bash
# Backup current layout
cp app/(admin)/dashboard/layout.tsx app/(admin)/dashboard/layout.old.tsx

# Backup current pages
cp app/(admin)/dashboard/page.tsx app/(admin)/dashboard/page.old.tsx
cp app/(admin)/dashboard/register100/page.tsx app/(admin)/dashboard/register100/page.old.tsx
```

### Step 2: Replace Files

```bash
# Replace layout
mv app/(admin)/dashboard/layout-new.tsx app/(admin)/dashboard/layout.tsx

# Replace dashboard page
mv app/(admin)/dashboard/page-new.tsx app/(admin)/dashboard/page.tsx

# Replace register100 page
mv app/(admin)/dashboard/register100/page-new.tsx app/(admin)/dashboard/register100/page.tsx
```

### Step 3: Test the Application

```bash
# Start development server
npm run dev

# Visit http://localhost:3000/dashboard
```

### Step 4: Verify Functionality

- [ ] Sidebar menu displays correctly
- [ ] All menu items navigate properly
- [ ] Dashboard statistics load
- [ ] Register100 data table works
- [ ] Logout redirects to login
- [ ] Responsive design works on mobile
- [ ] Light theme applied correctly

## Customization

### Change Theme Colors

Edit `app/(admin)/dashboard/layout.tsx`:

```tsx
// Change sidebar color
<CSidebar
  className="border-end bg-primary" // Add bg-primary, bg-dark, etc.
>

// Change header color
<CHeader className="mb-4 bg-light">
```

### Add More Menu Items

Edit navigation array in `app/(admin)/dashboard/layout.tsx`:

```tsx
const navigation = [
  // ... existing items
  {
    component: CNavItem,
    name: 'New Menu Item',
    to: '/dashboard/new-page',
    icon: <CIcon icon={cilNewIcon} customClassName="nav-icon" />,
  },
];
```

### Customize Dashboard Widgets

Edit `app/(admin)/dashboard/page.tsx`:

```tsx
<CWidgetStatsA
  color="primary" // primary, info, warning, success, danger
  value="Your Value"
  title="Your Title"
  // ... other props
/>
```

## CoreUI Components Available

### Layout Components
- `CSidebar` - Sidebar navigation
- `CHeader` - Top header
- `CContainer` - Container wrapper
- `CRow`, `CCol` - Grid system

### UI Components
- `CCard`, `CCardBody`, `CCardHeader` - Card components
- `CButton` - Buttons
- `CTable` - Tables
- `CForm`, `CFormInput` - Forms
- `CModal` - Modals
- `CAlert` - Alerts
- `CBadge` - Badges
- `CProgress` - Progress bars

### Navigation Components
- `CNav`, `CNavItem`, `CNavLink` - Navigation
- `CBreadcrumb` - Breadcrumbs
- `CPagination` - Pagination

### Widgets
- `CWidgetStatsA` - Statistics widget
- `CWidgetStatsB` - Alternative stats widget
- `CWidgetStatsC` - Chart widget

## Documentation

- **CoreUI React:** https://coreui.io/react/docs/getting-started/introduction/
- **CoreUI Components:** https://coreui.io/react/docs/components/accordion/
- **CoreUI Icons:** https://icons.coreui.io/icons/

## Troubleshooting

### Issue: Styles not loading

**Solution:** Make sure CoreUI CSS is imported in layout:
```tsx
import '@coreui/coreui/dist/css/coreui.min.css';
```

### Issue: Icons not displaying

**Solution:** Check icon imports:
```tsx
import CIcon from '@coreui/icons-react';
import { cilSpeedometer } from '@coreui/icons';
```

### Issue: Sidebar not responsive

**Solution:** Ensure proper viewport meta tag in `app/layout.tsx`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Issue: Navigation not working

**Solution:** Use Next.js router instead of href:
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
onClick={() => router.push('/path')}
```

## Rollback Plan

If you need to rollback:

```bash
# Restore old files
mv app/(admin)/dashboard/layout.old.tsx app/(admin)/dashboard/layout.tsx
mv app/(admin)/dashboard/page.old.tsx app/(admin)/dashboard/page.tsx
mv app/(admin)/dashboard/register100/page.old.tsx app/(admin)/dashboard/register100/page.tsx

# Uninstall CoreUI (optional)
npm uninstall @coreui/react @coreui/coreui @coreui/icons @coreui/icons-react
```

## Next Steps

1. ✅ Test all functionality
2. ⏳ Migrate remaining admin pages
3. ⏳ Add user authentication
4. ⏳ Implement role-based access control
5. ⏳ Add more dashboard widgets
6. ⏳ Customize theme colors
7. ⏳ Add dark mode toggle (optional)

## Support

For issues or questions:
- Check CoreUI documentation
- Review Next.js App Router docs
- Check browser console for errors

---

**Last Updated:** February 24, 2026  
**Version:** 1.0
