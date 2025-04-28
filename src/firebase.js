// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Add Authentication imports

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOGD8Q_qK12LT-BQE934HYUpgvJEx82ok",
    authDomain: "darkhourdelights.firebaseapp.com",
    projectId: "darkhourdelights",
    storageBucket: "darkhourdelights.firebasestorage.app",
    messagingSenderId: "295360071441",
    appId: "1:295360071441:web:401f24d2fcdb9553532eb0",
    measurementId: "G-CYP0N09NTV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };