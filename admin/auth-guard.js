
/* ==========================================
   ENGLISH UP ADMIN AUTH GUARD
   GitHub Independent Mode
   Version: 2.0.0
   ========================================== */

"use strict";

import {
    isAdminLoggedIn,
    clearAdminSession
} from "../login/firebase.js";

document.documentElement.style.visibility = "hidden";

function checkAdminAccess() {
    try {
        if (!isAdminLoggedIn()) {
            clearAdminSession();
            window.location.replace("../login/index.html");
            return;
        }

        document.documentElement.style.visibility = "visible";

    } catch (error) {
        console.error("Admin access error:", error);

        clearAdminSession();
        window.location.replace("../login/index.html");
    }
}

checkAdminAccess();
