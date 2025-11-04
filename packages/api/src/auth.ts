import { apiClient } from './client';

export const authApi = {
  requestOtp: (data: { phone: string }) =>
    apiClient.post('/mobile-login/request-otp/', { mobile_number: data.phone }),

  verifyOtp: (data: { phone: string; otp: string }) =>
    apiClient.patch('/mobile-login/verify-otp/', { mobile_number: data.phone, otp_code: data.otp }),

  completeProfile: (data: { full_name: string; birth_date: string; gender: string; address: string }) =>
    apiClient.post('/mobile-login/complete-profile/', data),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/token/refresh/', { refresh: refreshToken }),
};
