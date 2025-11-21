# Operator-Web Application Architecture

**Version:** 3.0 (MVP)  
**Date:** 2024  
**App:** driver-web (Operator Platform)  
**Port:** 3001

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles & Scenarios](#user-roles--scenarios)
3. [Backend Models Reference](#backend-models-reference)
4. [KYC & Verification System](#kyc--verification-system)
5. [Page Structure & Routes](#page-structure--routes)
6. [Feature Flows](#feature-flows)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Trust & Safety](#trust--safety)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

### Purpose
Operator-web is a unified platform for bus operators (companies and individual drivers) to manage trips, fleet, bookings, and business operations. Individual drivers are treated as single-driver operators with the same interface.

### MVP Scope
**Included:**
- `role='driver'` and `role= 'operator_admin'` only
- Both trip types: `trip_type='scheduled'` and `trip_type='flexible'`
- KYC Sandbox (unverified can draft)
- Per-bus verification
- Per-driver verification (for invited drivers)
- Simplified UI for individual drivers

**Deferred:**
- `role='operator_staff'` (employee drivers)
- Advanced analytics
- GPS tracking

### Key Concept
**Individual Driver = Operator with 1 Driver (themselves)**
- Backend auto-creates BusOperator + Driver for role='driver'
- Simplified UI (e.g., "My Bus" instead of "Fleet")
- Driver auto-selected in trip creation
- Can upgrade to operator_admin later

### Technology Stack
- **Framework:** Next.js 14 (Pages Router)
- **State:** Redux Toolkit + Redux Persist + State Revalidation
- **Monorepo:** Turborepo + npm workspaces
- **Shared Packages:**
  - `@mishwari/api` - API client (100% shared)
  - `@mishwari/types` - TypeScript types (100% shared)
  - `@mishwari/utils` - Utilities (95% shared)
  - `@mishwari/features-auth` - Auth logic (100% shared)
  - `@mishwari/features-profile/driver` - Driver profile (role-specific)
  - `@mishwari/features-trips/driver` - Trip management (role-specific)
  - `@mishwari/ui-web` - Web components (platform-specific)
- **Styling:** Tailwind CSS + Cairo font

---

## User Roles & Scenarios

### Role 1: Individual Driver (`role='driver'`) ✅ MVP

**Concept:** Operator with 1 driver (themselves)

**Backend Auto-Creation:**
```
Registration (role='driver')
  ↓
Backend creates:
  - Profile (role='driver', is_verified=false)
  - BusOperator (name=full_name)
  - Driver (user=self, operator=BusOperator, is_verified=false)
```

**Simplified UI:**
- "My Bus" instead of "Fleet"
- Driver selection hidden (auto-filled)
- "Add Driver" button shows upgrade prompt
- Streamlined navigation

**Expansion Path:**
- Add more buses anytime (each requires verification)
- Request upgrade to operator_admin
- Upgrade requires company KYC
- After upgrade: Full driver management

---

### Role 2: Transport Company (`role='operator_admin'`) ✅ MVP

**Concept:** Full operator with multiple drivers

**Backend Auto-Creation:**
```
Registration (role='operator_admin')
  ↓
Backend creates:
  - Profile (role='operator_admin', is_verified=false)
  - BusOperator (name=company_name)
  - NO Driver record
```

**Full UI:**
- "Fleet" page with all buses
- Driver management page
- Driver invitation system
- Multi-driver trip scheduling

**Driver Invitation Flow:**
```
1. Operator invites driver (phone number)
2. Driver registers via OTP
3. Driver uploads personal KYC (License, ID)
4. Platform reviews & approves
5. Driver.is_verified = true
6. Can now be assigned to trips
```

---

### Role 3: Company Driver (`role='operator_staff'`) ❌ DEFERRED

**Status:** Deferred to post-MVP

---

## Backend Models Reference

### Profile Model
```python
role: 'passenger' | 'driver' | 'operator_admin' | 'operator_staff'
is_verified: Boolean (default: False)  # Operator-level verification
mobile_number: String (unique)
full_name: String
email: String
birth_date: String
gender: String
```

### Driver Model (UPDATED)
```python
user: FK(User)
profile: FK(Profile)
national_id: String
driver_license: String
driver_rating: Decimal
is_verified: Boolean (default: False)  # NEW: Driver-level verification
buses: M2M(Bus)
operator: FK(BusOperator)
```

### Bus Model (UPDATED)
```python
operator: FK(BusOperator)
bus_number: String (unique)
bus_type: String
capacity: Integer
amenities: JSON
is_verified: Boolean (default: False)  # NEW: Bus-level verification
```

### Trip Model
```python
operator: FK(BusOperator)
bus: FK(Bus)
driver: FK(Driver)
from_city: FK(CityList)
to_city: FK(CityList)
journey_date: Date
trip_type: 'scheduled' | 'flexible'
planned_departure: DateTime (for scheduled)
departure_window_start: DateTime (for flexible)
departure_window_end: DateTime (for flexible)
actual_departure: DateTime (nullable)
status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled'
seat_matrix: JSON
```

### OperatorMetrics Model
```python
operator: FK(BusOperator)
health_score: Integer (0-100, default: 100)
cancellation_rate: Float
double_booking_count: Integer
strikes: Integer
is_suspended: Boolean
trip_limit: Integer (default: 2)
payout_hold_hours: Integer (default: 24)
```

---

## KYC & Verification System

### KYC Sandbox (NEW)

**Concept:** Unverified operators can explore and prepare

**Unverified Access:**
- ✅ Login and dashboard
- ✅ Add buses (unverified)
- ✅ Create draft trips
- ✅ View interface
- ❌ Publish trips (blocked)
- ❌ Receive bookings (blocked)

**UI Behavior:**
```
Persistent banner: "أكمل التوثيق لنشر رحلاتك"
Trip creation: Saves as status='draft'
Publish button: Disabled with tooltip "يتطلب التوثيق"
```

---

### Three-Level Verification

#### Level 1: Operator Verification (Profile.is_verified)

**For role='driver':**
- Personal documents (ID, License, Selfie)
- Business info (Bank account, emergency contact)

**For role='operator_admin':**
- Company documents (Commercial reg, Tax, License)
- Business info (Company bank, operational regions)

**Status:** Enables operator to publish trips (if bus + driver verified)

---

#### Level 2: Bus Verification (Bus.is_verified) - NEW

**Per-Bus KYC Flow:**
```
1. Operator adds bus
   ↓
2. Bus created with is_verified=false
   ↓
3. Upload bus documents:
   - Registration certificate
   - Insurance certificate
   - Safety inspection
   - Bus photos (4 angles)
   ↓
4. Platform reviews (24-48h)
   ↓
5. Bus.is_verified = true
   ↓
6. Bus can be used in published trips
```

**UI:**
- Bus card shows verification badge
- Unverified buses have "Complete Verification" button
- Trip creation: Can select unverified bus (saves as draft)
- Publish blocked if bus unverified

---

#### Level 3: Driver Verification (Driver.is_verified) - NEW

**For role='driver' (self):**
- Verified via operator KYC (Level 1)
- Driver.is_verified synced with Profile.is_verified

**For invited drivers (operator_admin):**
```
1. Operator invites driver
   ↓
2. Driver registers
   ↓
3. Driver.is_verified = false
   ↓
4. Driver uploads personal KYC:
   - National ID (front/back)
   - Driver's License (front/back)
   - Selfie with ID
   ↓
5. Platform reviews (24-48h)
   ↓
6. Driver.is_verified = true
   ↓
7. Can be assigned to published trips
```

**UI:**
- Driver card shows verification badge
- Unverified drivers have "Pending Verification" status
- Trip creation: Can select unverified driver (saves as draft)
- Publish blocked if driver unverified

---

### Golden Rule of Enforcement

**Backend Validation:**
```python
def can_publish_trip(trip):
    return (
        trip.operator.profile.is_verified == True AND
        trip.bus.is_verified == True AND
        trip.driver.is_verified == True
    )
```

**Trip Status Flow:**
```
Draft → (All verified) → Published → Active → Completed
  ↑                           ↓
  └─────── (Unverified) ──────┘
```

**UI Enforcement:**
- Publish button disabled if any verification missing
- Tooltip shows: "يتطلب توثيق: [السائق/الحافلة/الحساب]"
- Draft trips visible only to operator
- Published trips visible to passengers

---

### Verification States

#### State 1: Sandbox (Unverified)
- **Access:** Full UI access, draft mode
- **Can:** Add buses, create draft trips, explore
- **Cannot:** Publish trips, receive bookings
- **UI:** Persistent banner "أكمل التوثيق لنشر رحلاتك"

#### State 2: Pending Review
- **Access:** Same as sandbox
- **UI:** Yellow banner "مستنداتك قيد المراجعة"

#### State 3: Verified
- **Access:** Full publish access (if bus + driver verified)
- **UI:** Green badge "حساب موثق ✓"

#### State 4: Rejected
- **Access:** Re-upload documents
- **UI:** Red banner with rejection reasons

#### State 5: Suspended
- **Access:** View only
- **UI:** Red banner "تم تعليق حسابك"

---

## Page Structure & Routes

### Simplified UI Principle

**For role='driver':**
- "My Bus" instead of "Fleet"
- "My Trips" instead of "Trips"
- Driver selection hidden
- "Add Driver" shows upgrade prompt
- Simplified navigation

**For role='operator_admin':**
- Full "Fleet" page
- Full "Drivers" page
- Driver selection visible
- Complete navigation

---

### Shared Pages

#### `/dashboard`
**Content:**
- Verification status banner (sandbox mode)
- Quick stats
- Recent activity
- **role='driver':** "Upgrade to Company" button

---

#### `/fleet` (operator_admin) or `/my-bus` (driver)
**Content:**
- Bus list with verification badges
- Add bus button
- Per-bus verification status
- "Complete Verification" buttons

---

#### `/trips`
**Content:**
- Trip list (draft + published)
- Draft badge for unpublished trips
- Create trip button
- Publish button (conditional)

---

#### `/trips/create`
**Content:**
- Bus selection (shows verification status)
- Driver selection (conditional, shows verification status)
- Route selection
- Trip type selection: Scheduled or Flexible
- **If Scheduled:** Date & time picker
- **If Flexible:** Departure window (start/end times)
- **Save as Draft** or **Publish** (conditional)

**Logic:**
```typescript
const canPublish = 
  profile.is_verified && 
  selectedBus.is_verified && 
  selectedDriver.is_verified;

<Button disabled={!canPublish}>
  {canPublish ? 'نشر الرحلة' : 'حفظ كمسودة'}
</Button>
```

---

#### `/fleet/[busId]/verify` (NEW)
**Content:**
- Bus document upload form
- Registration certificate
- Insurance certificate
- Safety inspection
- Bus photos
- Submit for review

---

#### `/drivers` (operator_admin only)
**Content:**
- Driver list with verification badges
- Invite driver button
- Driver verification status
- "Pending Verification" indicators

---

#### `/drivers/[driverId]/verify` (NEW)
**Content:**
- Driver document upload form (for invited drivers)
- National ID
- Driver's License
- Selfie with ID
- Submit for review

---

#### `/upgrade` (driver only)
**Content:**
- Upgrade benefits
- Company KYC form
- Submit upgrade request

---

## Feature Flows

### Flow 1: Individual Driver Onboarding (KYC Sandbox)

```
1. Register as driver
   ↓
2. Dashboard (Sandbox Mode)
   Banner: "أكمل التوثيق لنشر رحلاتك"
   ↓
3. Add Bus
   - Enter bus details
   - Bus.is_verified = false
   ↓
4. Create Draft Trip
   - Select unverified bus
   - Driver auto-selected (self, unverified)
   - Save as status='draft'
   - Publish button disabled
   ↓
5. Complete Operator KYC
   - Upload personal documents
   - Upload business info
   ↓
6. Complete Bus KYC
   - Upload bus documents
   ↓
7. Platform Reviews (24-48h)
   ↓
8. All Verified
   - Profile.is_verified = true
   - Driver.is_verified = true (synced)
   - Bus.is_verified = true
   ↓
9. Publish Trip
   - Draft trip now publishable
   - Click "Publish"
   - Trip.status = 'published'
   ↓
10. Trip Goes Live
    - Visible to passengers
    - Can receive bookings
```

---

### Flow 2: Operator Admin with Driver Invitation

```
1. Register as operator_admin
   ↓
2. Dashboard (Sandbox Mode)
   ↓
3. Add Bus
   - Bus.is_verified = false
   ↓
4. Complete Operator KYC
   - Upload company documents
   ↓
5. Complete Bus KYC
   - Upload bus documents
   ↓
6. Invite Driver
   - Enter phone number
   - Send invitation
   ↓
7. Driver Registers
   - Receives OTP
   - Creates account
   - Driver.is_verified = false
   ↓
8. Driver Completes KYC
   - Uploads personal documents
   - Platform reviews
   - Driver.is_verified = true
   ↓
9. All Verified
   - Profile.is_verified = true
   - Bus.is_verified = true
   - Driver.is_verified = true
   ↓
10. Create & Publish Trip
    - Select verified bus
    - Select verified driver
    - Publish immediately
```

---

### Flow 3: Per-Bus Verification

```
1. Operator adds bus
   ↓
2. Bus created (is_verified=false)
   ↓
3. Bus card shows "Unverified" badge
   ↓
4. Click "Complete Verification"
   ↓
5. Upload documents:
   - Registration certificate
   - Insurance certificate
   - Safety inspection
   - Photos (front, back, interior, side)
   ↓
6. Submit for review
   ↓
7. Platform reviews (24-48h)
   ↓
8. Approved: Bus.is_verified = true
   ↓
9. Bus card shows "Verified ✓" badge
   ↓
10. Can be used in published trips
```

---

## State Management

### Redux Store Structure

```typescript
store/
├── slices/
│   ├── authSlice.ts          // Auth + role + verification flags
│   ├── mobileAuthSlice.ts    // OTP flow
│   ├── tripsSlice.ts         // Trips (draft + published)
│   ├── fleetSlice.ts         // Buses with verification status
│   ├── driversSlice.ts       // Drivers with verification status
│   ├── bookingsSlice.ts      // Bookings
│   ├── kycSlice.ts           // KYC status (operator, buses, drivers)
│   └── metricsSlice.ts       // Operator metrics
└── actions/
    ├── mobileAuthActions.ts
    ├── tripsActions.ts
    ├── fleetActions.ts
    ├── driversActions.ts
    ├── bookingsActions.ts
    └── kycActions.ts
```

### State Revalidation Strategy (NEW)

**Problem:** Redux Persist may have stale verification data

**Solution:**
```typescript
// On app load
useEffect(() => {
  dispatch(revalidateUserState());
}, []);

// On window focus
useEffect(() => {
  const handleFocus = () => {
    dispatch(revalidateUserState());
  };
  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, []);

// revalidateUserState action
export const revalidateUserState = () => async (dispatch) => {
  const response = await authApi.getMe(); // GET /auth/me
  dispatch(authSlice.actions.updateUser({
    is_verified: response.data.is_verified,
    is_suspended: response.data.operator_metrics?.is_suspended,
    role: response.data.role,
  }));
};
```

**Critical Fields to Revalidate:**
- `Profile.is_verified`
- `OperatorMetrics.is_suspended`
- `Driver.is_verified`
- `Bus.is_verified`

---

### Auth Slice (UPDATED)

```typescript
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  status: 'complete' | 'partial';
  user?: {
    id: number;
    username: string;
    role: 'driver' | 'operator_admin';
    is_verified: boolean;
    is_suspended: boolean;  // NEW
  };
  // Helper flags
  isOperator: boolean;
  canManageDrivers: boolean;
  canUpgrade: boolean;
  canPublish: boolean;  // NEW: Based on verification
}
```

### Fleet Slice (UPDATED)

```typescript
interface FleetState {
  buses: Bus[];
  selectedBus: Bus | null;
  loading: boolean;
}

interface Bus {
  id: number;
  bus_number: string;
  bus_type: string;
  capacity: number;
  amenities: Record<string, boolean>;
  is_verified: boolean;  // NEW
  verification_status: 'pending' | 'approved' | 'rejected';  // NEW
}
```

### Drivers Slice (UPDATED)

```typescript
interface DriversState {
  drivers: Driver[];
  selectedDriver: Driver | null;
  invitations: Invitation[];
  loading: boolean;
}

interface Driver {
  id: number;
  full_name: string;
  driver_license: string;
  is_verified: boolean;  // NEW
  verification_status: 'pending' | 'approved' | 'rejected';  // NEW
}
```

### Trips Slice (UPDATED)

```typescript
interface TripsState {
  trips: Trip[];
  draftTrips: Trip[];  // NEW
  publishedTrips: Trip[];  // NEW
  selectedTrip: Trip | null;
  loading: boolean;
}

interface Trip {
  id: number;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  trip_type: 'scheduled' | 'flexible';
  planned_departure?: DateTime;  // For scheduled
  departure_window_start?: DateTime;  // For flexible
  departure_window_end?: DateTime;  // For flexible
  actual_departure?: DateTime;
  bus: Bus;
  driver: Driver;
  can_publish: boolean;  // Computed from verifications
}
```

---

## API Integration

### Auth API (UPDATED)

```typescript
authApi.requestOtp({ phone: string })
authApi.verifyOtp({ phone: string, otp: string })
authApi.completeProfile({ username, full_name, email, role, gender, birth_date })
authApi.getMe()  // NEW: For state revalidation
```

### Operator API (UPDATED)

```typescript
operatorApi.getTrips()  // Returns draft + published
operatorApi.createTrip(tripData)  // Creates as draft
operatorApi.publishTrip(tripId)  // NEW: Publish draft trip
operatorApi.updateTripStatus(tripId, status)
operatorApi.getFleet()  // Returns buses with is_verified
operatorApi.addBus(busData)  // Creates with is_verified=false
operatorApi.updateBus(busId, busData)
operatorApi.getDrivers()  // Returns drivers with is_verified
operatorApi.inviteDriver(phone, name)
operatorApi.assignDriver(busId, driverId)
operatorApi.createPhysicalBooking(bookingData)
operatorApi.getTripBookings(tripId)
operatorApi.requestUpgrade(companyData)
operatorApi.getUpgradeStatus()
```

### KYC API (NEW)

```typescript
kycApi.uploadOperatorDocument(type, file)
kycApi.uploadBusDocument(busId, type, file)  // NEW
kycApi.uploadDriverDocument(driverId, type, file)  // NEW
kycApi.getOperatorKYCStatus()
kycApi.getBusKYCStatus(busId)  // NEW
kycApi.getDriverKYCStatus(driverId)  // NEW
kycApi.submitOperatorForReview()
kycApi.submitBusForReview(busId)  // NEW
kycApi.submitDriverForReview(driverId)  // NEW
```

---

## Trust & Safety

### Golden Rule Enforcement

**Backend Validation (CRITICAL):**
```python
# In Trip.publish() or Trip.save()
def clean(self):
    if self.status == 'published':
        if not self.operator.profile.is_verified:
            raise ValidationError("Operator not verified")
        if not self.bus.is_verified:
            raise ValidationError("Bus not verified")
        if not self.driver.is_verified:
            raise ValidationError("Driver not verified")
```

**Frontend Validation:**
```typescript
const canPublishTrip = (trip: Trip) => {
  return (
    trip.operator.is_verified &&
    trip.bus.is_verified &&
    trip.driver.is_verified
  );
};
```

### Health Score System

**Starting Score:** 100

**Penalties:**
- Trip cancellation: -10
- Double booking: -20
- Safety violation: -30
- Late departure (>30 min): -5

**Rewards:**
- 10 successful trips: +5
- 50 successful trips: +10
- 5-star rating: +2

### Trip Limits

**New Operators (0-10 trips):**
- Max 2 concurrent trips
- 24-hour payout hold

**Growing Operators (11-50 trips):**
- Max 5 concurrent trips
- 12-hour payout hold

**Established Operators (51+ trips):**
- Max 10 concurrent trips
- 6-hour payout hold

---

## Implementation Roadmap

### ✅ Phase 0: Monorepo Setup (Complete)
- [x] Created driver-web app structure
- [x] Setup Redux store
- [x] Created pages structure
- [x] Tested dev server

### ✅ Phase 1: Authentication (Complete)
- [x] Login flow with OTP
- [x] Role selection (driver vs operator_admin)
- [x] Profile completion
- [x] Token encryption

### ⏳ Phase 2: KYC Sandbox (Week 3-4)
- [ ] Update backend models (add is_verified to Bus, Driver)
- [ ] Implement draft trip status
- [ ] Sandbox mode UI (persistent banner)
- [ ] State revalidation on app load/focus
- [ ] Operator KYC flow
- [ ] Per-bus KYC flow
- [ ] Per-driver KYC flow (for invited drivers)

### Phase 3: Trip Management (Week 5-6)
- [ ] Trip listing (draft + published)
- [ ] Trip creation (scheduled + flexible)
- [ ] Trip type toggle
- [ ] Departure window picker for flexible trips
- [ ] Depart now button for flexible trips
- [ ] Publish button with validation
- [ ] Draft trip editing
- [ ] Trip details page

### Phase 4: Fleet & Driver Management (Week 7-8)
- [ ] Simplified "My Bus" for role='driver'
- [ ] Full "Fleet" for role='operator_admin'
- [ ] Bus verification flow
- [ ] Driver invitation system
- [ ] Driver verification flow
- [ ] Conditional UI rendering

### Phase 5: Bookings (Week 9)
- [ ] Physical booking creation
- [ ] Booking list
- [ ] Booking details

### Phase 6: Upgrade System (Week 10)
- [ ] Upgrade request flow
- [ ] Company KYC for upgrade
- [ ] Role migration (driver → operator_admin)

### Phase 7: Polish & Testing (Week 11-12)
- [ ] UI/UX refinements
- [ ] Mobile responsiveness
- [ ] End-to-end testing
- [ ] Performance optimization

---

## Backend Changes Required

### 1. Add Verification Fields

```python
# In Bus model
class Bus(models.Model):
    # ... existing fields
    is_verified = models.BooleanField(default=False)  # NEW
    verification_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )  # NEW
    verification_documents = models.JSONField(default=dict)  # NEW

# In Driver model
class Driver(models.Model):
    # ... existing fields
    is_verified = models.BooleanField(default=False)  # NEW
    verification_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )  # NEW
    verification_documents = models.JSONField(default=dict)  # NEW

# In Trip model
class Trip(models.Model):
    # ... existing fields
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),  # NEW
            ('published', 'Published'),
            ('active', 'Active'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled')
        ],
        default='draft'
    )  # UPDATED
```

### 2. Add Validation

```python
# In Trip model
def clean(self):
    if self.status == 'published':
        if not self.operator.profile.is_verified:
            raise ValidationError("Operator must be verified to publish trips")
        if not self.bus.is_verified:
            raise ValidationError("Bus must be verified to publish trips")
        if not self.driver.is_verified:
            raise ValidationError("Driver must be verified to publish trips")
    
    # Validate trip type fields
    if self.trip_type == 'scheduled' and not self.planned_departure:
        raise ValidationError("Scheduled trips require planned_departure")
    if self.trip_type == 'flexible' and not (self.departure_window_start and self.departure_window_end):
        raise ValidationError("Flexible trips require departure window")
```

### 3. Add Endpoints

```python
# New endpoints
POST /api/operator/buses/{id}/verify/  # Upload bus documents
POST /api/operator/drivers/{id}/verify/  # Upload driver documents
POST /api/operator/trips/{id}/publish/  # Publish draft trip
POST /api/operator/trips/{id}/depart_now/  # Trigger flexible trip departure
GET /api/auth/me/  # Get current user with verification status
```

---

## Monorepo Structure & Code Reuse

### Driver-Web App Structure
```
apps/driver-web/
├── src/
│   ├── components/          # 30% app-specific UI
│   │   ├── fleet/           # BusCard, BusForm
│   │   ├── trips/           # TripCard, TripForm (operator-specific)
│   │   ├── bookings/        # BookingCard, PhysicalBookingForm
│   │   ├── drivers/         # DriverCard, DriverInviteForm
│   │   ├── upgrade/         # UpgradeCard, CompanyKYCForm
│   │   └── kyc/             # KYC upload components
│   ├── hooks/               # App-specific hooks
│   │   ├── useAuth.ts       # Wrapper for @mishwari/features-auth
│   │   ├── useRole.ts       # Role helpers (canManageDrivers, etc.)
│   │   └── useRevalidate.ts # State revalidation
│   ├── store/               # Redux store (app-specific)
│   │   ├── slices/
│   │   └── actions/
│   ├── pages/               # Next.js pages
│   │   ├── dashboard.tsx
│   │   ├── my-bus/          # Simplified for driver
│   │   ├── fleet/           # Full for operator_admin
│   │   ├── trips/
│   │   ├── drivers/
│   │   ├── upgrade/
│   │   └── kyc/
│   └── styles/
└── package.json
```

### Shared Packages (70% Code Reuse)

#### 100% Shared Across All Apps
```
packages/
├── api/                     # ✅ API client (100% shared)
│   └── src/
│       ├── client.ts        # Axios instance
│       ├── auth.ts          # Login, OTP, register
│       ├── profile.ts       # Profile CRUD
│       ├── trips.ts         # Trip search (passenger)
│       ├── operator.ts      # Operator endpoints (driver-web)
│       └── index.ts
│
├── types/                   # ✅ TypeScript types (100% shared)
│   └── src/
│       ├── user.ts
│       ├── profile.ts       # Profile with role field
│       ├── trip.ts          # Trip with trip_type, status
│       ├── booking.ts       # Booking with booking_source
│       ├── bus.ts           # Bus with is_verified
│       ├── driver.ts        # Driver with is_verified
│       └── index.ts
│
└── utils/                   # ✅ Utilities (95% shared)
    └── src/
        ├── date.ts          # formatDate, parseDate
        ├── currency.ts      # formatCurrency
        ├── validation.ts    # Form validators
        ├── encryption.ts    # encryptToken, decryptToken
        └── index.ts
```

#### Role-Specific Features
```
packages/features/
├── auth/                    # ✅ 100% shared (all apps)
│   └── src/
│       ├── useAuth.ts       # Login, logout, token management
│       ├── useOTP.ts        # OTP flow
│       └── index.ts
│
├── profile/                 # 🔀 Role-specific
│   └── src/
│       ├── core/            # ✅ Shared basic profile
│       │   ├── useProfile.ts
│       │   └── types.ts
│       ├── passenger/       # Passenger-only
│       │   └── index.ts     # Re-exports core
│       └── driver/          # Driver-only
│           ├── useDriverProfile.ts
│           ├── useKYC.ts
│           └── index.ts     # Re-exports core + driver
│
└── trips/                   # 🔀 Role-specific
    └── src/
        ├── core/            # ✅ Shared search/view
        │   ├── useTrips.ts
        │   └── useFilters.ts
        ├── passenger/       # Passenger booking
        │   ├── useBooking.ts
        │   └── index.ts
        └── driver/          # Operator trip management
            ├── useTripManagement.ts
            ├── useRouteCreation.ts
            └── index.ts
```

#### Platform-Specific UI
```
packages/
├── ui-primitives/           # ✅ Shared types & logic (100%)
│   └── src/
│       ├── Button.types.ts  # ButtonProps interface
│       ├── Input.types.ts
│       ├── hooks/
│       │   ├── useForm.ts   # Form logic
│       │   └── useValidation.ts
│       └── index.ts
│
├── ui-web/                  # Web components (Tailwind)
│   └── src/
│       ├── Button.tsx       # Implements ButtonProps
│       ├── Input.tsx
│       ├── PhoneInput.tsx   # Used in driver-web login
│       ├── OtpInput.tsx     # Used in driver-web OTP
│       ├── DatePicker.tsx
│       └── index.ts
│
└── ui-native/               # Mobile components (React Native)
    └── src/
        ├── Button.tsx       # Same API, different rendering
        ├── Input.tsx
        └── index.ts
```

### Import Examples in Driver-Web

```typescript
// ✅ 100% Shared - All apps use these
import { operatorApi, authApi } from '@mishwari/api'
import { Trip, Bus, Driver, Profile } from '@mishwari/types'
import { formatDate, encryptToken } from '@mishwari/utils'
import { useAuth } from '@mishwari/features-auth'

// ✅ Driver-specific features
import { useDriverProfile, useKYC } from '@mishwari/features-profile/driver'
import { useTripManagement } from '@mishwari/features-trips/driver'

// ✅ Web-specific UI
import { Button, PhoneInput, OtpInput } from '@mishwari/ui-web'

// ❌ App-specific (not shared)
import { BusCard } from '@/components/fleet/BusCard'
import { useRole } from '@/hooks/useRole'
```

### Code Reuse Breakdown

| Layer | Shared % | Notes |
|-------|----------|-------|
| **API Client** | 100% | All endpoints in @mishwari/api |
| **Types** | 100% | All models in @mishwari/types |
| **Utils** | 95% | Date, currency, validation, encryption |
| **Auth** | 100% | Login, OTP, token management |
| **Business Logic** | 40% | Core shared, role-specific extensions |
| **UI Components** | 70% | Shared logic, platform-specific rendering |
| **App-Specific** | 0% | Pages, routing, app state |
| **Overall** | **70%** | Matches monorepo target |

### Future Mobile Apps

When building driver-mobile:
```typescript
// Same imports, different UI package
import { operatorApi } from '@mishwari/api'  // ✅ Same
import { Trip, Bus } from '@mishwari/types'  // ✅ Same
import { useAuth } from '@mishwari/features-auth'  // ✅ Same
import { useTripManagement } from '@mishwari/features-trips/driver'  // ✅ Same
import { Button } from '@mishwari/ui-native'  // ❌ Different (mobile)
```

**Result:** Build driver-mobile with ~70% code reuse from driver-web!

---

---

## Conclusion

**MVP Focus:**
- ✅ Two roles only (driver, operator_admin)
- ✅ Both trip types (scheduled + flexible)
- ✅ KYC Sandbox (explore before verification)
- ✅ Three-level verification (operator, bus, driver)
- ✅ Golden Rule enforcement
- ✅ Simplified UI for drivers
- ✅ State revalidation

**Deferred:**
- ❌ operator_staff role
- ❌ Advanced analytics
- ❌ GPS tracking

---

**Document Version:** 3.0 (MVP)  
**Last Updated:** 2024  
**Status:** ✅ Ready for MVP Implementation
