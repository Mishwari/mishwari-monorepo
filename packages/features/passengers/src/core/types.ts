import { Passenger } from '@mishwari/types';

export interface UsePassengerManagerReturn {
  passengers: Passenger[];
  loading: boolean;
  error: string | null;
  fetchPassengers: () => Promise<void>;
  addPassenger: (passenger: Omit<Passenger, 'id'>) => Promise<Passenger>;
  updatePassenger: (id: number, data: Partial<Passenger>) => Promise<void>;
  deletePassenger: (id: number) => Promise<void>;
  toggleCheck: (id: number) => void;
  getCheckedPassengers: () => Passenger[];
  validatePassenger: (passenger: Partial<Passenger>) => { valid: boolean; errors: string[] };
  checkDuplicate: (passenger: Partial<Passenger>) => boolean;
}
