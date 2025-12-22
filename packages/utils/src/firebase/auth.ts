import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { getFirebaseAuth } from './config';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

// Store phone number for session recovery
let lastPhoneNumber: string | null = null;

export const initRecaptcha = (elementId: string) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not initialized');
  }
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'normal',
      callback: () => {},
    });
  }
  return recaptchaVerifier;
};

export const sendFirebaseOtp = async (phoneNumber: string, recaptchaElementId: string) => {
  try {
    console.log('[Firebase OTP] Starting OTP send for:', phoneNumber);
    const auth = getFirebaseAuth();
    if (!auth) {
      console.error('[Firebase OTP] Auth not initialized');
      throw new Error('Firebase not initialized. Check environment variables.');
    }
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    console.log('[Firebase OTP] Formatted phone:', formattedPhone);
    console.log('[Firebase OTP] Initializing reCAPTCHA...');
    const verifier = initRecaptcha(recaptchaElementId);
    console.log('[Firebase OTP] Sending sign-in request to Firebase...');
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    console.log('[Firebase OTP] ✓ OTP sent successfully');
    
    // Store phone number for debugging
    lastPhoneNumber = formattedPhone;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('firebase_otp_phone', formattedPhone);
      sessionStorage.setItem('firebase_otp_sent_at', Date.now().toString());
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('[Firebase OTP] ✗ Error occurred:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      fullError: error
    });
    cleanupRecaptcha();
    
    // Handle timeout errors (reCAPTCHA timeout)
    if (error.message === 'Timeout' || error.name === 'Timeout') {
      console.error('[Firebase OTP] reCAPTCHA timeout - network too slow or blocked');
      const timeoutError = new Error('RECAPTCHA_TIMEOUT');
      (timeoutError as any).code = 'auth/recaptcha-timeout';
      throw timeoutError;
    }
    if (error.code === 'auth/invalid-app-credential') {
      console.error('[Firebase OTP] Invalid app credentials');
      throw new Error('Firebase credentials invalid. Please check configuration.');
    }
    if (error.code === 'auth/too-many-requests') {
      console.error('[Firebase OTP] Too many requests');
      const rateLimitError = new Error('TOO_MANY_REQUESTS');
      (rateLimitError as any).code = 'auth/too-many-requests';
      throw rateLimitError;
    }
    console.error('[Firebase OTP] Unhandled error type');
    throw new Error(error.message || 'Failed to send OTP');
  }
};

export const verifyFirebaseOtp = async (otp: string) => {
  try {
    console.log('[Firebase Verify] Starting OTP verification:', otp);
    if (!confirmationResult) {
      console.error('[Firebase Verify] ✗ No confirmationResult available');
      // Check if session is still valid (within 5 minutes)
      if (typeof window !== 'undefined') {
        const sentAt = sessionStorage.getItem('firebase_otp_sent_at');
        const phone = sessionStorage.getItem('firebase_otp_phone');
        if (sentAt && phone) {
          const elapsed = Date.now() - parseInt(sentAt);
          console.error('[Firebase Verify] Session info:', {
            phone,
            elapsedSeconds: elapsed / 1000,
            isExpired: elapsed > 5 * 60 * 1000
          });
          if (elapsed > 5 * 60 * 1000) {
            console.error('[Firebase Verify] Session expired - OTP sent', elapsed / 1000, 'seconds ago');
          } else {
            console.error('[Firebase Verify] Session still valid but confirmationResult lost!');
          }
        } else {
          console.error('[Firebase Verify] No session data found in storage');
        }
      }
      const error = new Error('SESSION_EXPIRED');
      (error as any).code = 'auth/session-expired';
      throw error;
    }
    console.log('[Firebase Verify] Confirming OTP with Firebase...');
    const result = await confirmationResult.confirm(otp);
    console.log('[Firebase Verify] Getting ID token...');
    const token = await result.user.getIdToken();
    console.log('[Firebase Verify] ✓ Verification successful');
    
    // Clear session storage on success
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('firebase_otp_phone');
      sessionStorage.removeItem('firebase_otp_sent_at');
    }
    
    return { success: true, token };
  } catch (error: any) {
    console.error('[Firebase Verify] ✗ Verification error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      fullError: error
    });
    // Preserve specific error codes
    if (error.code === 'auth/session-expired' || error.message === 'SESSION_EXPIRED') {
      throw error;
    }
    if (error.code === 'auth/invalid-verification-code') {
      console.error('[Firebase Verify] Invalid verification code');
      const invalidCodeError = new Error('INVALID_CODE');
      (invalidCodeError as any).code = 'auth/invalid-verification-code';
      throw invalidCodeError;
    }
    if (error.code === 'auth/code-expired') {
      console.error('[Firebase Verify] Code expired');
      const expiredError = new Error('CODE_EXPIRED');
      (expiredError as any).code = 'auth/code-expired';
      throw expiredError;
    }
    console.error('[Firebase Verify] Unhandled error type');
    throw new Error('Invalid OTP');
  }
};

export const cleanupRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Error clearing recaptcha:', e);
    }
    recaptchaVerifier = null;
  }
  confirmationResult = null;
  lastPhoneNumber = null;
  
  // Clear session storage
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('firebase_otp_phone');
    sessionStorage.removeItem('firebase_otp_sent_at');
  }
};
