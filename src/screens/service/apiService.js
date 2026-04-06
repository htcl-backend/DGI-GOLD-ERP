const API_BASE_URL = 'http://161.248.62.37:7527/api/v1';

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

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.status}`);
            }

            return { success: true, data, status: response.status };
        } catch (error) {
            console.error(`API Error [${method} ${endpoint}]:`, error);
            return { success: false, error: error.message, status: null };
        }
    }

    // ============== AUTHENTICATION APIs ==============
    auth = {
        register: (payload) => this.request('/auth/register', 'POST', payload),
        login: (payload) => this.request('/auth/login', 'POST', payload),
        logout: () => this.request('/auth/logout', 'POST'),
        getProfile: () => this.request('/auth/profile', 'GET'),
        updateProfile: (payload) => this.request('/auth/profile', 'PATCH', payload),
        changePassword: (payload) => this.request('/auth/change-password', 'PATCH', payload),
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
        getAll: () => this.request('/products', 'GET'),
        getById: (productId) => this.request(`/products/${productId}`, 'GET'),
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