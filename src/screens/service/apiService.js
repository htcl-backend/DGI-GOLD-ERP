// Use relative path for proxy in development, full URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

console.log('🔧 API Service Initialized with BASE URL:', API_BASE_URL);

class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getHeaders(isFormData = false) {
        const headers = {};
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async request(endpoint, method = 'GET', body = null, isFormData = false) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const options = {
                method,
                headers: this.getHeaders(isFormData),
            };

            if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
                options.body = isFormData ? body : JSON.stringify(body);
            }

            // ✅ Increase timeout to 60 seconds for remote API server
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 60000);
            options.signal = controller.signal;

            const response = await fetch(url, options);
            clearTimeout(timeout);

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.message || `API Error: ${response.status}`);
            }

            return { success: true, data, status: response.status };
        } catch (error) {
            // ✅ Better error handling for network issues
            if (error.name === 'AbortError') {
                console.error(`API Timeout [${method} ${endpoint}]: Request took too long`);
                return { success: false, error: 'API Timeout - Server not responding', status: null };
            }
            console.error(`API Error [${method} ${endpoint}]:`, error);
            return { success: false, error: error.message, status: null };
        }
    }

    // ============== AUTHENTICATION APIs ==============
    auth = {
        register: (payload) => this.request('/auth/register', 'POST', payload),
        login: (payload) => this.request('/auth/login', 'POST', payload),

        // ✅ Vendor-specific login endpoint
        vendorLogin: (payload) => this.request('/auth/vendor/login', 'POST', payload),

        logout: () => this.request('/auth/logout', 'POST'),
        getProfile: () => this.request('/auth/profile', 'GET'),
        updateProfile: (payload) => this.request('/auth/profile', 'PATCH', payload),
        changePassword: (payload) => this.request('/auth/change-password', 'PATCH', payload),
    };

    // ============== VENDOR & STAFF APIs ==============
    vendor = {
        // Vendor profile
        getProfile: () => this.request('/vendor/profile', 'GET'),
        updateProfile: (payload) => this.request('/vendor/profile', 'PATCH', payload),
        changePassword: (payload) => this.request('/vendor/change-password', 'POST', payload),
        refreshToken: () => this.request('/vendor/refresh-token', 'POST'),
        logoutAll: () => this.request('/vendor/logout-all', 'POST'),
        googleLogin: (payload) => this.request('/vendor/google-login', 'POST', payload),

        // Staff management
        getStaffList: (vendorId, params = {}) => this.request(`/auth/vendors/${vendorId}/staff?${new URLSearchParams(params)}`, 'GET'),
        addStaff: (vendorId, payload) => this.request(`/auth/vendors/${vendorId}/staff`, 'POST', payload),
        getStaffById: (vendorId, staffId) => this.request(`/auth/vendors/${vendorId}/staff/${staffId}`, 'GET'),
        updateStaff: (vendorId, staffId, payload) => this.request(`/auth/vendors/${vendorId}/staff/${staffId}`, 'PUT', payload),
        deleteStaff: (vendorId, staffId) => this.request(`/auth/vendors/${vendorId}/staff/${staffId}`, 'DELETE'),
        updateStaffRole: (vendorId, staffId, payload) => this.request(`/auth/vendors/${vendorId}/staff/${staffId}/role`, 'PUT', payload),
        blockStaff: (vendorId, staffId) => this.request(`/auth/vendors/${vendorId}/staff/${staffId}/block`, 'POST'),
        resetStaffPassword: (vendorId, staffId) => this.request(`/auth/vendors/${vendorId}/staff/${staffId}/reset-password`, 'POST'),
        getStaffActivity: (vendorId, staffId, params = {}) => this.request(`/auth/vendors/${vendorId}/staff/${staffId}/activity?${new URLSearchParams(params)}`, 'GET'),
        seek: (params = {}) => this.request(`/auth/seek?${new URLSearchParams(params)}`, 'GET'),
    };

    // ============== METALS APIs ==============
    metals = {
        getLivePrice: () => this.request('/metals/price/live', 'GET'),
        getSpotPrice: (metal) => this.request(`/metals/price/spot?metal=${metal}`, 'GET'),
        getPriceHistory: (metal, fromDate, toDate, interval = '1d') =>
            this.request(`/metals/price/history?metal=${metal}&fromDate=${fromDate}&toDate=${toDate}&interval=${interval}`, 'GET'),
        getPriceSummary: (metal) => this.request(`/metals/price/summary?metal=${metal}`, 'GET'),
        compareAll: () => this.request('/metals/compare', 'GET'),
        adminLivePrice: () => this.request('/metals/admin/live', 'GET'),
        adminOverridePrice: (payload) => this.request('/metals/admin/override', 'POST', payload),
        subscribeLive: () => this.request('/metals/subscribe-live', 'GET'),
        getWebhookStats: () => this.request('/metals/webhook-stats', 'GET'),
        getSchedulerState: () => this.request('/metals/scheduler-state', 'GET'),
    };

    // ============== PRODUCTS APIs ==============
    products = {
        getAll: (params = {}) => this.request(`/products?${new URLSearchParams(params)}`, 'GET'),
        getById: (productId) => this.request(`/products/${productId}`, 'GET'),
        create: (payload) => this.request('/products', 'POST', payload),
        update: (productId, payload) => this.request(`/products/${productId}`, 'PUT', payload),
        delete: (productId) => this.request(`/products/${productId}`, 'DELETE'),
        getPricingValues: (productId) => this.request(`/products/${productId}/pricing-values`, 'GET'),
        getPricePreview: (productId) => this.request(`/products/${productId}/price-preview`, 'GET'),
    };

    // ============== CATEGORIES APIs ==============
    categories = {
        create: (payload) => this.request('/categories', 'POST', payload),
        getAll: (params = {}) => this.request(`/categories?${new URLSearchParams(params)}`, 'GET'),
        getById: (categoryId) => this.request(`/categories/${categoryId}`, 'GET'),
        update: (categoryId, payload) => this.request(`/categories/${categoryId}`, 'PUT', payload),
        delete: (categoryId) => this.request(`/categories/${categoryId}`, 'DELETE'),
        getActivePublic: () => this.request('/categories/public/active', 'GET'),
    };

    // ============== ORDERS APIs ==============
    orders = {
        getAll: () => this.request('/orders', 'GET'),
        getById: (orderId) => this.request(`/orders/${orderId}`, 'GET'),
        priceLock: (payload) => this.request('/orders/price-lock', 'POST', payload),
        buyOrder: (payload) => this.request('/orders/buy', 'POST', payload),
        sellOrder: (payload) => this.request('/orders/sell', 'POST', payload),
        redeemOrder: (payload) => this.request('/orders/redeem', 'POST', payload),
        cancelOrder: (orderId) => this.request(`/orders/${orderId}/cancel`, 'POST'),
        getSummary: () => this.request('/orders/reports/summary', 'GET'),
        getTransactions: (params = {}) => this.request(`/orders/reports/transactions?${new URLSearchParams(params)}`, 'GET'),
    };

    // ============== PAYMENTS APIs ==============
    payments = {
        getPaymentStatus: (orderId) => this.request(`/payments/order/${orderId}/status`, 'GET'),
    };

    // ============== HOLDINGS APIs ==============
    holdings = {
        getAll: () => this.request('/holdings', 'GET'),
        getSummary: () => this.request('/holdings/summary', 'GET'),
        getLedger: () => this.request('/holdings/ledger', 'GET'),
        getByMetal: () => this.request('/holdings/breakdown-metal', 'GET'),
    };

    // ============== WALLET APIs ==============
    wallet = {
        getBalance: () => this.request('/wallet/balance', 'GET'),
        getTransactions: (params = {}) => this.request(`/wallet/transactions?${new URLSearchParams(params)}`, 'GET'),
        initiateDeposit: (payload) => this.request('/wallet/deposit/initiate', 'POST', payload),
        completeDeposit: (transactionId, payload) => this.request(`/wallet/deposit/${transactionId}/complete`, 'POST', payload),
        requestWithdrawal: (payload) => this.request('/wallet/withdraw/request', 'POST', payload),
        completeWithdrawal: (transactionId, payload) => this.request(`/wallet/withdraw/${transactionId}/complete`, 'POST', payload),
    };

    // ============== ANALYTICS APIs ==============
    analytics = {
        vendor: {
            getCustomerPnl: (customerId) => this.request(`/analytics/vendor/customer/${customerId}/pnl`, 'GET'),
            getCustomerMetrics: (customerId) => this.request(`/analytics/vendor/customer/${customerId}/metrics`, 'GET'),
            getCustomerLtv: (customerId) => this.request(`/analytics/vendor/customer/${customerId}/ltv`, 'GET'),
            getCustomerSegmentation: (params = {}) => this.request(`/analytics/vendor/customers/segmentation?${new URLSearchParams(params)}`, 'GET'),
            getMonthlyPnl: (params = {}) => this.request(`/analytics/vendor/monthly-pnl?${new URLSearchParams(params)}`, 'GET'),
            getComprehensiveReport: () => this.request('/analytics/vendor/reports/comprehensive', 'GET'),
            getAllCustomersLtv: (params = {}) => this.request(`/analytics/vendor/ltv/all?${new URLSearchParams(params)}`, 'GET'),
        }
    };

    // ============== DELIVERY APIs ==============
    delivery = {
        addresses: {
            getAll: () => this.request('/delivery/addresses', 'GET'),
            create: (payload) => this.request('/delivery/addresses', 'POST', payload),
            update: (addressId, payload) => this.request(`/delivery/addresses/${addressId}`, 'PATCH', payload),
            delete: (addressId) => this.request(`/delivery/addresses/${addressId}`, 'DELETE'),
        },
        shipments: {
            getAll: () => this.request('/delivery/shipments', 'GET'),
            getById: (shipmentId) => this.request(`/delivery/shipments/${shipmentId}`, 'GET'),
            update: (shipmentId, payload) => this.request(`/delivery/shipments/${shipmentId}`, 'PATCH', payload),
        },
    };

    // ============== HEALTH CHECK ==============
    health = {
        check: () => this.request('/', 'GET'),
    };
}

export default new APIService();