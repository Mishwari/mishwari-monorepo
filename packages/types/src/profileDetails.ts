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
    role: z.enum(['passenger', 'standalone_driver', 'invited_driver', 'operator_admin']),
    is_verified: z.boolean(),
    is_standalone: z.boolean().optional(),
    operator_name: z.string().nullable().optional(),
    operator_contact: z.string().nullable().optional(),
    operational_regions: z.array(z.string()).optional(),
    driver_license: z.string().nullable().optional(),
    national_id: z.string().nullable().optional(),
    pending_invitation_code: z.string().nullable().optional(),
})

export type Profile = z.infer<typeof ProfileDetailsSchema>