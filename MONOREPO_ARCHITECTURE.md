# Mishwari Monorepo Architecture Plan

**Version:** 1.0  
**Status:** Planning - Future Implementation

---

## Vision: Multi-Platform Ecosystem

```
Web Apps (Next.js)     Mobile Apps (React Native)     Backend
├── Passenger Web      ├── Passenger Mobile           └── Django API
└── Driver Web         └── Driver Mobile
```

**Goal:** Share 70-75% of code across all platforms

---

## Complete File Structure

```
mishwari-ecosystem/
├── apps/
│   ├── passenger-web/                    (Next.js 14)
│   │   ├── src/
│   │   │   ├── app/                      (App Router)
│   │   │   ├── components/               (Passenger-specific UI)
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── driver-web/                       (Next.js 14)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/               (Driver-specific UI)
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── passenger-mobile/                 (Expo)
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   └── components/
│   │   ├── package.json
│   │   └── app.json
│   │
│   └── driver-mobile/                    (Expo)
│       ├── src/
│       │   ├── screens/
│       │   └── components/
│       ├── package.json
│       └── app.json
│
├── packages/
│   ├── features/
│   │   ├── auth/                         (100% shared)
│   │   │   ├── src/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useOTP.ts
│   │   │   │   └── index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── profile/                      (Role-specific)
│   │   │   ├── src/
│   │   │   │   ├── core/
│   │   │   │   │   ├── useProfile.ts     (Shared: basic info)
│   │   │   │   │   └── types.ts
│   │   │   │   ├── passenger/
│   │   │   │   │   └── index.ts          (Re-exports core)
│   │   │   │   └── driver/
│   │   │   │       ├── useDriverProfile.ts
│   │   │   │       ├── useKYC.ts
│   │   │   │       └── index.ts          (Re-exports core + driver)
│   │   │   └── package.json
│   │   │
│   │   ├── trips/                        (Role-specific)
│   │   │   ├── src/
│   │   │   │   ├── core/
│   │   │   │   │   ├── useTrips.ts       (Search, view)
│   │   │   │   │   └── useFilters.ts
│   │   │   │   ├── passenger/
│   │   │   │   │   ├── useBooking.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── driver/
│   │   │   │       ├── useTripManagement.ts
│   │   │   │       ├── useRouteCreation.ts
│   │   │   │       └── index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── bookings/                     (Role-specific)
│   │   │   ├── src/
│   │   │   │   ├── passenger/
│   │   │   │   │   ├── useMyBookings.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── driver/
│   │   │   │       ├── useTripBookings.ts
│   │   │   │       └── index.ts
│   │   │   └── package.json
│   │   │
│   │   └── wallet/                       (Role-specific)
│   │       ├── src/
│   │       │   ├── passenger/
│   │       │   │   ├── useWallet.ts
│   │       │   │   └── index.ts
│   │       │   └── driver/
│   │       │       ├── useEarnings.ts
│   │       │       └── index.ts
│   │       └── package.json
│   │
│   ├── api/                              (100% shared)
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── trips.ts
│   │   │   ├── bookings.ts
│   │   │   ├── auth.ts
│   │   │   ├── profile.ts
│   │   │   ├── driver.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── types/                            (100% shared)
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── profile.ts
│   │   │   ├── trip.ts
│   │   │   ├── booking.ts
│   │   │   ├── driver.ts
│   │   │   ├── bus.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                            (95% shared)
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── currency.ts
│   │   │   ├── validation.ts
│   │   │   ├── storage.ts
│   │   │   ├── storage.web.ts
│   │   │   ├── storage.native.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui-primitives/                    (Shared interfaces)
│   │   ├── src/
│   │   │   ├── Button.types.ts
│   │   │   ├── Input.types.ts
│   │   │   ├── Card.types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui-web/                           (Web components)
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── PhoneInput.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ui-native/                        (Mobile components)
│       ├── src/
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Card.tsx
│       │   └── index.ts
│       └── package.json
│
├── backend/
│   └── mishwari_server/                  (Django)
│       ├── mishwari_main_app/
│       │   ├── models.py
│       │   ├── views.py
│       │   ├── serializers.py
│       │   └── urls.py
│       └── manage.py
│
├── package.json                          (Root workspace config)
├── turbo.json                            (Turborepo config)
├── tsconfig.json                         (Base TypeScript config)
└── README.md
```

---

## Layer Architecture

```
┌─────────────────────────────────────────────┐
│         PRESENTATION LAYER                  │
│  Platform-specific UI (25-30%)              │
│  Web: Next.js + Tailwind                   │
│  Mobile: React Native + NativeWind         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER                │
│  Platform-agnostic (100% shared)            │
│  Auth, Trips, Bookings, Payments           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         DATA LAYER                          │
│  Platform-agnostic (100% shared)            │
│  API client, Data fetching, Storage        │
└─────────────────────────────────────────────┘
```

---

## Role-Specific Feature Pattern

### Auth (100% Shared)
```typescript
// packages/features/auth/src/useAuth.ts
export const useAuth = () => {
  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    await storage.setItem('token', response.token)
    setUser(response.user)
  }
  return { user, login, logout, isAuthenticated }
}
```

### Profile (Role-Specific)
```typescript
// packages/features/profile/src/core/useProfile.ts
// ✅ SHARED by both roles
export const useProfile = () => {
  const updateBasicInfo = async (data: {
    full_name: string
    birth_date: string
    gender: 'male' | 'female'
    address: string
  }) => {
    return await profileApi.update(data)
  }
  return { updateBasicInfo }
}

// packages/features/profile/src/passenger/index.ts
export * from '../core/useProfile'  // Passenger uses only core

// packages/features/profile/src/driver/useDriverProfile.ts
// ❌ DRIVER-ONLY extensions
export const useDriverProfile = () => {
  const updateDriverInfo = async (data: {
    d_name: string
    national_id: string
    driver_license: string
  }) => {
    return await driverApi.updateProfile(data)
  }
  return { updateDriverInfo }
}

// packages/features/profile/src/driver/index.ts
export * from '../core/useProfile'      // Basic profile
export * from './useDriverProfile'       // Driver extensions
```

### Usage in Apps
```typescript
// apps/passenger-web/src/pages/profile.tsx
import { useProfile } from '@mishwari/features/profile/passenger'

const PassengerProfile = () => {
  const { updateBasicInfo } = useProfile()  // Only basic profile
}

// apps/driver-web/src/pages/profile.tsx
import { useProfile, useDriverProfile } from '@mishwari/features/profile/driver'

const DriverProfile = () => {
  const { updateBasicInfo } = useProfile()           // Basic profile
  const { updateDriverInfo } = useDriverProfile()    // Driver-specific
}
```

### @mishwari/api (API Client)
```typescript
// packages/api/src/trips.ts
export const tripsApi = {
  search: (params) => apiClient.get('/trips/', { params }),
  getById: (id) => apiClient.get(`/trips/${id}/`),
  create: (data) => apiClient.post('/trips/', data)
}
```

### @mishwari/ui (Platform-Specific)
```typescript
// packages/ui/primitives/src/Button.types.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary'
  onPress: () => void
  children: React.ReactNode
}

// packages/ui/web/src/Button.tsx (Tailwind)
export const Button = ({ variant, onPress, children }: ButtonProps) => (
  <button onClick={onPress} className={`btn btn-${variant}`}>
    {children}
  </button>
)

// packages/ui/native/src/Button.tsx (React Native)
export const Button = ({ variant, onPress, children }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles[variant]}>
    <Text>{children}</Text>
  </TouchableOpacity>
)
```

### @mishwari/utils (Storage Abstraction)
```typescript
// packages/utils/src/storage.ts
export interface Storage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

// Web: localStorage
// Mobile: AsyncStorage
```

---

## Code Sharing Breakdown

| Feature | Shared Core | Passenger-Only | Driver-Only |
|---------|-------------|----------------|-------------|
| **Auth** | 100% (login, OTP, logout) | - | - |
| **Profile** | 40% (basic info) | 10% (addresses) | 50% (KYC, license, vehicle) |
| **Trips** | 50% (search, view) | 25% (book, pay) | 25% (create, manage) |
| **Bookings** | - | 50% (view, cancel) | 50% (manage passengers) |
| **Wallet** | - | 50% (top-up, pay) | 50% (earnings, withdraw) |

| Layer | Shared % | Role-Specific % | Platform-Specific % |
|-------|----------|-----------------|---------------------|
| API Client | 100% | 0% | 0% |
| Types | 100% | 0% | 0% |
| Utilities | 95% | 0% | 5% |
| Business Logic | 40% | 30% | 0% |
| UI Components | 0% | 0% | 100% |
| **Overall** | **60-65%** | **10-15%** | **25-30%** |

---

## Technology Stack

### Build System
- **Turborepo** - Intelligent caching, parallel builds

### Web Apps
- **Next.js 14** - App Router
- **Tailwind CSS** - Styling
- **React Query** - Data fetching

### Mobile Apps
- **Expo** - React Native framework
- **NativeWind** - Tailwind for React Native
- **React Navigation** - Navigation

### Shared
- **TypeScript** - Type safety
- **Zustand/Redux** - State management
- **Axios** - HTTP client
- **Zod** - Runtime validation

---

## Migration Path

### Phase 1: Setup Monorepo (Week 1)
- Create structure with Turborepo
- Setup npm workspaces
- Move existing Next.js apps

### Phase 2: Extract Shared Logic (Week 2-4)
- Extract business logic → `@mishwari/features`
- Extract API client → `@mishwari/api`
- Extract types → `@mishwari/types`
- Extract utilities → `@mishwari/utils`

### Phase 3: Refactor UI (Week 5-6)
- Create `@mishwari/ui-primitives` (interfaces)
- Create `@mishwari/ui-web` (Tailwind components)
- Update apps to use shared packages

### Phase 4: Mobile Apps (Week 7-14)
- Setup Expo projects
- Create `@mishwari/ui-native` (React Native components)
- Reuse all shared packages
- Add mobile-specific features (GPS, push notifications)

---

## Key Benefits

✅ **70-75% code reuse** across 4 apps  
✅ **Single source of truth** for business logic  
✅ **Independent deployments** for each app  
✅ **Consistent APIs** across platforms  
✅ **Easier maintenance** - update once, apply everywhere  
✅ **Better testing** - test shared logic once  
✅ **Team scalability** - clear ownership boundaries

---

## What to Share vs Separate

### 100% Shared
- Authentication (login, OTP, token management)
- API client (all endpoints)
- TypeScript types (User, Trip, Booking, etc.)
- Utilities (date, currency, validation)
- Core search/view logic

### Role-Specific (Passenger vs Driver)
**Passenger:**
- Booking flow
- Payment processing
- Trip history view
- Saved addresses

**Driver:**
- Trip creation
- Route management
- KYC verification
- Earnings tracking
- Vehicle management

### Platform-Specific (Web vs Mobile)
- UI components (Tailwind vs React Native)
- Navigation (Next.js Router vs React Navigation)
- Platform APIs (localStorage vs AsyncStorage)
- GPS tracking implementation
- Push notifications
- Camera/file upload

---

## Real-World Examples

- **Uber**: Separate apps (Rider, Driver, Eats) in monorepo
- **Airbnb**: Monorepo with shared design system
- **DoorDash**: Separate apps (Customer, Dasher, Merchant)

---

## Import Examples

```typescript
// All apps can import
import { useAuth } from '@mishwari/features/auth'
import { tripsApi } from '@mishwari/api'
import { Trip, User } from '@mishwari/types'
import { formatDate, formatCurrency } from '@mishwari/utils'

// Passenger apps import
import { useProfile } from '@mishwari/features/profile/passenger'
import { useBooking } from '@mishwari/features/trips/passenger'
import { useMyBookings } from '@mishwari/features/bookings/passenger'
import { Button } from '@mishwari/ui-web'  // or ui-native

// Driver apps import
import { useProfile, useDriverProfile } from '@mishwari/features/profile/driver'
import { useTripManagement } from '@mishwari/features/trips/driver'
import { useTripBookings } from '@mishwari/features/bookings/driver'
import { Button } from '@mishwari/ui-web'  // or ui-native
```

## Next Steps

1. Complete Phase 1 of backend refactoring (multi-stop routes)
2. Setup Turborepo structure
3. Extract auth & API client first (highest duplication)
4. Gradually migrate features with role separation
5. Plan mobile app features

**Estimated Effort:** Build 4 apps with effort of ~2.5 apps 🎯
