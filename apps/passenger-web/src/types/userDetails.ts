import { z } from "zod";

export const UserDetailsSchema = z.object({
    id: z.number().nullable(),
    username: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string()
})

export type UserDetails = z.infer<typeof UserDetailsSchema>