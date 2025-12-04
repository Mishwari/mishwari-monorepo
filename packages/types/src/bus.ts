import { z } from 'zod';

export const BusSchema = z.object({
    id: z.number(),
    capacity: z.number(),
    bus_number: z.string(),
    bus_type: z.string(),
    amenities: z.any(),
    is_verified: z.boolean(),
    verification_documents: z.any().nullable(),
    avg_rating: z.number().default(0),
    total_reviews: z.number().default(0),
    has_wifi: z.boolean().default(false),
    has_ac: z.boolean().default(true),
    has_usb_charging: z.boolean().default(false),
})

export type Bus = z.infer<typeof BusSchema>