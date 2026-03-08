# Navigation Links Analysis - DCP Admin Dashboard

## Issue Report
User reports that clicking on "User Management" and "e-Certificate" menu items redirects to Dashboard instead of their respective pages.

## Investigation Results

### 1. Navigation Configuration ✅
**File**: `app/(admin)/dcp-admin/dashboard/layout.tsx`

Navigation links are correctly configured:
- User Management: `/dcp-admin/dashboard/users` ✅
- e-Certificate: `/dcp-admin/dashboard/certificates` ✅

### 2. Page Files Exist ✅
Both page files exist and have proper exports:
- `app/(admin)/dcp-admin/dashboard/users/page.tsx` ✅
- `app/(admin)/dcp-admin/dashboard/certificates/page.tsx` ✅

### 3. Root Cause Found ⚠️

**Users Page** has role-based access control:
```tsx
export default async function UsersPage() {
  const session = await getSession();

  // Only root can access this page
  if (!session || !['root', 'admin'].includes(session.role)) {
    redirect('/dcp-admin/dashboard');  // ← REDIRECTS HERE
  }
  // ...
}
```

**Certificates Page** has NO access control:
```tsx
export default function CertificatesPage() {
  // No session check - should be accessible
  return (
    // ...
  );
}
```

## Possible Causes

### For Users Page:
1. **User role is not 'root' or 'admin'**
   - Current user might have a different role
   - Session might not be properly set
   - Role check is too restrictive

### For Certificates Page:
1. **Next.js routing cache issue**
   - Browser cache might be stale
   - Need to clear .next folder and restart
2. **Client-side navigation issue**
   - Using button with onClick instead of Link component
   - Router.push might not be working correctly

## Solutions

### Solution 1: Check User Role
Run this to check current user's role:
```javascript
// In browser console on dashboard page
fetch('/api/auth/session')
  .then(r => r.json())
  .then(data => console.log('Current role:', data.role));
```

### Solution 2: Update Users Page Access Control
If the current user should have access, update the role check:

**Current**:
```tsx
if (!session || !['root', 'admin'].includes(session.role)) {
  redirect('/dcp-admin/dashboard');
}
```

**Option A - Allow all authenticated users**:
```tsx
if (!session) {
  redirect('/dcp-admin');
}
// Remove role check - all logged-in users can access
```

**Option B - Add more roles**:
```tsx
if (!session || !['root', 'admin', 'staff'].includes(session.role)) {
  redirect('/dcp-admin/dashboard');
}
```

### Solution 3: Fix Navigation to Use Link Component
Change from button with onClick to Link component:

**Current (in layout.tsx)**:
```tsx
<button
  key={item.name}
  onClick={() => router.push(item.href)}
  className="..."
>
  {item.icon}
  <span>{item.name}</span>
</button>
```

**Recommended**:
```tsx
<Link
  key={item.name}
  href={item.href}
  className="..."
>
  {item.icon}
  <span>{item.name}</span>
</Link>
```

### Solution 4: Clear Cache and Restart
```bash
# Stop dev server
# Delete .next folder
rm -rf .next

# Restart dev server
npm run dev
```

## Recommended Fix

I recommend implementing Solution 3 (Use Link component) as it's the most reliable for Next.js navigation:

1. Replace button with Link component in navigation
2. This ensures proper Next.js routing
3. Prevents client-side navigation issues
4. Better for SEO and accessibility

## Testing Steps

After implementing the fix:

1. Navigate to `http://localhost:3000/dcp-admin/dashboard`
2. Click on "User Management" menu item
3. Should navigate to `/dcp-admin/dashboard/users`
4. Click on "e-Certificate" menu item
5. Should navigate to `/dcp-admin/dashboard/certificates`
6. Check browser console for any errors
7. Verify no redirects occur

## Additional Notes

- The navigation uses `router.push()` which is client-side navigation
- Link component is preferred for Next.js App Router
- Server components (like users page) might have different behavior
- Role-based access control should be clearly documented

## Next Steps

1. Implement Solution 3 (Use Link component)
2. Test navigation for all menu items
3. Verify role-based access control works correctly
4. Document which roles can access which pages
5. Add error handling for unauthorized access

## Date
March 1, 2026
