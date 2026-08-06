import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaV_mviJZEZaMxReh6BIRrFowzC9x3kc4",
  authDomain: "zalameh-8cb5b.firebaseapp.com",
  projectId: "zalameh-8cb5b",
  storageBucket: "zalameh-8cb5b.firebasestorage.app",
  messagingSenderId: "966057562195",
  appId: "1:966057562195:web:8bfef13526c1bce418b6a6",
  measurementId: "G-XM0C33D5JL"
};

// Initialize Firebase (prevent duplicate initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore DB
export const db = getFirestore(app);

// Analytics initialization (supported in client browser environments)
export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics is not supported in this environment:", err);
  });
}
