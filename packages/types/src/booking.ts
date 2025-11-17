import { z } from "zod";
import  {UserDetailsSchema} from './userDetails'
import { TripSchema } from "./trip";
import { PassengerSchema } from "./passenger"

export const BookingSchema = z.object({ 
    id: z.number(),
    user: UserDetailsSchema,
    status: z.enum(['completed', 'cancelled', 'active','pending']),
    trip: TripSchema,
    from_stop: z.object({
        id: z.number(),
        city: z.object({ id: z.number(), name: z.string() }),
        sequence: z.number(),
        price_from_start: z.number(),
    }).optional(),
    to_stop: z.object({
        id: z.number(),
        city: z.object({ id: z.number(), name: z.string() }),
        sequence: z.number(),
        price_from_start: z.number(),
    }).optional(),
    passengers: z.array(PassengerSchema),
    is_paid: z.boolean(),
    payment_method: z.enum(['cash', 'wallet', 'stripe']),
    booking_time: z.string(),
    total_fare: z.number().optional(),
})/// use for api 

export type Booking = z.infer<typeof BookingSchema> // use for pages

