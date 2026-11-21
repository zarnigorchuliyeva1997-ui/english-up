
import {
    signInWithEmailAndPassword,
    signOut,
    getIdTokenResult
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    auth,
    authPersistence
} from "./firebase.js";

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("loginMessage");

function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "#16803c" : "#d93025";
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Tekshirilmoqda...";
    showMessage("");

    try {
        await authPersistence;

        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const tokenResult = await getIdTokenResult(
            credential.user,
            true
        );

        if (tokenResult.claims.admin !== true) {
            await signOut(auth);
            showMessage("Bu akkauntda administrator huquqi mavjud emas.");
            return;
        }

        showMessage("Admin tasdiqlandi. Dashboard ochilmoqda.", true);

        window.location.href = "../index.html";

    } catch (error) {
        console.error("Login error:", error);

        const errors = {
            "auth/invalid-credential": "Email yoki parol noto‘g‘ri.",
            "auth/user-not-found": "Bunday akkaunt topilmadi.",
            "auth/wrong-password": "Parol noto‘g‘ri.",
            "auth/invalid-email": "Email manzil noto‘g‘ri.",
            "auth/too-many-requests": "Ko‘p urinish bo‘ldi. Keyinroq urinib ko‘ring.",
            "auth/network-request-failed": "Internet aloqasini tekshiring."
        };

        showMessage(
            errors[error.code] || "Kirishda xatolik yuz berdi."
        );

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Kirish";
        passwordInput.value = "";
    }
});
