import { z } from 'zod';

export const BusSchema = z.object({
    id: z.number(),
    capacity: z.number(),
    bus_number: z.string(),
    bus_type: z.string(),
    amenities: z.any(),
    is_verified: z.boolean(),
    verification_documents: z.any().nullable(),
})

export type Bus = z.infer<typeof BusSchema>