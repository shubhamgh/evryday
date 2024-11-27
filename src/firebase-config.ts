// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7X4LM5AP-22mdq5hZFXpyOLrl_0vOYVY",
  authDomain: "evryday-e78e2.firebaseapp.com",
  projectId: "evryday-e78e2",
  storageBucket: "evryday-e78e2.firebasestorage.app",
  messagingSenderId: "787701707927",
  appId: "1:787701707927:web:010b003a256e0c6a1565d2",
  measurementId: "G-H1G90CJKKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);