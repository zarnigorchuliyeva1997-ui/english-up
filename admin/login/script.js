
"use strict";

import {
    createAdminSession
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

form.addEventListener("submit", event => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Tekshirilmoqda...";
    showMessage("");

    /*
      DIQQAT:
      Bu vaqtinchalik lokal interfeys.
      Haqiqiy xavfsiz autentifikatsiya emas.
      Keyingi bosqichda admin kirishini
      xavfsiz backend orqali tashkil qilamiz.
    */

    const adminEmail = localStorage.getItem("euAdminEmail");
    const adminPassword = localStorage.getItem("euAdminPassword");

    if (!adminEmail || !adminPassword) {
        showMessage("Admin akkaunti hali yaratilmagan.");
        loginButton.disabled = false;
        loginButton.textContent = "Kirish";
        return;
    }

    if (email !== adminEmail || password !== adminPassword) {
        showMessage("Email yoki parol noto‘g‘ri.");
        loginButton.disabled = false;
        loginButton.textContent = "Kirish";
        passwordInput.value = "";
        return;
    }

    createAdminSession(email);

    showMessage("Kirish muvaffaqiyatli.", true);

    window.location.href = "../index.html";
});
