import { z } from "zod";

export const OperatorSchema = z.object({
    id: z.number(),
    name: z.string(),
    is_verified: z.boolean().optional(),
    avg_rating: z.number().default(0),
    total_reviews: z.number().default(0),
})

export type Operator = z.infer<typeof OperatorSchema>