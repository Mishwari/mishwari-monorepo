import { Driver } from './driver';
import { Bus } from './bus';

export interface City {
  id: number;
  city: string;
}

export interface Trip {
  id: number;
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
}
