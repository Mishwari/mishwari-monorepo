import { z } from "zod";

export const ReviewSchema = z.object({
    id: z.number(),
    booking: z.number(),
    overall_rating: z.number().min(1).max(5),
    bus_condition_rating: z.number().min(1).max(5),
    driver_rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    created_at: z.string(),
})

export type Review = z.infer<typeof ReviewSchema>

export interface CreateReviewPayload {
    booking: number;
    overall_rating: number;
    bus_condition_rating: number;
    driver_rating: number;
    comment?: string;
}
