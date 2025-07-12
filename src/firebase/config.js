// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace this with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwcql0IIfUqOM82mtNS5CeGB77EQa4I6c",
  authDomain: "taalmel-15eb1.firebaseapp.com",
  projectId: "taalmel-15eb1",
  storageBucket: "taalmel-15eb1.firebasestorage.app",
  messagingSenderId: "1037604277454",
  appId: "1:1037604277454:web:ed4ca5d0e591f79933549f",
  measurementId: "G-4BF5806QMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;