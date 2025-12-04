import { apiClient } from './client';
import type { Review, CreateReviewPayload } from '@mishwari/types';

export const reviewsApi = {
  create: (data: CreateReviewPayload) =>
    apiClient.post<Review>('/reviews/', data).then(res => res.data),

  getMyReviews: () =>
    apiClient.get<Review[]>('/reviews/').then(res => res.data),

  getById: (id: number) =>
    apiClient.get<Review>(`/reviews/${id}/`).then(res => res.data),
};
