import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaB0GWNSTp8We2-NuBHsXanJhGR5kzz88",
  authDomain: "campusiq-151c2.firebaseapp.com",
  projectId: "campusiq-151c2",
  storageBucket: "campusiq-151c2.firebasestorage.app",
  messagingSenderId: "912308791774",
  appId: "1:912308791774:web:9445658bdda17d1db3554f",
  measurementId: "G-2FFN30MVZV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
