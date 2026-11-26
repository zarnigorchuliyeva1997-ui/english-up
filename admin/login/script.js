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

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Tekshirilmoqda...";
    showMessage("");

    if (!email || !password) {
        showMessage("Email va parolni kiriting.");
        loginButton.disabled = false;
        loginButton.textContent = "Kirish";
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            if (data.user && data.user.role === 'admin') {
                // TOKENNI TO'G'RI SAQLASH
                localStorage.setItem('englishUpToken', data.token);
                localStorage.setItem('englishUpAdmin', JSON.stringify(data.user));
                
                showMessage("Kirish muvaffaqiyatli. Yo'naltirilmoqda...", true);
                
                setTimeout(() => {
                    window.location.href = "../index.html"; // Admin panelning asosiy sahifasiga o'tish
                }, 1000);
            } else {
                showMessage("Sizda admin huquqi yo'q!");
                loginButton.disabled = false;
                loginButton.textContent = "Kirish";
            }
        } else {
            showMessage(data.message || "Email yoki parol noto'g'ri.");
            passwordInput.value = "";
            loginButton.disabled = false;
            loginButton.textContent = "Kirish";
        }
    } catch (error) {
        console.error("Login error:", error);
        showMessage("Server bilan aloqa yo'q. Keyinroq urinib ko'ring.");
        loginButton.disabled = false;
        loginButton.textContent = "Kirish";
    }
});
