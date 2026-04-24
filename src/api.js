// Use relative path for proxy in development, full URL in production
const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const getToken = () => localStorage.getItem("token");

export const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (path, options = {}) => {
    const { headers: extraHeaders, ...restOptions } = options;

    try {
        // ✅ Increase timeout to 60 seconds for remote API server
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(`${BASE_URL}${path}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...authHeaders(),
                ...extraHeaders,
            },
            signal: controller.signal,
            ...restOptions,
        });

        clearTimeout(timeout);

        // Handle empty responses (204 No Content, etc.)
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            const message = data?.message || response.statusText || "Request failed";
            const error = new Error(message);
            error.status = response.status;
            error.response = data;
            throw error;
        }

        return data;
    } catch (error) {
        // ✅ Better error handling for timeouts
        if (error.name === 'AbortError') {
            console.warn(`⏱️ API Timeout: ${path} took longer than 10 seconds`);
            throw new Error('API Timeout - Server not responding');
        }
        throw error;
    }
};

// ─── Convenience methods ──────────────────────────────────────────────────────

export const api = {
    get: (path, options = {}) =>
        apiFetch(path, { method: "GET", ...options }),

    post: (path, body, options = {}) =>
        apiFetch(path, { method: "POST", body: JSON.stringify(body), ...options }),

    put: (path, body, options = {}) =>
        apiFetch(path, { method: "PUT", body: JSON.stringify(body), ...options }),

    patch: (path, body, options = {}) =>
        apiFetch(path, { method: "PATCH", body: JSON.stringify(body), ...options }),

    delete: (path, options = {}) =>
        apiFetch(path, { method: "DELETE", ...options }),
};