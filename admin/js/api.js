"use strict";

import { getAdminToken, clearAdminSession } from "../login/firebase.js";

const API_BASE = "/api";

async function request(endpoint, options = {}) {
    const token = getAdminToken();
    
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401 || response.status === 403) {
            clearAdminSession();
            window.location.replace("/admin/login/index.html");
            return null;
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || data.error || `HTTP xato: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error(`API xatosi [${endpoint}]:`, error);
        throw error;
    }
}

export const api = {
    get: (endpoint) => request(endpoint, { method: "GET" }),
    post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
    patch: (endpoint, body) => request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" })
};
