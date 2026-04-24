import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../screens/service/apiService';


const AuthContext = createContext();

// Dummy user profiles for offline development
const dummyProfiles = {
    'vendor': {
        uid: 'vendor_owner_abc',
        name: 'Vendor Owner ABC',
        email: 'owner@vendorabc.com',
        phoneNumber: '+919876543210',
        profileImage: null,
        role: 'VENDOR_OWNER',
        tenantId: 'vendor_abc',
        tier: 1,
        kycLevel: 'none',
        emailVerified: true,
        isNewUser: false
    },
    'superadmin': {
        id: 'sa-001',
        name: 'Admin User',
        email: 'admin@dgi.com',
        role: 'SUPER_ADMIN',
        phone: '+91-9876543211',
        address: '456 Corporate Park, Delhi, Delhi 110001',
        permissions: ['all'],
        createdAt: '2023-01-01T00:00:00Z'
    },
    'customer': {
        id: 'cust-001',
        name: 'Demo Customer',
        email: 'customer@dgi.com',
        role: 'CUSTOMER',
        phone: '+91-9876543212',
        address: '789 Residential Area, Bangalore, Karnataka 560001',
        totalOrders: 8,
        totalSpent: 720000,
        createdAt: '2023-06-15T14:30:00Z'
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // On initial load, check for a token and restore user session
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            // If no token, just set loading to false and continue
            if (!token) {
                setLoading(false);
                return;
            }

            // ✅ If we have a stored user, use it immediately (login already gave us complete user data)
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    console.log('✅ User restored from storage:', userData.email);
                } catch (e) {
                    console.warn("Could not parse stored user:", e);
                }
            }

            // Set loading to false - we have the user data we need from login
            setLoading(false);
        };
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email, password, tenantId) => {
        try {
            setError(null);

            // Allow demo login without calling the backend when a user object and mock token are provided.
            if (typeof email === 'object' && email !== null && typeof password === 'string') {
                localStorage.setItem('token', password);
                localStorage.setItem('userRole', email.role.toLowerCase());
                setUser(email);
                return { success: true };
            }

            // ✅ MULTI-VENDOR SUPPORT: All logins use vendor endpoint to support multiple vendors
            // Extract tenantId from API response dynamically - no hardcoding needed
            try {
                const loginPayload = { email, password };
                // If tenantId is explicitly provided, add it to payload
                if (tenantId) {
                    loginPayload.vendorId = tenantId;
                }

                // Always try vendor endpoint first (supports multi-vendor with dynamic tenant extraction)
                const result = await apiService.auth.vendorLogin(loginPayload);

                if (result.success) {
                    // ✅ Handle vendor API response structure: { data: { data: { user, accessToken, refreshToken } } }
                    const apiData = result.data.data || result.data;  // Get inner data layer
                    const token = apiData.accessToken || apiData.token;
                    const refreshToken = apiData.refreshToken || null;
                    const userData = apiData.user || apiData;

                    if (!token || !userData) {
                        console.error('❌ Invalid API response structure:', result);
                        return { success: false, error: 'Invalid login response from server' };
                    }

                    // ✅ Extract tenantId dynamically from API response
                    const extractedTenantId = userData.tenantId || tenantId || '';

                    localStorage.setItem('token', token);
                    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('userRole', (userData.role || 'VENDOR_OWNER').toLowerCase());
                    // ✅ Store tenant ID for vendor data filtering
                    localStorage.setItem('vendorId', extractedTenantId);
                    localStorage.setItem('tenantId', extractedTenantId);
                    localStorage.setItem('user', JSON.stringify(userData));

                    setUser(userData);
                    console.log('✅ Vendor login successful:', userData.email, 'Tenant:', extractedTenantId);
                    return { success: true };
                } else {
                    setError(result.error);
                    console.error('❌ Login failed:', result.error);
                    return { success: false, error: result.error };
                }
            } catch (apiError) {
                // ❌ Real API connection failed - show error, don't fallback to demo
                const errorMsg = apiError.message || 'API Server not responding. Please check your connection or contact support.';
                console.error('🔴 Login API Error:', errorMsg);
                setError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (err) {
            setError(err.message);
            console.error('🔴 Login error:', err.message);
            return { success: false, error: err.message };
        }
    };

    const register = async (name, email, password, tenantId, role = 'CUSTOMER') => {
        try {
            setError(null);
            const result = await apiService.auth.register({ name, email, password, tenantId, role });

            if (result.success) {
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const logout = async () => {
        try {
            // Attempt to logout from the server with timeout, but don't let it block client-side cleanup
            const timeoutPromise = new Promise((resolve) =>
                setTimeout(() => resolve({ success: true }), 2000)
            );
            await Promise.race([
                apiService.auth.logout().catch(err => {
                    console.warn("🟡 API logout failed (API unreachable):", err.message);
                    return { success: true }; // Treat as success even if API fails
                }),
                timeoutPromise
            ]);
        } catch (err) {
            console.warn("⚠️ Logout error:", err.message);
        } finally {
            // Always clear local storage and state
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('user');
            localStorage.removeItem('vendorId');
            localStorage.removeItem('tenantId');
            setUser(null);
        }
    };

    const updateProfile = async (payload) => {
        const result = await apiService.auth.updateProfile(payload);
        if (result.success) {
            setUser(result.data.data || result.data);
        }
        return result;
    };

    const changePassword = async (oldPassword, newPassword) => {
        return await apiService.auth.changePassword({ oldPassword, newPassword });
    };

    const normalizedRole = user?.role?.toLowerCase();
    const isSuperAdminUser = normalizedRole === 'superadmin' || normalizedRole === 'super_admin';
    const isVendorUser = normalizedRole === 'vendor' || normalizedRole === 'vendor_owner' || normalizedRole === 'vendor_operations';


    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            register,
            logout,
            updateProfile,
            changePassword,
            isAuthenticated: !!user && !!localStorage.getItem('token'),
            isSuperAdmin: isSuperAdminUser,
            isVendor: isVendorUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthProvider; 