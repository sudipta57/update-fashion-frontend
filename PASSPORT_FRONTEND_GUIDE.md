# Passport.js Frontend Implementation Guide

## Overview

The frontend has been updated to support Passport.js authentication with the following features:
- **Local Authentication**: Email/password login
- **Google OAuth 2.0**: Sign in with Google button
- **Session Management**: Automatic session validation and persistence
- **Cookie-based Authentication**: Secure HTTP-only cookies for API requests

## Changes Made

### 1. **API Client (`src/api-client.ts`)**
Added new Passport-specific functions:

```typescript
// Updated to use Passport endpoints
export const validateToken = async () - Uses /api/auth/check-session
export const signIn = async (formData: SignInFormData) - Uses /api/auth/passport-login
export const signOut = async () - Uses /api/auth/passport-logout

// New Passport-specific functions
export const passportGoogleLogin = () - Redirects to /api/auth/google
export const getCurrentUser = async () - Fetches user from /api/auth/me
export const passportLogout = async () - Uses /api/auth/passport-logout
```

**Key Features:**
- All functions include cookie consent checks
- `credentials: "include"` ensures cookies are sent with all requests
- Proper error handling with meaningful error messages

### 2. **Sign In Page (`src/pages/SignIn.tsx`)**
Enhanced with Google OAuth integration:

```tsx
// Local login form (unchanged)
// Password login button

// New Google OAuth section
- Google login button with Google icon
- Redirects to backend OAuth endpoint
- Integrated toast notifications for errors
```

**UI Enhancements:**
- Clean "Sign in with" section below the form
- Google logo icon for brand recognition
- Hover effects for better UX
- Error handling with toast notifications

### 3. **Auth Success Page (`src/pages/AuthSuccess.tsx`)**
New component to handle OAuth callbacks:

```tsx
export const handleCallback = () => {
  // Extracts userId, email, firstName, lastName from URL params
  // Stores in sessionStorage for immediate context refresh
  // Shows success toast
  // Redirects to home page or previous location
}
```

**Features:**
- Handles Google OAuth redirect from backend
- Extracts user info from URL query parameters
- Manages session storage for context update
- Shows loading UI during authentication
- Error handling with redirect to sign-in

### 4. **App Context (`src/contexts/AppContext.tsx`)**
Updated for Passport session management:

```tsx
// Uses check-session endpoint instead of validate-token
// Better state management for userId and isAdmin
// Improved useEffect hooks for session refresh
```

**Improvements:**
- Tracks `userId` and `isAdmin` separately in state
- Validates session only when cookie consent is given
- Proper cleanup and error handling
- Real-time updates to login status

### 5. **App Routes (`src/App.tsx`)**
Added OAuth callback route:

```tsx
<Route path="/auth-success" element={<Layout><AuthSuccess /></Layout>} />
```

## Frontend Workflow

### Local Login Flow
```
User fills email/password form
↓
Submit to /api/auth/passport-login
↓
Backend validates credentials
↓
Backend sets HTTP-only session cookie
↓
Frontend receives user data
↓
Redirect to home page
↓
AppContext validates session and updates login state
```

### Google OAuth Flow
```
User clicks "Sign in with Google"
↓
Redirect to /api/auth/google
↓
Google OAuth consent screen
↓
User grants permission
↓
Backend receives Google token
↓
Backend creates/updates user in MongoDB
↓
Backend sets session cookie
↓
Backend redirects to /auth-success?userId=...&email=...
↓
AuthSuccess component extracts params
↓
Redirect to home page
↓
AppContext refreshes and updates login state
```

### Logout Flow
```
User clicks "Sign Out"
↓
Submit POST to /api/auth/passport-logout
↓
Backend destroys session
↓
Backend clears cookies
↓
Frontend invalidates query cache
↓
Frontend updates login state
↓
Redirect to home page
```

## Environment Configuration

No new environment variables needed on frontend side. The backend `.env` should have:

```env
# Session Configuration
SESSION_SECRET=your-session-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:7000/api/auth/google/callback

# Frontend URL for OAuth redirect
FRONTEND_URL=http://localhost:5173
```

## Testing

### 1. Test Local Login
```bash
# In browser console
fetch('http://localhost:7000/api/auth/passport-login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log)
```

### 2. Test Google Login
- Click "Sign in with Google" button
- Grant permission to UpdateFashion app
- Should redirect to /auth-success with user params
- Should show success toast and redirect to home

### 3. Test Session Persistence
- Login successfully
- Refresh the page
- AppContext should validate session and maintain login state
- User should remain logged in

### 4. Test Logout
- Click "Sign Out"
- Should show success toast
- Should redirect to home
- User should be logged out
- Refresh page - should remain logged out

## Key Components

### SignIn Component
- **Path**: `src/pages/SignIn.tsx`
- **Features**: Email/password form + Google OAuth button
- **Uses**: `useForm` from react-hook-form, `useMutation` from react-query
- **Integration**: Calls `apiClient.signIn()` and `apiClient.passportGoogleLogin()`

### AuthSuccess Component
- **Path**: `src/pages/AuthSuccess.tsx`
- **Purpose**: Handles OAuth callback redirect
- **Features**: Extracts user info, updates context, redirects
- **Route**: `/auth-success`

### AppContext
- **Path**: `src/contexts/AppContext.tsx`
- **Features**: Global login state, user info, admin status
- **Uses**: `useQuery` with `validateToken` function

### API Client Functions
- **Path**: `src/api-client.ts`
- **Passport Functions**:
  - `passportGoogleLogin()` - Redirects to OAuth
  - `getCurrentUser()` - Fetches current user
  - `passportLogout()` - Logout function

## Common Issues & Solutions

### Issue: "Google login button doesn't work"
**Solution**: 
- Check backend `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Verify `GOOGLE_CALLBACK_URL` matches backend configuration
- Ensure frontend has cookie consent accepted

### Issue: "User not staying logged in after refresh"
**Solution**:
- Check browser cookies are being stored
- Verify `credentials: "include"` in all API calls
- Check backend session cookie configuration
- Ensure MongoDB session store is connected

### Issue: "OAuth redirect goes to wrong URL"
**Solution**:
- Update `FRONTEND_URL` in backend `.env`
- Backend redirects to `{FRONTEND_URL}/auth-success`
- Check `GOOGLE_CALLBACK_URL` in Google Cloud Console

### Issue: "Toast notifications not showing"
**Solution**:
- Ensure `CookieConsent` component is setting `localStorage`
- Check `showToast` function in `AppContext`
- Verify Toast component is rendered in provider

## Integration Notes

✅ **Already Integrated:**
- Cookie consent checks (reuses existing logic)
- Toast notifications (reuses existing component)
- React Query for state management
- Error handling and validation
- CORS with credentials

✅ **Compatible With:**
- Existing product/order APIs
- Existing favorites system
- Admin role-based routes
- Existing layout and styling

## Next Steps (Optional Enhancements)

1. **GitHub OAuth**: Follow same pattern as Google OAuth
2. **Remember Me**: Add cookie expiration options
3. **Two-Factor Authentication**: Add 2FA support
4. **Social Linking**: Allow linking multiple OAuth providers
5. **Profile Management**: Add user profile page with avatar

## Files Modified

- ✅ `src/api-client.ts` - Updated endpoints
- ✅ `src/pages/SignIn.tsx` - Added Google button
- ✅ `src/contexts/AppContext.tsx` - Updated session logic
- ✅ `src/App.tsx` - Added auth-success route
- ✅ `src/pages/AuthSuccess.tsx` - New file (OAuth callback handler)

## Testing Checklist

- [ ] Local login with email/password works
- [ ] Google OAuth button appears and redirects correctly
- [ ] Session persists after page refresh
- [ ] Logout clears session and cookies
- [ ] Error messages display properly with toasts
- [ ] Admin routes work correctly after login
- [ ] Favorites and orders work with Passport authentication
- [ ] Mobile responsive UI works for Google button
