import { z } from 'zod';

export const BusSchema = z.object({
    id: z.number(),
    capacity: z.number(),
    bus_number: z.string(),
    bus_type: z.string(),
    amenities: z.any(),
})

export type Bus = z.infer<typeof BusSchema>