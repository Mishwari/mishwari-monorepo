# Unified API & Auth Implementation Guide

## What Was Implemented

### 1. @mishwari/utils Package
**Location**: `packages/utils/`

**Files Created**:
- `src/token.ts` - Token encryption/decryption utilities

**Exports**:
```typescript
import { encryptToken, decryptToken } from '@mishwari/utils';
```

---

### 2. @mishwari/api Package
**Location**: `packages/api/`

**Files Created**:
- `src/client.ts` - Unified axios client with interceptors
- `src/auth.ts` - Auth endpoints (login, OTP, register, refresh)
- `src/user.ts` - User endpoints
- `src/profile.ts` - Profile endpoints
- `src/trips.ts` - Trips endpoints
- `src/bookings.ts` - Bookings endpoints
- `src/index.ts` - Package exports

**Key Features**:
- Automatic token injection via interceptors
- Token decryption before sending to backend
- Centralized error handling
- Type-safe API calls

**Usage**:
```typescript
import { apiClient, authApi, userApi, profileApi, tripsApi, bookingsApi } from '@mishwari/api';

// Setup token getter (in app initialization)
apiClient.setTokenGetter(() => store.getState().auth.token);

// Use API
const response = await authApi.login(username, password);
const user = await userApi.getUser();
const trips = await tripsApi.search({ from_city: 'Riyadh', to_city: 'Jeddah' });
```

---

### 3. @mishwari/features-auth Package
**Location**: `packages/features/auth/`

**Files Created**:
- `src/authSlice.ts` - Unified Redux auth slice
- `src/authActions.ts` - Shared auth actions (login, OTP, logout)
- `src/index.ts` - Package exports

**Auth State** (Merged from both apps):
```typescript
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken?: string | null;  // From passenger-web
  status?: string | null;         // From passenger-web
}
```

**Actions**:
- `performLogin(username, password)` - Standard login
- `performOTPLogin(phone, otp)` - OTP verification
- `fetchUserDetails(token)` - Get user data
- `fetchProfileDetails(token)` - Get profile data
- `performLogout()` - Logout and reset state

**Usage**:
```typescript
import { authSlice, performLogin, performLogout } from '@mishwari/features-auth';

// In store configuration
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // ... other reducers
  }
});

// In components
dispatch(performLogin(username, password));
dispatch(performLogout());
```

---

## Migration Steps for Apps

### For passenger-web:

1. **Update package.json**:
```json
{
  "dependencies": {
    "@mishwari/api": "*",
    "@mishwari/features-auth": "*",
    "@mishwari/utils": "*"
  }
}
```

2. **Replace auth slice**:
```typescript
// OLD: src/store/slices/authSlice.ts
// NEW: Import from package
import { authSlice } from '@mishwari/features-auth';
```

3. **Replace auth actions**:
```typescript
// OLD: src/store/actions/authActions.ts
// NEW: Import from package
import { performLogin, performLogout, fetchUserDetails } from '@mishwari/features-auth';
```

4. **Setup API client** (in `_app.tsx` or store setup):
```typescript
import { apiClient } from '@mishwari/api';
import { store } from './store';

apiClient.setTokenGetter(() => store.getState().auth.token);
```

5. **Keep Next.js API routes** - No changes needed, they proxy to Django

---

### For driver-web:

1. **Update package.json** (same as passenger-web)

2. **Replace auth slice** (same as passenger-web)

3. **Replace auth actions** (same as passenger-web)

4. **Setup API client** (same as passenger-web)

5. **CREATE Next.js API routes** (currently missing):

Create these files in `apps/driver-web/src/pages/api/next-external/`:

**auth/login.ts**:
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(`${apiBaseUrl}token/`, req.body);
      res.status(200).json(response.data);
    } catch (err: any) {
      res.status(err.response?.status || 500).json(err.response?.data || { message: 'Login failed' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
```

**user.ts**:
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    const response = await axios.get(`${apiBaseUrl}user/`, {
      headers: { Authorization: authorization }
    });
    res.status(200).json(response.data);
  } catch (err: any) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Failed to fetch user' });
  }
};
```

**profile.ts**: (Same pattern as user.ts)

**trips/bus-list.ts**: (Same pattern with query params)

---

## Benefits

✅ **Single source of truth** for auth logic  
✅ **Type-safe API calls** with TypeScript  
✅ **Automatic token management** via interceptors  
✅ **Consistent error handling** across apps  
✅ **Reduced code duplication** (~90% auth code shared)  
✅ **Easier testing** - test once, use everywhere  
✅ **Better maintainability** - update once, apply to all apps

---

## Next Steps

1. Install dependencies in both apps: `npm install`
2. Migrate passenger-web to use shared packages
3. Migrate driver-web to use shared packages
4. Create missing Next.js API routes in driver-web
5. Test login/logout flows in both apps
6. Remove old auth code from apps

---

## Architecture Pattern

```
┌─────────────────────────────────────────────┐
│         Apps (passenger-web, driver-web)    │
│  - Next.js API routes (proxy to Django)    │
│  - App-specific UI & pages                 │
└─────────────────────────────────────────────┘
                    ↓ imports
┌─────────────────────────────────────────────┐
│      @mishwari/features-auth                │
│  - authSlice (Redux state)                  │
│  - authActions (login, logout, OTP)         │
└─────────────────────────────────────────────┘
                    ↓ uses
┌─────────────────────────────────────────────┐
│           @mishwari/api                     │
│  - apiClient (axios + interceptors)         │
│  - authApi, userApi, profileApi, etc.       │
└─────────────────────────────────────────────┘
                    ↓ uses
┌─────────────────────────────────────────────┐
│          @mishwari/utils                    │
│  - encryptToken, decryptToken               │
└─────────────────────────────────────────────┘
                    ↓ calls
┌─────────────────────────────────────────────┐
│      Next.js API Routes (/api/next-external)│
│  - Proxy requests to Django backend         │
└─────────────────────────────────────────────┘
                    ↓ proxies to
┌─────────────────────────────────────────────┐
│          Django Backend                     │
│  - /api/token/, /api/user/, etc.            │
└─────────────────────────────────────────────┘
```
