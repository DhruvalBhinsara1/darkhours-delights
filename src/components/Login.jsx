import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

function Login() {
    const { currentUser } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Successfully signed in with Google!");
        } catch (error) {
            console.error("Error signing in with Google:", error);
            alert("Failed to sign in: " + error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert("Successfully signed out!");
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to sign out: " + error.message);
        }
    };

    return (
        <div>
            {currentUser ? (
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-gray-200 hover:text-white transition-colors duration-200"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={handleGoogleSignIn}
                    className="px-4 py-2 text-gray-200 hover:text-white transition-colors duration-200"
                >
                    Login
                </button>
            )}
        </div>
    );
}

export default Login;