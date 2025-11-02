import { z } from "zod";
import {DriverSchema} from './driver'
import { BusSchema } from "./bus";

export const MainTripSchema = z.object({
  id: z.number(),
  path_road: z.string(),
  bus: BusSchema,
  driver: DriverSchema.nullable(),
});

export type MainTrip = z.infer<typeof MainTripSchema>