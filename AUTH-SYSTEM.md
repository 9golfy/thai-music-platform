# Authentication System Documentation

## Overview

Simple authentication system for admin dashboard with hardcoded credentials.

## Credentials

**Username:** `root`  
**Password:** `admin`  
**Display Name:** `Admin`  
**Role:** `admin`

## Files Created

### 1. Login Page
**File:** `app/(admin)/login/page.tsx`

Features:
- ✅ CoreUI styled login form
- ✅ Username and password inputs
- ✅ Error message display
- ✅ Loading state
- ✅ Responsive design
- ✅ Test credentials displayed on side panel

### 2. Login API
**File:** `app/api/auth/login/route.ts`

Features:
- ✅ POST endpoint for authentication
- ✅ Validates credentials
- ✅ Sets HTTP-only session cookie
- ✅ Returns user information
- ✅ Secure cookie configuration

### 3. Logout API
**File:** `app/api/auth/logout/route.ts`

Features:
- ✅ POST endpoint for logout
- ✅ Clears session cookie
- ✅ Returns success response

### 4. Middleware
**File:** `middleware.ts`

Features:
- ✅ Protects `/dashboard/*` routes
- ✅ Redirects to login if not authenticated
- ✅ Redirects to dashboard if already logged in
- ✅ Preserves intended destination

### 5. Updated Dashboard Layout
**File:** `app/(admin)/dashboard/layout-new.tsx`

Features:
- ✅ Checks authentication on mount
- ✅ Displays user's display name
- ✅ Functional logout button
- ✅ Clears local storage on logout

## How It Works

### Login Flow

1. User visits `/login`
2. Enters username and password
3. Form submits to `/api/auth/login`
4. API validates credentials
5. If valid:
   - Sets HTTP-only session cookie
   - Returns user data
   - Client stores auth state in localStorage
   - Redirects to `/dashboard`
6. If invalid:
   - Returns error message
   - Displays error to user

### Protected Routes

1. User tries to access `/dashboard/*`
2. Middleware checks for session cookie
3. If no cookie:
   - Redirects to `/login?redirect=/dashboard/...`
4. If cookie exists:
   - Allows access
5. Dashboard layout checks localStorage
6. If not authenticated:
   - Redirects to login

### Logout Flow

1. User clicks Logout button
2. Calls `/api/auth/logout`
3. API clears session cookie
4. Client clears localStorage
5. Redirects to `/login`

## Security Features

### Session Cookie Configuration

```typescript
{
  httpOnly: true,        // Cannot be accessed by JavaScript
  secure: production,    // HTTPS only in production
  sameSite: 'strict',   // CSRF protection
  maxAge: 86400         // 24 hours
}
```

### Protection Layers

1. **Middleware** - Server-side route protection
2. **Client-side check** - Layout authentication check
3. **HTTP-only cookies** - XSS protection
4. **SameSite cookies** - CSRF protection

## Usage

### Testing Login

1. Start development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/login

3. Enter credentials:
   - Username: `root`
   - Password: `admin`

4. Click "เข้าสู่ระบบ"

5. Should redirect to dashboard

### Testing Protected Routes

1. Without login, visit: http://localhost:3000/dashboard
2. Should redirect to login page
3. After login, should access dashboard

### Testing Logout

1. Login to dashboard
2. Click "Logout" in sidebar
3. Should redirect to login page
4. Try accessing dashboard again
5. Should redirect to login

## Customization

### Change Credentials

Edit `app/api/auth/login/route.ts`:

```typescript
const VALID_CREDENTIALS = {
  username: 'your-username',
  password: 'your-password',
  displayName: 'Your Name',
  role: 'admin'
};
```

### Add Multiple Users

```typescript
const VALID_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    displayName: 'Administrator',
    role: 'admin'
  },
  {
    username: 'user',
    password: 'user123',
    displayName: 'Regular User',
    role: 'user'
  }
];

// In POST handler
const user = VALID_USERS.find(
  u => u.username === username && u.password === password
);

if (user) {
  // Login successful
}
```

### Change Session Duration

Edit cookie maxAge in `app/api/auth/login/route.ts`:

```typescript
maxAge: 60 * 60 * 24 * 7  // 7 days
maxAge: 60 * 60 * 2       // 2 hours
maxAge: 60 * 30           // 30 minutes
```

### Add Remember Me

1. Add checkbox to login form:
```tsx
<CFormCheck 
  label="จดจำการเข้าสู่ระบบ" 
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
```

2. Send to API and adjust cookie maxAge accordingly

### Add Password Reset

1. Create `/api/auth/reset-password` endpoint
2. Add email sending functionality
3. Create reset password page
4. Update credentials in database/file

## Production Considerations

### ⚠️ IMPORTANT: This is a demo implementation

For production, you should:

1. **Use a proper authentication library:**
   - NextAuth.js
   - Auth0
   - Clerk
   - Supabase Auth

2. **Store credentials securely:**
   - Use database (MongoDB, PostgreSQL)
   - Hash passwords with bcrypt/argon2
   - Never store plain text passwords

3. **Implement proper session management:**
   - Use JWT tokens
   - Implement refresh tokens
   - Add session expiry
   - Track active sessions

4. **Add security features:**
   - Rate limiting on login attempts
   - Account lockout after failed attempts
   - Two-factor authentication (2FA)
   - Email verification
   - Password strength requirements
   - Password reset functionality

5. **Audit logging:**
   - Log all login attempts
   - Log failed authentication
   - Log logout events
   - Monitor suspicious activities

## Migration to Production Auth

### Option 1: NextAuth.js

```bash
npm install next-auth
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate against database
        const user = await validateUser(credentials);
        if (user) {
          return user;
        }
        return null;
      }
    })
  ]
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Option 2: Database-backed Auth

1. Install bcrypt:
```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

2. Create users collection in MongoDB

3. Hash passwords:
```typescript
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
```

4. Verify passwords:
```typescript
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

## Troubleshooting

### Issue: Redirect loop

**Cause:** Middleware and client-side check conflict

**Solution:** Ensure middleware only checks cookie, not localStorage

### Issue: Session not persisting

**Cause:** Cookie not being set

**Solution:** 
- Check browser console for cookie
- Verify API response sets cookie
- Check cookie domain/path settings

### Issue: Can't logout

**Cause:** Cookie not being cleared

**Solution:**
- Check logout API response
- Verify cookie name matches
- Clear browser cookies manually

### Issue: Middleware not working

**Cause:** Matcher configuration

**Solution:**
- Check middleware.ts matcher config
- Ensure paths match exactly
- Test with simple console.log

## Testing Checklist

- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Error message displays for wrong credentials
- [ ] Redirects to dashboard after login
- [ ] Cannot access dashboard without login
- [ ] Logout button works
- [ ] Redirects to login after logout
- [ ] Cannot access dashboard after logout
- [ ] Session persists on page refresh
- [ ] Display name shows correctly
- [ ] Middleware protects all dashboard routes

## Support

For issues:
1. Check browser console for errors
2. Check Network tab for API calls
3. Verify cookies in Application tab
4. Check middleware logs

---

**Created:** February 24, 2026  
**Version:** 1.0  
**Status:** Demo/Development Only
