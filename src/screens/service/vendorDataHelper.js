/**
 * Vendor Data Helper Utility
 * Provides functions to filter API requests by vendor/tenant ID
 * Ensures each vendor sees only their own data
 */

/**
 * Get vendor ID from localStorage
 * @returns {string} Vendor/Tenant ID
 */
export const getVendorId = () => {
    return localStorage.getItem('vendorId') || localStorage.getItem('tenantId') || '';
};

/**
 * Get current logged-in user from localStorage
 * @returns {object} User object with uid, name, email, etc.
 */
export const getLoggedInUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.warn("Could not parse stored user:", e);
        return null;
    }
};

/**
 * Get access token from localStorage
 * @returns {string} JWT access token
 */
export const getAccessToken = () => {
    return localStorage.getItem('token') || '';
};

/**
 * Add vendor filter to API endpoint
 * @param {string} endpoint - Original API endpoint
 * @returns {string} Endpoint with vendor filter added
 * 
 * Example:
 * addVendorFilter('/orders?page=1') => '/orders?page=1&vendorId=vendor_abc'
 * addVendorFilter('/customers') => '/customers?vendorId=vendor_abc'
 */
export const addVendorFilter = (endpoint) => {
    const vendorId = getVendorId();
    if (!vendorId) {
        console.warn("⚠️ No vendorId found. Data may not be filtered by vendor.");
        return endpoint;
    }

    const separator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${separator}vendorId=${vendorId}`;
};

/**
 * Create headers with authorization token and vendor context
 * @returns {object} Headers object with Content-Type, Authorization, and VendorId
 */
export const createVendorHeaders = () => {
    const token = getAccessToken();
    const vendorId = getVendorId();

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (vendorId) {
        headers['X-Vendor-Id'] = vendorId;  // Send vendor ID as header for backend filtering
    }

    return headers;
};

/**
 * Format pagination parameters
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {string} Query string: ?page=1&limit=20
 */
export const getPaginationParams = (page = 1, limit = 20) => {
    return `?page=${page}&limit=${limit}`;
};

/**
 * Check if current user is a vendor (not admin)
 * @returns {boolean} True if user has vendor role
 */
export const isVendorUser = () => {
    const user = getLoggedInUser();
    if (!user) return false;

    const role = (user.role || '').toLowerCase();
    return role.includes('vendor') && !role.includes('admin');
};

/**
 * Log vendor context for debugging
 */
export const logVendorContext = () => {
    const vendorId = getVendorId();
    const user = getLoggedInUser();

    console.log('🔐 Vendor Context:', {
        vendorId,
        userId: user?.uid,
        userEmail: user?.email,
        userRole: user?.role,
        tenantId: user?.tenantId
    });
};
