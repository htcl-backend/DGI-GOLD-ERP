import React, { useState, useEffect, useCallback } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Orders from "./screens/Orders";
import OrderDetails from "./screens/OrdersDetails";
import { HeaderProvider } from "./Contexts/HeaderContext";
import AddProduct from "./screens/Product/AddProduct";
import Inventory from "./screens/Product/Inventory";
import ProductList from "./screens/Product/ProductList";
import BuyGold from "./screens/Product/BuyGold";
import SellGold from "./screens/Product/SellGold";
import Customer from "./screens/Customer";
import Delivered from "./screens/Delivered";
import Settings from "./screens/Settings";
import Profile from "./screens/Profile";
import Notifications from "./screens/Notifications";
import DeliveryManagement from "./screens/DeliveryManagement";
import Sales from "./screens/Sales";
import PurchaseManagement from "./screens/PurchaseManagement";
import Accounts from "./screens/Accounts";
import Transactions from "./screens/Transactions";
import LockScreen from "./screens/LockScreen"; // Import the new LockScreen component

// Component to protect routes
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  return token ? children : null;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLocked, setIsLocked] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [username, setUsername] = useState("User");

  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Function to update activity time
  const updateActivityTime = useCallback(() => {
    setLastActivityTime(Date.now());
    if (isLocked) {
      setIsLocked(false); // Unlock immediately on activity if already locked
    }
  }, [isLocked]);

  // Event listeners for activity
  useEffect(() => {
    window.addEventListener('mousemove', updateActivityTime);
    window.addEventListener('keydown', updateActivityTime);
    window.addEventListener('click', updateActivityTime);

    return () => {
      window.removeEventListener('mousemove', updateActivityTime);
      window.removeEventListener('keydown', updateActivityTime);
      window.removeEventListener('click', updateActivityTime);
    };
  }, [updateActivityTime]);

  // Inactivity timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivityTime > INACTIVITY_TIMEOUT && !isLocked) {
        setIsLocked(true);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [lastActivityTime, isLocked, INACTIVITY_TIMEOUT]);

  // Get username from localStorage for lock screen
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.username || "User");
      } catch (e) { console.error("Failed to parse user from localStorage", e); }
    }
  }, []);

  // Redirect to signin if not authenticated and not on auth pages
  useEffect(() => {
    const token = localStorage.getItem("token");
    const authPaths = ["/", "/signin", "/signup", "/forgot-password"];
    if (!token && !authPaths.includes(location.pathname)) {
      navigate("/signin");
    }
  }, [location.pathname, navigate]);

  const handleUnlockScreen = () => {
    setIsLocked(false);
    setLastActivityTime(Date.now()); // Reset timer after unlock
  };

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlockScreen} username={username} />;
  }

  return (
    <HeaderProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignUp />} /> {/* Default to SignUp for new users */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/order-details" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/product-list" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/buy-gold" element={<ProtectedRoute><BuyGold /></ProtectedRoute>} />
        <Route path="/sell-gold" element={<ProtectedRoute><SellGold /></ProtectedRoute>} />
        <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
        <Route path="/delivered" element={<ProtectedRoute><Delivered /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/delivery-management" element={<ProtectedRoute><DeliveryManagement /></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
        <Route path="/purchase-management" element={<ProtectedRoute><PurchaseManagement /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      </Routes>
    </HeaderProvider>
  );
};

export default App;
