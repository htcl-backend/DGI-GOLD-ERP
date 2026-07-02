// Use relative path for proxy in development, full URL in production
const API_BASE_URL = import.meta.env.DEV ? '/api/v1' : import.meta.env.VITE_API_URL || '/api/v1';
const API_W1_BASE_URL = import.meta.env.DEV ? '/api/w1' : import.meta.env.VITE_API_W1_URL || '/api/w1';

// console.log('🔧 API Service Initialized with BASE URL:', API_BASE_URL, 'W1 URL:', API_W1_BASE_URL);

class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.w1BaseURL = API_W1_BASE_URL;
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

        // ✅ Add vendor context for authorization (required for analytics endpoints)
        const tenantId = localStorage.getItem('tenantId');
        const vendorId = localStorage.getItem('vendorId');
        if (tenantId) {
            headers['X-Tenant-Id'] = tenantId;
        }
        if (vendorId) {
            headers['X-Vendor-Id'] = vendorId;
        }

        return headers;
    }

    async request(endpoint, method = 'GET', body = null, isFormData = false, baseURL = this.baseURL) {
        try {
            const url = `${baseURL}${endpoint}`;
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
                // ✅ Better error messages for different status codes
                if (response.status === 403) {
                    const tenantId = localStorage.getItem('tenantId');
                    console.error(`⚠️ 403 FORBIDDEN [${method} ${endpoint}]`);
                    console.error(`   Tenant ID: ${tenantId || 'NOT SET'}`);
                    console.error(`   Message: ${data?.message || 'Access Denied - Check user permissions or vendor context'}`);
                    throw new Error(`Access Denied (403) - ${data?.message || 'You may not have permission for this resource'}`);
                }
                throw new Error(data?.message || `API Error: ${response.status}`);
            }

            return { success: true, data, status: response.status };
        } catch (error) {
            // ✅ Better error handling for network issues
            if (error.name === 'AbortError') {
                console.error(`API Timeout [${method} ${endpoint}]: Request took too long`);
                return { success: false, error: 'API Timeout - Server not responding', status: null };
            }

            // Common Node/Vite proxy DNS errors contain ENOTFOUND or getaddrinfo
            if (error.message && (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo'))) {
                console.error(`Network/DNS Error [${method} ${endpoint}]:`, error.message);
                return { success: false, error: `Cannot resolve API host. Check VITE_API_URL / VITE_API_PROXY_TARGET and network connectivity. (${error.message})`, status: null };
            }

            console.error(`API Error [${method} ${endpoint}]:`, error);
            return { success: false, error: error.message || 'Unknown network error', status: null };
        }
    }

    async requestW1(endpoint, method = 'GET', body = null, isFormData = false) {
        return this.request(endpoint, method, body, isFormData, this.w1BaseURL);
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
        // ✅ Vendor profile
        getProfile: () => this.request('/vendor/profile', 'GET'),
        updateProfile: (payload) => this.request('/vendor/profile', 'PATCH', payload),
        updateProfileImage: (formData) => this.request('/vendor/profile/image', 'PATCH', formData, true),
        changePassword: (payload) => this.request('/vendor/change-password', 'PATCH', payload),
        refreshToken: () => this.request('/vendor/refresh-token', 'POST'),
        logout: () => this.request('/vendor/logout', 'POST'),
        logoutAll: () => this.request('/vendor/logout-all', 'POST'),
        googleLogin: (payload) => this.request('/vendor/google-login', 'POST', payload),

        // ✅ Vendor orders (with pagination and filtering)
        orders: {
            getAll: (params = {}) => this.request(`/vendor/orders?${new URLSearchParams(params)}`, 'GET'),
            getById: (orderId) => this.request(`/vendor/orders/${orderId}`, 'GET'),
        },

        // ✅ Vendor customers (with pagination and sorting)
        customers: {
            getAll: (params = {}) => this.request(`/vendor/customers/list?${new URLSearchParams(params)}`, 'GET'),
            getById: (customerId) => this.request(`/vendor/customers/${customerId}`, 'GET'),
        },

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

        // ✅ Inventory Management Endpoints
        getInventoryReport: () => this.request('/products/inventory/report', 'GET'),
        getLowStockProducts: () => this.request('/products/low-stock', 'GET'),
        adjustStock: (productId, payload) => this.request(`/products/${productId}/stock`, 'POST', payload),
        getStockMovements: (productId) => this.request(`/products/${productId}/stock/movements`, 'GET'),
        uploadMedia: (productId, formData) => this.request(`/products/${productId}/media`, 'POST', formData, true),
        changePublishStatus: (productId, payload) => this.request(`/products/${productId}/publish-status`, 'PATCH', payload),
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
        getSummary: (params = {}) => this.request(`/orders/reports/summary?${new URLSearchParams(params)}`, 'GET'),
        getTransactions: (params = {}) => this.request(`/orders/reports/transactions?${new URLSearchParams(params)}`, 'GET'),
        getAdminPending: (params = {}) => this.request(`/orders/admin/pending?${new URLSearchParams(params)}`, 'GET'),
        approveOrder: (orderId, payload = {}) => this.request(`/orders/${orderId}/approve`, 'POST', payload),
        rejectOrder: (orderId, payload) => this.request(`/orders/${orderId}/reject`, 'POST', payload),
    };

    // ============== PAYMENTS APIs ==============
    payments = {
        getPaymentStatus: (orderId) => this.request(`/payments/order/${orderId}/status`, 'GET'),
    };

    // ============== HOLDINGS APIs ==============
    // User Holdings, Summary, and Metal Breakdown
    holdings = {
        // Get all holdings: /holdings
        getAll: () => this.request('/holdings', 'GET'),

        // Get holdings summary: /holdings/summary
        getSummary: () => this.request('/holdings/summary', 'GET'),

        // Get holdings ledger: /holdings/ledger
        getLedger: () => this.request('/holdings/ledger', 'GET'),

        // Get holdings breakdown by metal: /holdings/breakdown-metal
        getByMetal: () => this.request('/holdings/breakdown-metal', 'GET'),

        // Get holdings for specific user: /holdings/{userId}
        getByUserId: (userId) => this.request(`/holdings/${userId}`, 'GET'),
    };

    // ============== WALLET APIs ==============
    wallet = {
        // Balance and Transactions
        getBalance: () => this.request('/wallet/balance', 'GET'),
        getTransactions: (params = {}) => this.request(`/wallet/transactions?${new URLSearchParams(params)}`, 'GET'),
        getLedger: () => this.requestW1('/wallet/ledger', 'GET'),

        // Deposits
        initiateDeposit: (payload) => this.request('/wallet/deposit/initiate', 'POST', payload),
        completeDeposit: (transactionId, payload) => this.request(`/wallet/deposit/${transactionId}/complete`, 'POST', payload),

        // Withdrawals
        requestWithdrawal: (payload) => this.request('/wallet/withdraw/request', 'POST', payload),
        completeWithdrawal: (transactionId, payload) => this.request(`/wallet/withdraw/${transactionId}/complete`, 'POST', payload),
        withdraw: (payload) => this.request('/wallet/withdraw', 'POST', payload),

        // OTP
        requestOtp: (payload) => this.request('/wallet/otp/request', 'POST', payload),

        // Admin functions
        getAdminBalance: (userId) => this.request(`/wallet/admin/balance?userId=${encodeURIComponent(userId)}`, 'GET'),
        blockWithdrawals: (userId, payload) => this.request(`/wallet/admin/${userId}/block-withdrawals`, 'POST', payload),

        // Commodities
        getHoldings: () => this.request('/wallet/commodities/holdings', 'GET'),
        sellCommodity: (payload) => this.request('/wallet/commodities/sell', 'POST', payload),
    };

    // ============== KYC APIs ==============
    kyc = {
        getPending: (params = {}) => this.request(`/kyc/pending?${new URLSearchParams({ page: 1, limit: 20, sortBy: 'submittedAt', sortOrder: 'asc', ...params })}`, 'GET'),
        getApproved: (params = {}) => this.request(`/kyc/approved?${new URLSearchParams({ page: 1, limit: 20, sortBy: 'reviewedAt', sortOrder: 'desc', ...params })}`, 'GET'),
        getRejected: (params = {}) => this.request(`/kyc/rejected?${new URLSearchParams({ page: 1, limit: 20, sortBy: 'reviewedAt', sortOrder: 'desc', ...params })}`, 'GET'),
        reviewKYC: (kycId, payload) => {
            console.log(`🔍 KYC Review Request:`, {
                endpoint: `/kyc/${kycId}/review`,
                method: 'POST',
                payload: payload
            });
            return this.request(`/kyc/${kycId}/review`, 'POST', payload);
        },
    };

    // ============== ANALYTICS APIs ==============
    // Customer P&L, Metrics, LTV, and Segmentation Analysis
    analytics = {
        vendor: {
            // Customer P&L Analysis: /analytics/vendor/customer/{customerId}/pnl
            getCustomerPnl: (customerId) => this.request(`/analytics/vendor/customer/${customerId}/pnl`, 'GET'),

            // Customer Metrics: /analytics/vendor/customer/{customerId}/metrics
            getCustomerMetrics: (customerId) => this.request(`/analytics/vendor/customer/${customerId}/metrics`, 'GET'),

            // Customer Lifetime Value: /analytics/vendor/customer/{customerId}/ltv
            getCustomerLtv: (customerId) => this.request(`/analytics/vendor/customer/${customerId}/ltv`, 'GET'),

            // Customer Segmentation with filters: /analytics/vendor/customers/segmentation?segment=active&limit=100
            getCustomerSegmentation: (params = {}) => this.request(`/analytics/vendor/customers/segmentation?${new URLSearchParams(params)}`, 'GET'),

            // All Customers List: /analytics/vendor/customers/list
            getAllCustomers: (params = {}) => this.request(`/analytics/vendor/customers/list?${new URLSearchParams(params)}`, 'GET'),

            // Monthly P&L Report: /analytics/vendor/monthly-pnl
            getMonthlyPnl: (params = {}) => this.request(`/analytics/vendor/monthly-pnl?${new URLSearchParams(params)}`, 'GET'),

            // Comprehensive Vendor Report: /analytics/vendor/reports/comprehensive
            getComprehensiveReport: () => this.request('/analytics/vendor/reports/comprehensive', 'GET'),

            // All Customers LTV Report: /analytics/vendor/ltv/all?limit=50
            getAllCustomersLtv: (params = {}) => this.request(`/analytics/vendor/ltv/all?${new URLSearchParams(params)}`, 'GET'),
        }
    };

    admin = {
        analytics: {
            getOverview: (params = {}) => this.requestW1(`/admin/analytics?${new URLSearchParams(params)}`, 'GET'),
        }
    };

    // ============== LEDGER APIs ==============
    ledger = {
        admin: {
            // GET /api/v1/ledger/admin/transaction - Fetch admin transaction ledger
            getTransactions: (params = {}) => this.request(`/ledger/admin/transaction?${new URLSearchParams(params)}`, 'GET'),

            // GET /api/v1/ledger/admin/wallet - Fetch admin wallet ledger
            getWalletLedger: (params = {}) => this.request(`/ledger/admin/wallet?${new URLSearchParams(params)}`, 'GET'),
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