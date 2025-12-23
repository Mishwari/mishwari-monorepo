import { RecaptchaVerifier } from 'firebase/auth';
import { getFirebaseAuth } from './config';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let isRendered = false;

export const getRecaptchaToken = async (elementId: string = 'recaptcha-container'): Promise<string> => {
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

  try {
    if (!isRendered) {
      await recaptchaVerifier.render();
      isRendered = true;
    }
    const token = await recaptchaVerifier.verify();
    return token;
  } catch (error) {
    console.error('ReCAPTCHA error:', error);
    cleanupRecaptcha();
    throw error;
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
    isRendered = false;
  }
};
