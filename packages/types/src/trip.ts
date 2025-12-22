import { Driver } from './driver';
import { Bus } from './bus';
import { Operator } from './operator';

export interface City {
  id: number;
  city: string;
}

export interface TripStop {
  id: number;
  city: { id: number; name: string };
  sequence: number;
  distance_from_start_km: number;
  price_from_start: number;
  planned_arrival: string;
  planned_departure: string;
}

export interface Trip {
  id: number;
  operator: Operator | null;
  driver: Driver | null;
  bus: Bus | null;
  from_city: City;
  to_city: City;
  planned_route_name: string;
  journey_date: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  trip_type: 'scheduled' | 'flexible';
  planned_departure: string | null;
  departure_window_start: string | null;
  departure_window_end: string | null;
  actual_departure: string | null;
  departure_time: string | null;
  arrival_time: string | null;
  available_seats: number | null;
  price: number | null;
  can_publish: boolean;
  stops?: TripStop[];
  // Fields for intermediate stop support
  from_stop_id?: number;
  to_stop_id?: number;
  is_intermediate_pickup?: boolean;
  is_intermediate_dropoff?: boolean;
  full_route?: string | null;
  // GPS-based search
  user_distance_km?: number;
}
