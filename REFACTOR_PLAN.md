# Mishwari Monorepo Refactor Plan

**Version:** 1.1  
**Date:** 2025-01-07  
**Status:** Phase 1 & 2 Complete ✅

---

## Executive Summary

This document outlines the refactoring strategy to align passenger-web and driver-web with the monorepo architecture, achieving 70-75% code reuse while maintaining role-specific functionality.

**Goals:**
- Remove duplicate code (types, utils, auth logic)
- Extract shared business logic to feature packages
- Unify design system and theme
- Maintain role-specific UX where needed

---

## Current State Analysis

### What's Already Good ✅
1. `@mishwari/api` - 100% shared, well-structured
2. `@mishwari/types` - 100% shared, comprehensive
3. `@mishwari/ui-primitives` - Shared types/hooks
4. `@mishwari/ui-web` - Shared web components
5. `@mishwari/utils` - Shared utilities

### What Needs Refactoring ⚠️

#### Duplicate Code in Apps
**passenger-web:**
- `src/types/` - Duplicates `@mishwari/types`
- `src/utils/tokenUtils.ts` - Duplicates `@mishwari/utils/token.ts`
- `src/hooks/useAuth.ts` - Should be in `@mishwari/features/auth`
- `src/store/` - Redux logic not shared

**driver-web:**
- `src/types/` - Duplicates `@mishwari/types`
- `src/utils/tokenUtils.ts` - Duplicates `@mishwari/utils/token.ts`
- `src/hooks/useAuth.ts` - Should be in `@mishwari/features/auth`
- `src/store/` - Redux logic not shared

#### Missing Feature Packages
```
packages/features/
├── auth/          ✅ EXISTS (but incomplete)
├── profile/       ❌ MISSING (should have passenger/ and driver/)
├── trips/         ✅ EXISTS (but incomplete)
├── bookings/      ❌ MISSING (should have passenger/ and driver/)
└── wallet/        ❌ MISSING (should have passenger/ and driver/)
```

---

## Component Sharing Strategy

### 1. What to Share (70%)

#### Atomic Components (100% Shared)
```
@mishwari/ui-web/components/
├── Button.tsx           // All variants, sizes
├── Input.tsx            // Text, number, email
├── Card.tsx             // Base card container
├── Badge.tsx            // Status badges
├── Modal.tsx            // Base modal
├── DatePicker.tsx       // Date selection
├── PhoneInput.tsx       // Phone with country code
├── OtpInput.tsx         // 6-digit OTP
└── FileUpload.tsx       // Document upload
```

#### Layout Components (80% Shared)
```
@mishwari/ui-web/layouts/
├── AppShell.tsx         // Base app structure
├── Header.tsx           // Logo, user menu (role-agnostic)
├── Footer.tsx           // Links, copyright
├── Container.tsx        // Max-width wrapper
└── Section.tsx          // Spacing wrapper
```

#### Composite Components (50% Shared)
```
@mishwari/ui-web/components/
├── TripCardBase.tsx     // Route + date display
├── BookingCardBase.tsx  // Booking info display
├── ProfileForm.tsx      // Basic profile fields
└── SearchBar.tsx        // From/to/date search
```

### 2. What to Keep Separate (30%)

#### Role-Specific Cards
```
apps/passenger-web/components/
├── TripCard.tsx         // Booking-focused (price, seats, "Book Now")
├── BookingCard.tsx      // My bookings view
└── TicketCard.tsx       // Active ticket

apps/driver-web/components/
├── trips/TripCard.tsx   // Management-focused (status, "Publish", "Edit")
├── fleet/BusCard.tsx    // Fleet management
├── drivers/DriverCard.tsx
└── bookings/BookingCard.tsx  // Trip bookings view
```

#### Role-Specific Layouts
```
apps/passenger-web/layouts/
├── HeaderLayout.tsx     // Passenger navigation
└── SideNav.tsx          // Passenger menu

apps/driver-web/components/layout/
└── DashboardLayout.tsx  // Driver navigation + sidebar
```

#### Role-Specific Forms
```
apps/passenger-web/components/
├── BookingForm.tsx      // Passenger booking
└── PaymentForm.tsx      // Payment methods

apps/driver-web/components/
├── trips/TripForm.tsx   // Trip creation
├── fleet/BusForm.tsx    // Bus management
└── bookings/PhysicalBookingForm.tsx
```

---

## Composition Pattern Example

### TripCard Implementation

**Shared Base Component:**
```typescript
// packages/ui-web/src/components/TripCardBase.tsx
export const TripCardBase = ({ trip, children }) => (
  <Card>
    <div className="space-y-4">
      {/* Shared: Route display */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{trip.from_city.city}</span>
        <ArrowRightIcon className="h-5 w-5" />
        <span className="text-lg font-bold">{trip.to_city.city}</span>
      </div>
      
      {/* Shared: Date/Time */}
      <div className="text-sm text-gray-600">{trip.journey_date}</div>
      
      {/* Role-specific content slot */}
      {children}
    </div>
  </Card>
)
```

**Passenger-Specific Card:**
```typescript
// apps/passenger-web/src/components/TripCard.tsx
import { TripCardBase } from '@mishwari/ui-web'

export const PassengerTripCard = ({ trip }) => (
  <TripCardBase trip={trip}>
    {/* Passenger-specific: Price & availability */}
    <div className="flex justify-between">
      <span className="text-2xl font-bold text-blue-600">{trip.price} ريال</span>
      <span className="text-gray-600">{trip.available_seats} مقاعد</span>
    </div>
    <Button onClick={() => book(trip)}>احجز الآن</Button>
  </TripCardBase>
)
```

**Driver-Specific Card:**
```typescript
// apps/driver-web/src/components/trips/TripCard.tsx
import { TripCardBase } from '@mishwari/ui-web'

export const DriverTripCard = ({ trip }) => (
  <TripCardBase trip={trip}>
    {/* Driver-specific: Status & actions */}
    <StatusBadge status={trip.status} />
    {trip.can_publish && <Button onClick={() => publish(trip)}>نشر</Button>}
  </TripCardBase>
)
```

---

## State Management Strategy

### Current Problem
- Each app has duplicate Redux slices (authSlice, mobileAuthSlice)
- Same logic, different locations

### Solution: Feature Hooks with Zustand

**❌ DON'T Share Redux Store**
- Each app has different state needs
- Redux is app-specific

**✅ DO Share Logic via Feature Hooks**

```typescript
// packages/features/auth/src/useAuth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (credentials) => {
        const response = await authApi.login(credentials)
        set({ 
          user: response.user, 
          token: response.token,
          isAuthenticated: true 
        })
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      }
    }),
    { name: 'auth-storage' }
  )
)
```

**Usage in Both Apps (Same API):**
```typescript
const { user, login, logout, isAuthenticated } = useAuth()
```

**Benefits:**
- ✅ Shared logic (100%)
- ✅ No Redux boilerplate
- ✅ Simpler, more maintainable
- ✅ Works with React Query for server state

**Migration Strategy:**
- Keep existing Redux (don't break things)
- New features use Zustand hooks
- Gradually migrate old features

---

## Theme & Design System Unification

### Problem
Different pages, need same brand identity

### Solution: Design Tokens + Tailwind Config

**Shared Theme Tokens:**
```typescript
// packages/ui-web/src/theme/tokens.ts
export const colors = {
  primary: {
    50: '#e6f2f7',
    100: '#cce5ef',
    500: '#005687',  // Main brand color
    600: '#004a73',
    900: '#002d47',
  },
  secondary: {
    500: '#F59E0B',
  },
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
}

export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
}

export const typography = {
  fontFamily: {
    sans: ['Cairo', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  }
}
```

**Shared Tailwind Config:**
```javascript
// packages/ui-web/tailwind.config.js
const { colors, spacing, typography } = require('./src/theme/tokens')

module.exports = {
  theme: {
    extend: {
      colors,
      spacing,
      ...typography,
    }
  }
}
```

**App Configs (Extend Shared):**
```javascript
// apps/passenger-web/tailwind.config.js
module.exports = {
  presets: [require('@mishwari/ui-web/tailwind.config')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-web/src/**/*.{js,ts,jsx,tsx}',
  ]
}

// apps/driver-web/tailwind.config.js
module.exports = {
  presets: [require('@mishwari/ui-web/tailwind.config')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-web/src/**/*.{js,ts,jsx,tsx}',
  ]
}
```

**Result:** Same colors, spacing, fonts across all apps

---

## Layout & Navigation Unification Strategy

### Current Architecture

**Passenger-Web:**
- Desktop: Navbar (top) + Side Panel (right, 30% width) + Main Content (70%)
- Mobile: Navbar (top) + Bottom Nav (fixed) + Burger Menu
- Navigation: Settings, My Trips, Wallet, Passengers

**Driver-Web:**
- Desktop: Sidebar (left, fixed) + Main Content (centered, max-7xl)
- Mobile: No mobile nav yet
- Navigation: Home, Fleet, Trips, Bookings, Drivers

### Unified Layout System

**Key Insight:** Different pages, same structure pattern
- Both use: Container → Navigation → Content → Actions
- Passenger: Consumer-focused (booking, payments)
- Driver: Management-focused (CRUD operations)

### Shared Layout Primitives (70% Reusable)

```typescript
// packages/ui-web/src/layouts/AppShell.tsx
interface AppShellProps {
  topBar?: ReactNode;        // Navbar or Header
  sidebar?: ReactNode;        // Desktop sidebar
  bottomNav?: ReactNode;      // Mobile bottom nav
  banner?: ReactNode;         // Conditional banners (KYC, verification)
  children: ReactNode;
}

export const AppShell = ({ topBar, sidebar, bottomNav, banner, children }: AppShellProps) => (
  <div className="min-h-screen bg-gray-50">
    {banner}
    {topBar}
    <div className="flex">
      {sidebar}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
    {bottomNav}
  </div>
);
```

```typescript
// packages/ui-web/src/layouts/Sidebar.tsx
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  items: NavItem[];
  currentPath: string;
  logo?: ReactNode;
  footer?: ReactNode;
  position?: 'left' | 'right';  // LTR vs RTL
}

export const Sidebar = ({ items, currentPath, logo, footer, position = 'left' }: SidebarProps) => (
  <aside className={clsx(
    'hidden md:flex md:flex-shrink-0',
    position === 'right' && 'order-last'
  )}>
    <div className="flex flex-col w-64 bg-white border-gray-200">
      {logo && <div className="px-4 py-5">{logo}</div>}
      <nav className="flex-1 px-2 space-y-1">
        {items.map((item) => (
          <NavItem key={item.href} item={item} isActive={currentPath === item.href} />
        ))}
      </nav>
      {footer}
    </div>
  </aside>
);
```

```typescript
// packages/ui-web/src/layouts/BottomNav.tsx
export const BottomNav = ({ items, currentPath }: { items: NavItem[], currentPath: string }) => (
  <div className="md:hidden fixed z-30 bottom-6 left-0 right-0 w-full">
    <div className="flex justify-center">
      <div className="flex justify-around w-max bg-brand-primary shadow-lg rounded-full">
        {items.map((item) => (
          <BottomNavItem key={item.href} item={item} isActive={currentPath === item.href} />
        ))}
      </div>
    </div>
  </div>
);
```

```typescript
// packages/ui-web/src/components/Logo.tsx
export const Logo = ({ variant = 'default' }: { variant?: 'default' | 'demo' }) => (
  <div className="flex gap-1 items-center">
    <h1 className="text-white font-bold text-xl">مشواري</h1>
    {variant === 'demo' && (
      <span className="text-white text-[10px] font-normal self-end">(Demo)</span>
    )}
  </div>
);
```

### Role-Specific Implementations (30%)

```typescript
// apps/passenger-web/src/config/navigation.ts
export const passengerNavConfig = {
  desktop: {
    type: 'sidebar',
    position: 'right',  // RTL feel
    items: [
      { name: 'الاعدادات', href: '/profile', icon: Cog6ToothIcon },
      { name: 'رحلاتي', href: '/my_trips', icon: TicketIcon },
      { name: 'المحفظة', href: '/profile/wallet', icon: BanknotesIcon },
      { name: 'الركاب', href: '/profile/passengers', icon: UserGroupIcon },
    ],
  },
  mobile: {
    type: 'bottom',
    items: [
      { name: 'الرئيسية', href: '/', icon: HomeIcon },
      { name: 'رحلاتي', href: '/my_trips', icon: TicketIcon },
      { name: 'بروفايل', href: '/profile', icon: UserIcon },
    ],
  },
};

// apps/passenger-web/src/layouts/PassengerLayout.tsx
import { AppShell, Sidebar, BottomNav, LogoutButton } from '@mishwari/ui-web';
import { passengerNavConfig } from '@/config/navigation';

export const PassengerLayout = ({ children }) => {
  const router = useRouter();
  const logout = useLogout();

  return (
    <AppShell
      topBar={<PassengerNavbar />}
      sidebar={
        <Sidebar
          items={passengerNavConfig.desktop.items}
          currentPath={router.pathname}
          position="right"
          footer={<LogoutButton onLogout={logout} />}
        />
      }
      bottomNav={
        <BottomNav 
          items={passengerNavConfig.mobile.items} 
          currentPath={router.pathname} 
        />
      }
    >
      {children}
    </AppShell>
  );
};
```

```typescript
// apps/driver-web/src/config/navigation.ts
export const driverNavConfig = {
  desktop: {
    type: 'sidebar',
    position: 'left',  // LTR feel
    items: [
      { name: 'الرئيسية', href: '/', icon: HomeIcon },
      { name: 'الأسطول', href: '/fleet', icon: TruckIcon },
      { name: 'الرحلات', href: '/trips', icon: MapIcon },
      { name: 'الحجوزات', href: '/bookings', icon: TicketIcon },
      { name: 'السائقين', href: '/drivers', icon: UsersIcon },
    ],
  },
};

// apps/driver-web/src/layouts/DriverLayout.tsx
import { AppShell, Sidebar, Logo, LogoutButton } from '@mishwari/ui-web';
import { driverNavConfig } from '@/config/navigation';

export const DriverLayout = ({ children }) => {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <AppShell
      banner={<VerificationBanner profile={profile} />}
      sidebar={
        <Sidebar
          items={driverNavConfig.desktop.items}
          currentPath={router.pathname}
          position="left"
          logo={<Logo />}
          footer={<LogoutButton onLogout={logout} />}
        />
      }
    >
      {children}
    </AppShell>
  );
};
```

### Navigation Reusability Breakdown

| Component | Shared % | Notes |
|-----------|----------|-------|
| AppShell | 100% | Fully shared layout primitive |
| Sidebar | 90% | Shared component, role-specific items |
| BottomNav | 90% | Shared component, role-specific items |
| NavItem | 100% | Shared with active state logic |
| Logo | 100% | Fully shared |
| LogoutButton | 100% | Shared with variants |
| Navbar (Passenger) | 0% | Complex, passenger-specific |
| Navigation Config | 0% | Role-specific routes |
| **Overall** | **70%** | High reusability |

---

## Refactor Phases

### Phase 1: Clean Up Duplicates (High Priority)

**Effort:** 2 days  
**Risk:** Low  
**Value:** High

#### 1.1 Remove Duplicate Types
**Action:** Delete app-level types, use `@mishwari/types`

**passenger-web:**
```typescript
// DELETE: src/types/*
// REPLACE WITH:
import { Trip, Booking, User, Profile } from '@mishwari/types'
```

**driver-web:**
```typescript
// DELETE: src/types/*
// REPLACE WITH:
import { Trip, Bus, Driver, Profile } from '@mishwari/types'
```

**Impact:** ~15 files to update per app

#### 1.2 Remove Duplicate Utils
**Action:** Delete app-level utils, use `@mishwari/utils`

**Both apps:**
```typescript
// DELETE: src/utils/tokenUtils.ts
// REPLACE WITH:
import { encryptToken, decryptToken } from '@mishwari/utils'
```

**Impact:** ~5 files to update per app

---

### Phase 2: Extract Auth Logic (High Priority)

**Effort:** 3 days  
**Risk:** Medium  
**Value:** High

#### 2.1 Complete `@mishwari/features/auth`

**Structure:**
```
packages/features/auth/src/
├── useAuth.ts          // Login, logout, token management
├── useOTP.ts           // OTP flow
├── useProfile.ts       // Basic profile operations
└── index.ts
```

**Extract from passenger-web:**
- `src/hooks/useAuth.ts` → `@mishwari/features/auth/useAuth.ts`
- `src/hooks/useLogout.ts` → Merge into `useAuth.ts`

**Extract from driver-web:**
- `src/hooks/useAuth.ts` → Same shared `useAuth.ts`
- `src/hooks/useRevalidate.ts` → Add to `useAuth.ts`

**Impact:** ~10 files to update per app

---

### Phase 3: Create Role-Specific Features (Medium Priority)

**Effort:** 5 days  
**Risk:** Medium  
**Value:** High

#### 3.1 Create `@mishwari/features/profile`

**Structure:**
```
packages/features/profile/
├── src/
│   ├── core/
│   │   ├── useProfile.ts      // Shared: basic info update
│   │   └── types.ts
│   ├── passenger/
│   │   └── index.ts           // Re-exports core only
│   └── driver/
│       ├── useDriverProfile.ts // Driver-specific: KYC, license
│       └── index.ts           // Re-exports core + driver
└── package.json
```

#### 3.2 Create `@mishwari/features/bookings`

**Structure:**
```
packages/features/bookings/
├── src/
│   ├── passenger/
│   │   ├── useMyBookings.ts   // View, cancel bookings
│   │   └── index.ts
│   └── driver/
│       ├── useTripBookings.ts // Manage trip bookings
│       ├── usePhysicalBooking.ts // Create physical bookings
│       └── index.ts
└── package.json
```

#### 3.3 Enhance `@mishwari/features/trips`

**Structure:**
```
packages/features/trips/
├── src/
│   ├── core/
│   │   ├── useTrips.ts        // Search, view (shared)
│   │   └── useFilters.ts      // Filter logic (shared)
│   ├── passenger/
│   │   ├── useBooking.ts      // Booking flow
│   │   └── index.ts
│   └── driver/
│       ├── useTripManagement.ts // Create, publish, manage
│       └── index.ts
└── package.json
```

---

### Phase 4: Refactor State Management (Low Priority)

**Effort:** 5 days  
**Risk:** High  
**Value:** Medium

**Options:**
1. **Keep Redux (Minimal Change)** - Extract shared slices
2. **Migrate to Zustand (Recommended)** - Feature hooks with internal state

**Recommendation:** Zustand for new features, gradual migration

---

### Phase 5: Standardize Components (Low Priority)

**Effort:** 2 days  
**Risk:** Low  
**Value:** Low

**Action:** Update passenger-web to use shared components
- Replace custom `PhoneInput.tsx` with `@mishwari/ui-web`
- Replace custom `DatePicker.tsx` with `@mishwari/ui-web`
- Replace custom `TextInput.tsx` with `@mishwari/ui-web`

---

### Phase 6: Theme & Layout Unification (Medium Priority)

**Effort:** 2 days  
**Risk:** Low  
**Value:** High

#### 6.1 Create Shared Design Tokens (0.5 days)

**Tasks:**
- Extract passenger-web's Tailwind config to `packages/ui-web/src/theme/tokens.ts`
- Define colors (primary #005687, secondary, success, error, warning)
- Define spacing scale (xs, sm, md, lg, xl)
- Define typography (Cairo font, fontSize scale)
- Create Tailwind preset in `packages/ui-web/tailwind.config.js`

**Files to Create:**
```
packages/ui-web/src/theme/
├── tokens.ts           // Design tokens (colors, spacing, typography)
└── index.ts            // Export tokens

packages/ui-web/
└── tailwind.config.js  // Shared Tailwind preset
```

**Result:** Single source of truth for brand colors, spacing, fonts

#### 6.2 Update App Tailwind Configs (0.5 days)

**Tasks:**
- Update `apps/passenger-web/tailwind.config.js` to use preset
- Update `apps/driver-web/tailwind.config.js` to use preset
- Test that all colors/spacing work across both apps
- Verify Shadcn components still work

**Result:** Both apps use identical theme tokens

#### 6.3 Create Shared Navigation Components (1 day)

**Tasks:**
- Create `AppShell.tsx` - Base layout with topBar/sidebar/bottomNav/banner slots
- Create `Sidebar.tsx` - Reusable sidebar with nav items, supports left/right position
- Create `BottomNav.tsx` - Mobile bottom navigation
- Create `NavItem.tsx` - Single navigation item with active state
- Create `Logo.tsx` - Brand logo component
- Create `LogoutButton.tsx` - Logout button with variants

**Files to Create:**
```
packages/ui-web/src/layouts/
├── AppShell.tsx        // Base layout structure with slots
├── Sidebar.tsx         // Desktop sidebar navigation
├── BottomNav.tsx       // Mobile bottom navigation
├── NavItem.tsx         // Navigation item component
└── index.ts            // Export all layouts

packages/ui-web/src/components/
├── Logo.tsx            // Brand logo
├── LogoutButton.tsx    // Logout button
└── index.ts            // Export components
```

**Result:** Unified navigation system, easy to add mobile nav to driver-web

#### 6.4 Refactor Apps to Use Shared Layouts (Optional)

**Tasks:**
- Create `apps/passenger-web/src/config/navigation.ts` with nav config
- Update `apps/passenger-web/src/layouts/PassengerLayout.tsx` to use AppShell + Sidebar + BottomNav
- Create `apps/driver-web/src/config/navigation.ts` with nav config
- Update `apps/driver-web/src/layouts/DriverLayout.tsx` to use AppShell + Sidebar
- Test navigation works in both apps

**Result:** Both apps use same layout primitives, different configurations

**Value:** High - Consistent navigation behavior, easier to maintain  
**Risk:** Low - Non-breaking, additive changes  
**Effort:** 2 days (reduced from 3)

---

## Code Sharing Breakdown

| Layer | Shared % | Notes |
|-------|----------|-------|
| **API Client** | 100% | All endpoints in @mishwari/api |
| **Types** | 100% | All models in @mishwari/types |
| **Utils** | 95% | Date, currency, validation, encryption |
| **Auth** | 100% | Login, OTP, token management |
| **Business Logic** | 40% | Core shared, role-specific extensions |
| **UI Components** | 70% | Shared logic, platform-specific rendering |
| **App-Specific** | 0% | Pages, routing, app state |
| **Overall** | **70-75%** | Target achieved |

---

## Implementation Strategy

### Approach: Incremental, Non-Breaking

1. **Create new packages** without touching apps
2. **Add new imports** alongside old ones
3. **Test thoroughly** with both imports
4. **Remove old code** once verified
5. **One app at a time** (start with driver-web, it's cleaner)

### Testing Strategy

- Unit tests for feature hooks
- Integration tests for API calls
- E2E tests for critical flows
- Visual regression tests for UI components

---

## Priority Ranking

### 🔴 HIGH PRIORITY (Do First)
1. **Remove duplicate types** - Easy win, immediate benefit
2. **Remove duplicate utils** - Easy win, immediate benefit
3. **Complete `@mishwari/features/auth`** - High duplication, used everywhere

### 🟡 MEDIUM PRIORITY (Do Next)
4. **Create `@mishwari/features/profile`** - Moderate duplication
5. **Create `@mishwari/features/bookings`** - Role-specific, good separation
6. **Enhance `@mishwari/features/trips`** - Core functionality
7. **Theme & Layout Unification** - Consistent brand identity

### 🟢 LOW PRIORITY (Do Later)
8. **Refactor state management** - Works fine, can wait
9. **Standardize components** - Cosmetic, low impact

---

## Estimated Effort

| Phase | Effort | Risk | Value |
|-------|--------|------|-------|
| Phase 1 | 2 days | Low | High |
| Phase 2 | 3 days | Medium | High |
| Phase 3 | 5 days | Medium | High |
| Phase 4 | 5 days | High | Medium |
| Phase 5 | 2 days | Low | Low |
| Phase 6 | 2 days | Low | High |
| **Total** | **19 days** | - | - |

---

## Revised Recommendations

### Realistic Code Reuse Target: 55-60% (not 70-75%)

**Why Lower:**
- Role-specific UX dominates (passenger booking vs driver management)
- Redux state shapes differ significantly (can't share slices)
- Component composition overhead (base components too generic)
- Most "duplication" is intentional role-specific code

### Recommended Implementation Path

**Phase 1-2 (COMPLETE ✅):**
- Removed duplicate types/utils
- Extracted auth hooks to shared package
- **Result:** 40% code reuse achieved

**Next Steps (Priority Order):**

1. **Test Phase 1-2 Changes First** (CRITICAL)
   - Verify auth refactoring works in both apps
   - Run E2E tests for login/logout flows
   - Fix any issues before proceeding

2. **Phase 6: Theme & Layout Unification** (2 days - HIGH VALUE)
   - Extract Tailwind preset with design tokens
   - Create shared navigation components (AppShell, Sidebar, BottomNav)
   - Refactor both apps to use shared layouts
   - **Result:** 55% code reuse + consistent brand identity
   - **Risk:** Low - additive changes only

3. **Phase 5: Component Standardization** (1 day - QUICK WIN)
   - Replace passenger-web's duplicate DatePicker/PhoneInput/TextInput
   - Use shared components from @mishwari/ui-web
   - **Result:** 57% code reuse
   - **Risk:** Low - straightforward replacements

4. **Reassess Before Phase 3**
   - Measure actual impact of Phase 5-6
   - Decide if Phase 3 (feature packages) is worth the effort
   - Consider Phase 3 only if clear value demonstrated

**Don't Do (Low ROI):**
- Phase 4: State management refactoring (Redux works fine, high risk)
- Aggressive component composition (over-engineering)
- Extracting business logic to Zustand (use for new features only)

---

## Success Metrics

### Before Refactor
- Code duplication: ~40%
- Shared packages usage: 30%
- Maintenance overhead: High

### After Refactor (Target)
- Code duplication: <10%
- Shared packages usage: 70-75%
- Maintenance overhead: Low
- Consistent brand identity: 100%
- Role-appropriate UX: Maintained

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes | High | Incremental approach, keep old code until verified |
| State management migration | High | Optional, gradual migration |
| Component API changes | Medium | Composition pattern, backward compatible |
| Testing overhead | Medium | Automated tests, CI/CD |
| Team coordination | Low | Clear ownership, documentation |

---

## Next Steps

1. ✅ Review and approve this plan
2. ⏳ Start Phase 1 (Remove duplicates)
3. ⏳ Create feature packages structure
4. ⏳ Extract auth logic
5. ⏳ Test and validate
6. ⏳ Continue to Phase 3

---

---

## Key Insights from Navigation Analysis

### Why Different Pages Work with Same Structure

**Passenger Pages vs Driver Pages:**
```
Passenger:                Driver:
- Home (search trips)     - Dashboard (stats/overview)
- Bus List (view)         - Fleet Management (CRUD)
- My Trips (bookings)     - Trips Management (CRUD)
- Checkout (payment)      - Bookings Management (view/create)
- Profile (settings)      - Drivers Management (CRUD)
- Wallet (balance)        - KYC/Upgrade (verification)
```

**Same Structure Pattern:**
```
Both apps use: AppShell → Navigation → Content → Actions

Passenger: Navbar + Side Panel (right) + Bottom Nav
Driver:    Sidebar (left) + Verification Banner

Different content, unified structure!
```

### Navigation Reusability: 70%

| Component | Reusable | Notes |
|-----------|----------|-------|
| AppShell | 100% | Slot-based composition |
| Sidebar | 90% | Same component, different items |
| BottomNav | 90% | Same component, different items |
| NavItem | 100% | Shared active state logic |
| Logo | 100% | Fully shared |
| LogoutButton | 100% | Shared with variants |
| Navbar (Passenger) | 0% | Complex, passenger-specific |
| Nav Config | 0% | Role-specific routes |

**Benefits of Unified Navigation:**
- ✅ Easy to add mobile nav to driver-web (just use BottomNav component)
- ✅ Consistent behavior across apps (active states, transitions)
- ✅ Single source of truth for navigation patterns
- ✅ RTL/LTR flexibility (position prop on Sidebar)
- ✅ Role-specific routes stay in app configs

---

**Document Version:** 1.2  
**Last Updated:** 2025-01-07  
**Status:** ✅ Phase 1-2 Complete, Phase 6 Recommended Next
