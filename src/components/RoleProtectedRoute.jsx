// Role-based route protection
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

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

    if (allowedRoles.length > 0) {
        const userRole = user.role?.toLowerCase() || '';
        const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

        if (!normalizedAllowedRoles.includes(userRole)) {
            // Redirect to appropriate dashboard based on role
            const redirectPath = userRole === 'superadmin' || userRole === 'super_admin'
                ? '/superadmin/dashboard'
                : '/vendor/dashboard';
            return <Navigate to={redirectPath} replace />;
        }
    }

    return children;
};

export default RoleProtectedRoute;
