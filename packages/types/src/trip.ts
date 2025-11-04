export interface Trip {
  id: number;
  from_city?: { city: string };
  to_city?: { city: string };
  pickup?: { city: string };
  destination?: { city: string };
  price: number;
  departure_time: string;
  arrival_time: string;
  distance?: number;
  planned_route_name?: string;
  path_road?: string;
  trip_type?: string;
  driver?: {
    driver_name?: string;
    driver_rating?: number;
    operator?: { name: string };
  };
  bus?: {
    bus_type?: string;
  };
}
