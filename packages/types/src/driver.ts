import { z } from "zod";
import { OperatorSchema } from "./operator";

export const DriverSchema = z.object({
    id: z.number(),
    driver_name: z.string(),
    driver_rating: z.string(),
    operator: OperatorSchema.nullable(),
    is_verified: z.boolean(),
    verification_documents: z.any().nullable(),
})

export type Driver = z.infer<typeof DriverSchema>