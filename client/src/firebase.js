// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ritzestate-fe057.firebaseapp.com",
  projectId: "ritzestate-fe057",
  storageBucket: "ritzestate-fe057.appspot.com",
  messagingSenderId: "468797411891",
  appId: "1:468797411891:web:5014d17312e26cda2cc946"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);