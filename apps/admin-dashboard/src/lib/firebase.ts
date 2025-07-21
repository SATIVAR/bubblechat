// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDOv-kDOJOp0gsXdLfCLrd_xvImX8dLxT8",
  authDomain: "bubblechat-sativar.firebaseapp.com",
  projectId: "bubblechat-sativar",
  storageBucket: "bubblechat-sativar.firebasestorage.app",
  messagingSenderId: "619283901248",
  appId: "1:619283901248:web:46167be68eb0ae32eb68a5",
  measurementId: "G-88HSQZYVPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore service
export const db = getFirestore(app);

// Get a reference to the Auth service
export const auth = getAuth(app);
