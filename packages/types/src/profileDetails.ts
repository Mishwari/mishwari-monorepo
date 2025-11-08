import {z} from 'zod'
import { UserDetailsSchema } from './userDetails'

export const ProfileDetailsSchema = z.object({
    id: z.number(),
    user: UserDetailsSchema,
    mobile_number: z.string(),
    full_name: z.string().nullable(),
    birth_date: z.string().optional().nullable(),
    gender: z.enum(['male', 'female']),
    address: z.string().nullable().optional(),
    role: z.enum(['passenger', 'driver', 'operator_admin']),
    is_verified: z.boolean(),
})

export type Profile = z.infer<typeof ProfileDetailsSchema>