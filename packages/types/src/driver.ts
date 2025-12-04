import { z } from "zod";
import { OperatorSchema } from "./operator";

export const DriverSchema = z.object({
    id: z.number(),
    driver_name: z.string(),
    mobile_number: z.string().optional(),
    email: z.string().email().optional(),
    national_id: z.string().nullable().optional(),
    driver_license: z.string().nullable().optional(),
    driver_rating: z.string(),
    total_reviews: z.number().default(0),
    operator: OperatorSchema.nullable(),
    buses: z.array(z.any()).optional(),
    is_verified: z.boolean(),
    verification_documents: z.any().optional(),
})

export type Driver = z.infer<typeof DriverSchema>