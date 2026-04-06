import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { HeaderProvider } from './Contexts/HeaderContext';

// Auth Components
import Login from './components/Auth/SignIn';
import Register from './screens/Auth/Register';
import ProtectedRoute from './components/RoleProtectedRoute';

// Vendor Components
import VendorDashboard from './screens/vendor/Dashboard';
import Orders from './screens/Orders';
import OrdersDetails from './screens/OrdersDetails';
import BuyGold from './screens/BuyGold';
import SellGold from './screens/Product/SellGold';
import Inventory from './screens/Product/Inventory';
import ProductList from './screens/Product/ProductList';
import Kyc from './screens/Kyc';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import Transactions from './screens/Transactions';
import Notifications from './screens/Notifications';
import Reports from './screens/Reports';
import Customer from './screens/Customer';
import Vendors from './screens/Vendors';
import DeliveryManagement from './screens/DeliveryManagement';
import PurchaseManagement from './screens/PurchaseManagement';
import GoldPriceDashboard from './screens/GoldPriceDashboard';

// SuperAdmin Components
import SuperAdminDashboard from './screens/superadmin/Dashboard';
import AllOrders from './screens/superadmin/AllOrders';
import AllCustomers from './screens/superadmin/AllCustomers';
import KycApprovals from './screens/superadmin/KycApprovals';
import SuperAdminReports from './screens/superadmin/Reports';
import SuperAdminVendors from './screens/superadmin/Vendors';

function App() {
  return (
    <HeaderProvider>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* SuperAdmin Routes */}
            <Route
              path="/superadmin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/orders"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <AllOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/all-orders"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <AllOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/customers"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <AllCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/all-customers"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <AllCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/kyc"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <KycApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/kyc-approvals"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <KycApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/reports"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <SuperAdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/vendors"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'SUPER_ADMIN']}>
                  <SuperAdminVendors />
                </ProtectedRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['vendor', 'VENDOR']}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrdersDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buy-gold"
              element={
                <ProtectedRoute>
                  <BuyGold />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sell-gold"
              element={
                <ProtectedRoute>
                  <SellGold />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-list"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kyc"
              element={
                <ProtectedRoute>
                  <Kyc />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer"
              element={
                <ProtectedRoute>
                  <Customer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute>
                  <Vendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute>
                  <DeliveryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deliveries"
              element={
                <ProtectedRoute>
                  <DeliveryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase"
              element={
                <ProtectedRoute>
                  <PurchaseManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prices"
              element={
                <ProtectedRoute>
                  <GoldPriceDashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Redirect */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </HeaderProvider>
  );
}

export default App;