import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { getFirebaseAuth } from './config';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export const initRecaptcha = (elementId: string) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not initialized');
  }
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {},
    });
  }
  return recaptchaVerifier;
};

export const sendFirebaseOtp = async (phoneNumber: string, recaptchaElementId: string) => {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase not initialized. Check environment variables.');
    }
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const verifier = initRecaptcha(recaptchaElementId);
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    return { success: true };
  } catch (error: any) {
    console.error('Firebase OTP error:', error);
    cleanupRecaptcha();
    if (error.code === 'auth/invalid-app-credential') {
      throw new Error('Firebase credentials invalid. Please check configuration.');
    }
    if (error.code === 'auth/too-many-requests') {
      const rateLimitError = new Error('TOO_MANY_REQUESTS');
      (rateLimitError as any).code = 'auth/too-many-requests';
      throw rateLimitError;
    }
    throw new Error(error.message || 'Failed to send OTP');
  }
};

export const verifyFirebaseOtp = async (otp: string) => {
  try {
    if (!confirmationResult) {
      throw new Error('No confirmation result available');
    }
    const result = await confirmationResult.confirm(otp);
    const token = await result.user.getIdToken();
    return { success: true, token };
  } catch (error: any) {
    console.error('Firebase verification error:', error);
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
};
