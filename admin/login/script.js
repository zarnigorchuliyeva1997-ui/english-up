
"use strict";

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("loginMessage");

const TOKEN_KEY = "englishUpToken";
const ADMIN_KEY = "englishUpAdmin";

function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "#16803c" : "#d93025";
}

function setLoading(loading) {
    loginButton.disabled = loading;
    loginButton.textContent = loading
        ? "Tekshirilmoqda..."
        : "Kirish";
}

function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    showMessage("");

    if (!email || !password) {
        showMessage("Email va parolni kiriting.");
        return;
    }

    clearSession();
    setLoading(true);

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            }),
            cache: "no-store"
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Email yoki parol noto‘g‘ri."
            );
        }

        const user = data.user;
        const token = data.token;

        if (!user || !token) {
            throw new Error("Server javobida ma'lumot yetishmaydi.");
        }

        if (user.role !== "admin") {
            throw new Error("Sizda admin huquqi yo‘q.");
        }

        if (user.is_active !== true) {
            throw new Error("Admin akkaunti faol emas.");
        }

        localStorage.setItem(TOKEN_KEY, token);

        const verifyResponse = await fetch("/api/admin/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        const verifyData = await verifyResponse.json().catch(() => ({}));

        if (
            !verifyResponse.ok ||
            !verifyData.success ||
            !verifyData.user ||
            verifyData.user.role !== "admin" ||
            verifyData.user.is_active !== true
        ) {
            throw new Error("Admin huquqini tasdiqlash amalga oshmadi.");
        }

        localStorage.setItem(
            ADMIN_KEY,
            JSON.stringify(verifyData.user)
        );

        showMessage(
            "Kirish muvaffaqiyatli. Yo‘naltirilmoqda...",
            true
        );

        window.location.replace("/admin/index.html");

    } catch (error) {
        console.error("Admin login error:", error);

        clearSession();

        showMessage(
            error.message || "Server bilan aloqa yo‘q."
        );

        passwordInput.value = "";
        setLoading(false);
    }
});
