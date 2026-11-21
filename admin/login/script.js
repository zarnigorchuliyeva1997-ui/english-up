
"use strict";

import { createAdminSession } from "./firebase.js";

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("loginMessage");

const EMAIL_KEY = "euAdminEmail";
const PASSWORD_KEY = "euAdminPassword";

function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "#16803c" : "#d93025";
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Tekshirilmoqda...";
    showMessage("");

    let savedEmail = localStorage.getItem(EMAIL_KEY);
    let savedPassword = localStorage.getItem(PASSWORD_KEY);

    // Birinchi kirishda lokal admin hisobini yaratish
    if (!savedEmail || !savedPassword) {
        if (password.length < 8) {
            showMessage("Birinchi parol kamida 8 ta belgidan iborat bo‘lsin.");
            loginButton.disabled = false;
            loginButton.textContent = "Kirish";
            return;
        }

        localStorage.setItem(EMAIL_KEY, email);
        localStorage.setItem(PASSWORD_KEY, password);

        createAdminSession(email);
        showMessage("Lokal admin hisobi yaratildi.", true);

        window.location.href = "../admin/index.html";
        return;
    }

    // Mavjud hisobni tekshirish
    if (email !== savedEmail || password !== savedPassword) {
        showMessage("Email yoki parol noto‘g‘ri.");
        passwordInput.value = "";
        loginButton.disabled = false;
        loginButton.textContent = "Kirish";
        return;
    }

    createAdminSession(email);
    showMessage("Kirish muvaffaqiyatli.", true);

    window.location.href = "../admin/index.html";
});
