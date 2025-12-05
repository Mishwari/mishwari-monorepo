import { initializeFirebase } from '@mishwari/utils';

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
    initializeFirebase(firebaseConfig);
  }

  // Hide reCAPTCHA badge
  const style = document.createElement('style');
  style.innerHTML = '.grecaptcha-badge { visibility: hidden; }';
  document.head.appendChild(style);
}
