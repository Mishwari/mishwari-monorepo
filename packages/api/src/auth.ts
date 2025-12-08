import { apiClient } from './client';
import type { Profile } from '@mishwari/types';

export const authApi = {
  requestOtp: (data: { phone: string }) =>
    apiClient.post('/mobile-login/request-otp/', { mobile_number: data.phone }),

  verifyOtp: (data: { phone: string; otp: string; password?: string }) =>
    apiClient.patch('/mobile-login/verify-otp/', { mobile_number: data.phone, otp_code: data.otp, password: data.password }),

  checkPasswordRequired: (phone: string) =>
    apiClient.post('/mobile-login/check-password-required/', { mobile_number: phone }),

  verifyFirebaseOtp: (data: { firebase_token: string; password?: string }) =>
    apiClient.post('/mobile-login/verify-firebase-otp/', data),

  completeProfile: (data: { full_name: string; email?: string; gender?: string; birth_date?: string; role?: string; password?: string }) =>
    apiClient.post('/mobile-login/complete-profile/', data),

  verifyTransaction: (credential: string) =>
    apiClient.post('/mobile-login/verify-transaction/', { credential }),

  validateInvite: (code: string) =>
    apiClient.get(`/mobile-login/validate-invite/?code=${code}`),

  acceptInvite: (data: { invite_code: string; full_name: string; email?: string; national_id?: string; driver_license?: string }) =>
    apiClient.post('/mobile-login/accept-invite/', data),

  changeMobile: (data: { new_mobile: string; otp_code: string; password?: string; firebase_token?: string }) =>
    apiClient.post('/mobile-login/change-mobile/', data),

  changePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.post('/mobile-login/change-password/', data),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/token/refresh/', { refresh: refreshToken }),

  getMe: () =>
    apiClient.get<Profile>('/profile/me/')
};
