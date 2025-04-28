import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            alert("Successfully signed in with Google!");
            return result.user;
        } catch (error) {
            console.error("Error signing in with Google:", error);
            alert("Failed to sign in: " + error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            alert("Successfully signed out!");
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to sign out: " + error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth State Changed - User:", user);
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}