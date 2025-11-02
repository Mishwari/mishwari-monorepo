import { z } from 'zod'
import { MainTripSchema } from './main_trip'

export const TripSchema = z.object({
    id: z.number(),
    main_trip: MainTripSchema, // contains: driver, bus
    pickup: z.object({
        id: z.number(),
        city: z.string(),
    }),
    destination: z.object({
        id: z.number(),
        city: z.string(),
    }),
    path_road: z.string(),
    price: z.number(),
    created_at: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    departure_time: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    arrival_time: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    trip_status: z.enum(['pending','complete','cancelled','active']),
    distance: z.union([z.number(), z.any()]),
    available_seats: z.number().nullable(),
    trip: z.number().nullable(),
    driver: z.number().nullable(),
})

export type Trip = z.infer<typeof TripSchema>

