// Simple API helper to standardize requests and include auth token.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5321/api";

export const getToken = () => {
    return localStorage.getItem("token");
};

export const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (path, options = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...authHeaders(),
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || response.statusText || "Request failed";
        const error = new Error(message);
        error.status = response.status;
        error.response = data;
        throw error;
    }

    return data;
};

const API_BASE_URL = 'http://161.248.62.37:7527/api/v1';

export const apiTester = {
    results: [],

    async testEndpoint(name, method, endpoint, headers = {}, body = null) {
        const startTime = Date.now();
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const data = await response.json();
            const duration = Date.now() - startTime;

            const result = {
                name,
                endpoint,
                method,
                status: response.status,
                statusText: response.statusText,
                success: response.ok,
                duration: `${duration}ms`,
                data: data,
                error: !response.ok ? data.message || 'Request failed' : null,
                timestamp: new Date().toISOString(),
            };

            this.results.push(result);
            console.log(`✅ [${name}]`, result);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            const result = {
                name,
                endpoint,
                method,
                status: 'ERROR',
                statusText: error.message,
                success: false,
                duration: `${duration}ms`,
                data: null,
                error: error.message,
                timestamp: new Date().toISOString(),
            };

            this.results.push(result);
            console.error(`❌ [${name}]`, result);
            return result;
        }
    },

    getResults() {
        return this.results;
    },

    clearResults() {
        this.results = [];
    },

    getSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.success).length;
        const failed = total - passed;

        return {
            total,
            passed,
            failed,
            passPercentage: total > 0 ? ((passed / total) * 100).toFixed(2) : 0,
            results: this.results,
        };
    },
};