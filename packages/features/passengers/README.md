# @mishwari/features-passengers

Shared passenger management feature for Mishwari monorepo.

## Installation

```bash
pnpm add @mishwari/features-passengers
```

## Usage

```typescript
import { usePassengerManager } from '@mishwari/features-passengers/core';

function MyComponent() {
  const {
    passengers,           // Passenger[] - Current passengers list
    loading,             // boolean - Loading state
    error,               // string | null - Error message
    fetchPassengers,     // () => Promise<void>
    addPassenger,        // (data) => Promise<Passenger>
    updatePassenger,     // (id, data) => Promise<void>
    deletePassenger,     // (id) => Promise<void>
    toggleCheck,         // (id) => void
    getCheckedPassengers, // () => Passenger[]
    validatePassenger,   // (data) => { valid, errors }
    checkDuplicate,      // (data) => boolean
  } = usePassengerManager();

  // Fetch passengers on mount
  useEffect(() => {
    fetchPassengers();
  }, []);

  // Add passenger
  const handleAdd = async () => {
    try {
      await addPassenger({
        name: 'John Doe',
        phone: '0501234567',
        email: 'john@example.com',
        age: 30,
        gender: 'male',
        is_checked: true,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  // Update passenger
  const handleUpdate = async (id: number) => {
    await updatePassenger(id, { name: 'Jane Doe' });
  };

  // Delete passenger
  const handleDelete = async (id: number) => {
    await deletePassenger(id);
  };

  // Toggle checkbox
  const handleToggle = (id: number) => {
    toggleCheck(id);
  };

  // Get only checked passengers
  const checkedPassengers = getCheckedPassengers();
  const total = checkedPassengers.length * pricePerSeat;

  return <div>...</div>;
}
```

## API Reference

### `usePassengerManager()`

Returns an object with the following properties and methods:

#### State
- `passengers: Passenger[]` - Array of all passengers
- `loading: boolean` - True when API call is in progress
- `error: string | null` - Error message if operation failed

#### Methods

##### `fetchPassengers(): Promise<void>`
Fetches all passengers from the backend.

##### `addPassenger(data: Omit<Passenger, 'id'>): Promise<Passenger>`
Creates a new passenger. Validates data before sending to backend.

**Throws:** Error if validation fails or API call fails

##### `updatePassenger(id: number, data: Partial<Passenger>): Promise<void>`
Updates an existing passenger by ID.

**Throws:** Error if API call fails

##### `deletePassenger(id: number): Promise<void>`
Deletes a passenger by ID. Syncs with backend.

**Throws:** Error if API call fails

##### `toggleCheck(id: number): void`
Toggles the `is_checked` property of a passenger. Local state only.

##### `getCheckedPassengers(): Passenger[]`
Returns array of passengers where `is_checked === true`.

##### `validatePassenger(data: Partial<Passenger>): { valid: boolean; errors: string[] }`
Validates passenger data.

**Validation Rules:**
- Name is required
- Phone is required
- Email must be valid format (if provided)

##### `checkDuplicate(data: Partial<Passenger>): boolean`
Checks if a passenger with the same phone or email already exists.

## Types

```typescript
interface Passenger {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  gender: string;  // 'male' | 'female'
  is_checked?: boolean;
}
```

## Backend Requirements

Requires the following API endpoints:

- `GET /passengers/` - List all passengers
- `POST /passengers/` - Create passenger
- `PUT /passengers/:id/` - Update passenger
- `DELETE /passengers/:id/` - Delete passenger

## Features

✅ ID-based operations (no index conflicts)  
✅ Built-in validation  
✅ Duplicate detection  
✅ Backend synchronization  
✅ TypeScript support  
✅ Error handling  
✅ Loading states  

## License

Private - Mishwari Project
