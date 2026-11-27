
"use strict";

import {
    getAdminSession,
    clearAdminSession
} from "./login/firebase.js";

document.documentElement.style.visibility = "hidden";

async function checkAdminAccess() {
    try {
        const session = getAdminSession();

        if (!session || !session.token) {
            clearAdminSession();
            window.location.replace("./login/index.html");
            return;
        }

        const response = await fetch("/api/admin/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${session.token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json().catch(() => ({}));

        if (
            !response.ok ||
            !data.success ||
            !data.user ||
            data.user.role !== "admin"
        ) {
            clearAdminSession();
            window.location.replace("./login/index.html");
            return;
        }

        localStorage.setItem(
            "englishUpAdmin",
            JSON.stringify(data.user)
        );

        document.documentElement.style.visibility = "visible";

    } catch (error) {
        console.error("Admin access error:", error);

        clearAdminSession();
        window.location.replace("./login/index.html");
    }
}

checkAdminAccess();
