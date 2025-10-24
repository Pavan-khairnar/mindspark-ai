// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeGtxxoGRnLPyiM1bLw18s3Xlt_G6ocx8",
  authDomain: "mindspark-ai-42.firebaseapp.com",
  projectId: "mindspark-ai-42",
  storageBucket: "mindspark-ai-42.firebasestorage.app",
  messagingSenderId: "619246623873",
  appId: "1:619246623873:web:50bfd2dae3764557eb0180"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;