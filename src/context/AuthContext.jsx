import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                setUser(res.data); // Store user info (e.g., email, name)
                console.log("User logged in:", res.data);
            } catch (error) {
                console.error("Login failed:", error);
            }
        },
        onError: (error) => console.error("Login error:", error),
        flow: "implicit", // Use implicit flow for frontend
    });

    const logout = () => {
        setUser(null); // Clear user state on logout
    };

    useEffect(() => {
        // Optionally, check if user is already logged in (e.g., from localStorage)
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        // Persist user to localStorage
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);