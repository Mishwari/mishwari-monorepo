import { z } from "zod";

export const PassengerSchema = z.object({
    id: z.number().nullable(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    is_checked: z.boolean().optional(),
    age: z.number().nullable().optional(),
    gender:z.string().optional(),
})

export type Passenger = z.infer<typeof PassengerSchema>