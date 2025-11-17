# Passenger Management Migration Guide

## ✅ What Was Implemented

### 1. Feature Package: `@mishwari/features-passengers`
**Location:** `packages/features/passengers/`

**Structure:**
```
packages/features/passengers/
├── src/
│   ├── core/
│   │   ├── usePassengerManager.ts    # Main hook with CRUD operations
│   │   ├── types.ts                  # TypeScript interfaces
│   │   └── index.ts
│   ├── passenger/
│   │   ├── usePassengerList.ts       # Passenger-specific wrapper
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

**Key Features:**
- ✅ ID-based operations (no index conflicts)
- ✅ Local state management with `useState`
- ✅ Built-in validation
- ✅ Duplicate checking
- ✅ Backend sync for all CRUD operations
- ✅ Checkbox toggle functionality
- ✅ Get checked passengers helper

### 2. Shared UI Components: `@mishwari/ui-web`
**Location:** `packages/ui-web/src/components/passengers/`

**Components:**
- `PassengerForm` - Reusable form for add/edit
- `PassengerItem` - Single passenger row with actions
- `PassengerList` - Full list with add/edit/delete/check

### 3. Standalone Passengers Page
**Location:** `apps/passenger-web/src/pages/passengers/index.tsx`

Full CRUD interface for managing saved passengers.

### 4. Refactored Trip Details Page
**Location:** `apps/passenger-web/src/pages/bus_list/[tripId].refactored.tsx`

Uses shared hook and components instead of Redux slices.

---

## 🔄 Migration Steps

### Step 1: Install Dependencies
```bash
cd apps/passenger-web
pnpm install
```

### Step 2: Replace Old Implementation
```bash
# Backup current file
mv src/pages/bus_list/[tripId].tsx src/pages/bus_list/[tripId].old.tsx

# Use refactored version
mv src/pages/bus_list/[tripId].refactored.tsx src/pages/bus_list/[tripId].tsx
```

### Step 3: Remove Old Redux Slices (Optional - after testing)
Once confirmed working, remove:
- `src/store/slices/passengersSlice.ts`
- `src/store/actions/passengersActions.ts`
- Passenger-related code from `bookingCreationSlice.ts`

### Step 4: Remove Old Component
- `src/components/PassengerModal.tsx` (replaced by shared components)

---

## 📝 API Requirements

Ensure backend supports these endpoints:

```
GET    /passengers/           # List all passengers
POST   /passengers/           # Create passenger
PUT    /passengers/:id/       # Update passenger
DELETE /passengers/:id/       # Delete passenger
```

**Expected Passenger Schema:**
```typescript
{
  id: number | null;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  gender: string;  // 'male' | 'female'
  is_checked: boolean;
}
```

---

## 🎯 Usage Examples

### Using the Hook
```typescript
import { usePassengerManager } from '@mishwari/features-passengers/core';

function MyComponent() {
  const {
    passengers,
    loading,
    error,
    fetchPassengers,
    addPassenger,
    updatePassenger,
    deletePassenger,
    toggleCheck,
    getCheckedPassengers,
  } = usePassengerManager();

  useEffect(() => {
    fetchPassengers();
  }, []);

  const handleAdd = async () => {
    await addPassenger({
      name: 'John Doe',
      phone: '0501234567',
      email: 'john@example.com',
      age: 30,
      gender: 'male',
      is_checked: true,
    });
  };

  const checkedPassengers = getCheckedPassengers();
  const total = checkedPassengers.length * pricePerSeat;

  return <div>...</div>;
}
```

### Using Shared Components
```typescript
import { PassengerList, PassengerForm } from '@mishwari/ui-web';

<PassengerList
  passengers={passengers}
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleCheck={handleToggleCheck}
  showCheckbox={true}
  title="عدد الركاب"
/>

<PassengerForm
  passenger={editingPassenger}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitLabel="حفظ"
/>
```

---

## ✨ Benefits Over Old Implementation

| Old Approach | New Approach |
|-------------|--------------|
| Index-based operations | ✅ ID-based operations |
| Duplicate state (2 slices) | ✅ Single source of truth |
| No backend sync on delete | ✅ Full backend sync |
| Gender type mismatch | ✅ Consistent types |
| No validation | ✅ Built-in validation |
| No duplicate check | ✅ Duplicate prevention |
| Redux complexity | ✅ Simple hook API |
| Tightly coupled | ✅ Reusable across apps |

---

## 🔍 Resolved Conflicts

1. ✅ **Duplicate Profile User** - Hook manages deduplication by ID
2. ✅ **Index Shifting** - All operations use ID, not index
3. ✅ **Race Conditions** - Proper async/await handling
4. ✅ **Delete Not Synced** - Delete now calls backend API
5. ✅ **Gender Type Mismatch** - Standardized on string type
6. ✅ **No Validation** - Built-in validation in hook
7. ✅ **State Duplication** - Single state in hook
8. ✅ **Edit Index Issues** - Edit by ID, not index
9. ✅ **Amount Calculation** - Helper function provided
10. ✅ **No Duplicate Check** - Built-in duplicate checking

---

## 🧪 Testing Checklist

- [ ] Standalone passengers page loads
- [ ] Can add new passenger
- [ ] Can edit existing passenger
- [ ] Can delete passenger (syncs to backend)
- [ ] Trip details page loads
- [ ] Can select/deselect passengers
- [ ] Amount calculates correctly
- [ ] Can proceed to payment with checked passengers
- [ ] Validation works (required fields)
- [ ] Duplicate detection works
- [ ] No console errors

---

## 🚀 Next Steps

1. Test standalone passengers page
2. Test refactored trip details page
3. Verify backend API compatibility
4. Remove old Redux slices after confirmation
5. Update other apps (passenger-mobile) to use shared package
6. Add unit tests for hook
7. Add integration tests

---

## 📞 Support

If issues arise:
1. Check browser console for errors
2. Verify API endpoints are working
3. Check network tab for failed requests
4. Ensure dependencies are installed (`pnpm install`)
5. Verify TypeScript compilation (`pnpm build`)
