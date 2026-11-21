
import {
    onAuthStateChanged,
    getIdTokenResult,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import { auth } from "./login/firebase.js";

document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, async (user) => {
    try {
        if (!user) {
            window.location.replace("./login/index.html");
            return;
        }

        const token = await getIdTokenResult(user, true);

        if (token.claims.admin !== true) {
            await signOut(auth);
            window.location.replace("./login/index.html");
            return;
        }

        document.documentElement.style.visibility = "visible";

    } catch (error) {
        console.error("Admin access error:", error);
        await signOut(auth);
        window.location.replace("./login/index.html");
    }
});
