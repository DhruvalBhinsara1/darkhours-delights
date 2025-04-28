// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration using Vite environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Validate that all required environment variables are present
const requiredEnvVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
    "VITE_FIREBASE_MEASUREMENT_ID",
];

const missingEnvVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
);
if (missingEnvVars.length > 0) {
    console.error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
    if (import.meta.env.MODE === "development") {
        console.warn(
            "Using empty config as fallback in development. Please set environment variables in .env."
        );
    } else {
        throw new Error(
            `Missing required environment variables: ${missingEnvVars.join(", ")}`
        );
    }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };