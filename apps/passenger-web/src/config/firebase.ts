import { initializeFirebase } from '@mishwari/utils';
import { createLogger } from '@/utils/logger';

const log = createLogger('firebase');

if (typeof window !== 'undefined') {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  if (firebaseConfig.apiKey) {
    // Initialize Firebase immediately for auth reliability
    // Yemen OTP issues require Firebase to be ready before user interaction
    try {
      log.info('Initializing Firebase immediately for auth reliability');
      initializeFirebase(firebaseConfig);
      log.info('Firebase initialized successfully');
    } catch (error) {
      log.error('Firebase initialization failed', error);
    }
  } else {
    log.error('Firebase API key missing in environment variables');
  }

  // Hide reCAPTCHA badge
  const style = document.createElement('style');
  style.innerHTML = '.grecaptcha-badge { visibility: hidden; }';
  document.head.appendChild(style);
}
