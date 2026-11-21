
/* ==========================================
   ENGLISH UP
   LOCAL AUTHENTICATION CONFIGURATION
   GitHub Independent Mode
   Version: 2.0.0
   ========================================== */

"use strict";

const STORAGE_KEY = "englishUpAdminSession";

export function getAdminSession() {
    try {
        const session = localStorage.getItem(STORAGE_KEY);
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error("Session error:", error);
        return null;
    }
}

export function createAdminSession(username) {
    const session = {
        username: String(username),
        loggedIn: true,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(session)
    );

    return session;
}

export function clearAdminSession() {
    localStorage.removeItem(STORAGE_KEY);
}

export function isAdminLoggedIn() {
    const session = getAdminSession();
    return Boolean(session?.loggedIn);
}
