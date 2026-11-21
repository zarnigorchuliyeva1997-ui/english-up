
/* =================================
   ENGLISH UP ADMIN LOGIN
   DEMO MODE - FIREBASE NOT CONNECTED
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("loginMessage");
    const loginButton = document.getElementById("loginButton");

    if (!form || !emailInput || !passwordInput) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        message.style.color = "#d04444";

        if (!email || !password) {
            message.textContent = "Barcha maydonlarni to‘ldiring.";
            return;
        }

        if (password.length < 6) {
            message.textContent = "Parol kamida 6 ta belgidan iborat bo‘lishi kerak.";
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Tekshirilmoqda...";

        message.style.color = "#7047eb";
        message.textContent =
            "Login interfeysi tayyor. Firebase hali ulanmagan.";

        // Parolni saqlamaymiz va hech qayerga yubormaymiz.
        passwordInput.value = "";

        loginButton.disabled = false;
        loginButton.textContent = "Kirish";
    });
});
