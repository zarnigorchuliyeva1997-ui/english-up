
"use strict";

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("loginMessage");

function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "#16803c" : "#d93025";
}

function setLoading(loading) {
    loginButton.disabled = loading;
    loginButton.textContent = loading ? "Tekshirilmoqda..." : "Kirish";
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

    setLoading(true);

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
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
            throw new Error("Server javobida foydalanuvchi yoki token yo‘q.");
        }

        if (user.role !== "admin") {
            throw new Error("Sizda admin huquqi yo‘q.");
        }

        localStorage.setItem("englishUpToken", token);
        localStorage.setItem("englishUpAdmin", JSON.stringify(user));

        showMessage("Kirish muvaffaqiyatli. Yo‘naltirilmoqda...", true);

        window.location.replace("../index.html");

    } catch (error) {
        console.error("Admin login error:", error);

        showMessage(error.message || "Server bilan aloqa yo‘q.");

        passwordInput.value = "";
        setLoading(false);
    }
});
