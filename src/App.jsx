import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import Suggestions from "./pages/Suggestions";
import AdminPanel from "./pages/AdminPanel"; // Import the AdminPanel component
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // Note: Your query uses CartContext, not CartProvider
import { ShopStatusProvider } from "./context/ShopStatusContext";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(requireAdmin);

  // Check admin status if required
  useEffect(() => {
    if (requireAdmin && !loading && currentUser) {
      const checkAdmin = async () => {
        try {
          const tokenResult = await currentUser.getIdTokenResult();
          setIsAdmin(!!tokenResult.claims.admin); // Check if admin claim is true
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          setAdminCheckLoading(false);
        }
      };
      checkAdmin();
    } else {
      setAdminCheckLoading(false);
    }
  }, [currentUser, loading, requireAdmin]);

  // Show loading screen while checking authentication or admin status
  if (loading || adminCheckLoading) {
    return (
      <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  // Redirect unauthenticated users to homepage
  if (!currentUser) {
    console.log("ProtectedRoute - Redirecting to / because user is not logged in");
    alert("Please log in to access this page.");
    return <Navigate to="/" replace />;
  }

  // Redirect authenticated but non-admin users for admin routes
  if (requireAdmin && !isAdmin) {
    console.log("ProtectedRoute - Redirecting to / because user is not an admin");
    alert("Admin access required.");
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children;
}

function App() {
  return (
    <AuthProvider>
      <ShopStatusProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-confirmation"
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-history"
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/suggestions" element={<Suggestions />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </ShopStatusProvider>
    </AuthProvider>
  );
}

export default App;