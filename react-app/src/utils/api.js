export const API = import.meta.env.VITE_API || "http://localhost:8080";

export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchWithAuth(endpoint, options = {}) {
    const headers = {
        ...getAuthHeaders(),
        ...options.headers,
    };

    const response = await fetch(`${API}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || error.msg || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}
