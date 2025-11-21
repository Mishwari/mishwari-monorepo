import { z } from "zod";
import { OperatorSchema } from "./operator";

export const DriverSchema = z.object({
    id: z.number(),
    d_name: z.string(),
    driver_rating: z.string(),
    car_type: z.string().optional(),
    operator:OperatorSchema.nullable(),
    is_charger: z.boolean().optional(),
    is_wifi: z.boolean().optional(),
    is_ac: z.boolean().optional(),
})

export type Driver = z.infer<typeof DriverSchema>