
"use strict";

const TOKEN_KEY = "englishUpToken";
const ADMIN_KEY = "englishUpAdmin";

export function getAdminSession() {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        const adminData = localStorage.getItem(ADMIN_KEY);

        if (!token || !adminData) {
            return null;
        }

        const admin = JSON.parse(adminData);

        if (!admin || admin.role !== "admin") {
            return null;
        }

        return {
            token,
            admin,
            loggedIn: true
        };
    } catch (error) {
        console.error("Admin session error:", error);
        return null;
    }
}

export function clearAdminSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
}

export function isAdminLoggedIn() {
    return Boolean(getAdminSession());
}

export function getAdminToken() {
    const session = getAdminSession();
    return session ? session.token : null;
}

export function getAdminData() {
    const session = getAdminSession();
    return session ? session.admin : null;
}
