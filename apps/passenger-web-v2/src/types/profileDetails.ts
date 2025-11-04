import {z} from 'zod'
import { UserDetailsSchema } from './userDetails'

export const ProfileDetailsSchema = z.object({
    user: UserDetailsSchema,
    full_name: z.string().nullable(),
    birth_date: z.string().optional().nullable(),
    gender: z.enum(['male', 'female']),
    address: z.string().nullable().optional(),
})

export type Profile = z.infer<typeof ProfileDetailsSchema>