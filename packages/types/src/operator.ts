import { z } from "zod";

export const OperatorSchema = z.object({
    id: z.number(),
    name: z.string(),
    is_verified: z.boolean().optional(),
})

export type Operator = z.infer<typeof OperatorSchema>