// Simple API helper to standardize requests and include auth token.

const BASE_URL = import.meta.env.VITE_API_URL || "http://161.248.62.37:7527/api/v1";

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