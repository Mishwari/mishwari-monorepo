import { z } from "zod";

export const OperatorSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export type Operator = z.infer<typeof OperatorSchema>