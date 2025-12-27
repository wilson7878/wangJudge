import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7lQchTRdaRd3FQ__9ENellCznNMcoTW8",
  authDomain: "wang-judge-app.firebaseapp.com",
  // Note: I cleaned up the markdown formatting from your input to just the raw URL string
  databaseURL: "https://wang-judge-app-default-rtdb.firebaseio.com",
  projectId: "wang-judge-app",
  storageBucket: "wang-judge-app.firebasestorage.app",
  messagingSenderId: "89538173382",
  appId: "1:89538173382:web:299fa2ccf61849132a3ac7",
  measurementId: "G-CS8ELR97F9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it for use in App.tsx
export const db = getDatabase(app);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);
