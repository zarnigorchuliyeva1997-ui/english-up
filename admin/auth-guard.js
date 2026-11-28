
"use strict";

import {
    getAdminSession,
    clearAdminSession
} from "./login/firebase.js";

const LOGIN_URL = "/admin/login/index.html";
const ADMIN_API = "/api/admin/me";

document.documentElement.style.visibility = "hidden";

function redirectToLogin() {
    clearAdminSession();
    window.location.replace(LOGIN_URL);
}

async function checkAdminAccess() {
    const session = getAdminSession();

    if (!session || !session.token) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch(ADMIN_API, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${session.token}`,
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        const data = await response.json().catch(() => null);

        if (
            !response.ok ||
            !data ||
            data.success !== true ||
            !data.user ||
            data.user.role !== "admin" ||
            data.user.is_active !== true
        ) {
            redirectToLogin();
            return;
        }

        localStorage.setItem(
            "englishUpAdmin",
            JSON.stringify(data.user)
        );

        document.documentElement.style.visibility = "visible";

    } catch (error) {
        console.error("Admin authentication error:", error);
        redirectToLogin();
    }
}

checkAdminAccess();
