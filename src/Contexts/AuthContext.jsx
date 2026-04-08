import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../screens/service/apiService';


const AuthContext = createContext();

// Dummy user profiles for offline development
const dummyProfiles = {
    'vendor': {
        id: 'v-001',
        name: 'Ramesh',
        email: 'vendor@dgi.com',
        role: 'VENDOR',
        businessName: 'Ramesh Jewellers Pvt Ltd',
        gstin: '27AABCU9603R1ZX',
        kycStatus: 'verified',
        phone: '+91-9876543210',
        address: '123 MG Road, Mumbai, Maharashtra 400001',
        totalRevenue: 1250000,
        totalOrders: 15,
        createdAt: '2023-01-15T10:00:00Z'
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

    // Load user from localStorage on mount - using dummy data
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const userRole = localStorage.getItem('userRole');

            if (token && userRole) {
                // Use dummy profile based on role
                const dummyProfile = dummyProfiles[userRole.toLowerCase()];
                if (dummyProfile) {
                    setUser(dummyProfile);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                }
            }
            setLoading(false);
        };
        checkAuth();
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

            // For regular login, try API first, fallback to demo if fails
            try {
                const result = await apiService.auth.login({ email, password, tenantId });

                if (result.success) {
                    const token = result.data.data?.token || result.data.token;
                    localStorage.setItem('token', token);
                    setUser(result.data.data || result.data);
                    return { success: true };
                } else {
                    setError(result.error);
                    return { success: false, error: result.error };
                }
            } catch (apiError) {
                // Fallback to demo login for development
                console.warn('API login failed, using demo mode:', apiError.message);

                // Determine role from email for demo purposes
                let demoRole = 'customer';
                if (email.includes('vendor')) demoRole = 'vendor';
                else if (email.includes('admin')) demoRole = 'superadmin';

                const demoUser = dummyProfiles[demoRole];
                const demoToken = `demo-token-${Date.now()}`;

                localStorage.setItem('token', demoToken);
                localStorage.setItem('userRole', demoRole);
                setUser(demoUser);
                return { success: true };
            }
        } catch (err) {
            setError(err.message);
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
            await apiService.auth.logout();
            localStorage.removeItem('token');
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
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
    const isVendorUser = normalizedRole === 'vendor';

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