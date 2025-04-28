import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import Suggestions from "./pages/Suggestions";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  console.log("ProtectedRoute - Current User:", currentUser);
  console.log("ProtectedRoute - Loading:", loading);

  if (loading) {
    return (
      <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  if (!currentUser) {
    console.log("ProtectedRoute - Redirecting to / because user is not logged in");
    alert("Please log in to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
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
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;