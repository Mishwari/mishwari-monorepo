import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export const initializeFirebase = (config: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}) => {
  if (!firebaseApp) {
    firebaseApp = getApps().length === 0 ? initializeApp(config) : getApps()[0];
    firebaseAuth = getAuth(firebaseApp);
  }
  return { app: firebaseApp, auth: firebaseAuth };
};

export const getFirebaseAuth = () => {
  return firebaseAuth;
};
