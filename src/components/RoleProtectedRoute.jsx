// Role-based route protection
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Debug logging
    console.log('🔒 RoleProtectedRoute:', {
        path: location.pathname,
        user: user?.email,
        role: user?.role,
        allowedRoles,
        loading
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }   

    const userRole = user.role?.toLowerCase() || '';

    // If allowedRoles specified, check if user has permission
    if (allowedRoles.length > 0) {
        const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

        // Check if user role matches allowed roles
        // For vendor routes: accept 'vendor', 'VENDOR', 'vendor_owner', 'VENDOR_OPERATIONS', and other vendor staff roles
        const isAllowed = normalizedAllowedRoles.includes(userRole) ||
            (normalizedAllowedRoles.includes('vendor') && (userRole === 'vendor_owner' || userRole === 'vendor_operations')) ||
            (normalizedAllowedRoles.includes('superadmin') && (userRole === 'superadmin' || userRole === 'super_admin'));

        if (!isAllowed) {
            // Redirect to signin if not authorized
            return <Navigate to="/signin" state={{ from: location }} replace />;
        }
    }

    return children;
};

export default RoleProtectedRoute;
