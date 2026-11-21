
import {
    onAuthStateChanged,
    getIdTokenResult,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import { auth, authPersistence } from "./login/firebase.js";

onAuthStateChanged(auth, async (user) => {
    try {
        await authPersistence;

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
        console.error("Admin tekshiruvi:", error);
        await signOut(auth);
        window.location.replace("./login/index.html");
    }
});
