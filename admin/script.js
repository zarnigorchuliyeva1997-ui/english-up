
/* ==========================================
   ENGLISH UP ADMIN PANEL
   MAIN JAVASCRIPT
   ========================================== */

"use strict";


/* ==========================================
   1. DOM ELEMENTS
   ========================================== */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const menuToggle = document.getElementById("menuToggle");
const sidebarClose = document.getElementById("sidebarClose");

const logoutButton = document.getElementById("logoutButton");
const notificationButton = document.getElementById("notificationButton");

const globalSearch = document.getElementById("globalSearch");

const adminLoading = document.getElementById("adminLoading");
const dashboardDate = document.getElementById("dashboardDate");

const toastContainer = document.getElementById("toastContainer");


/* ==========================================
   2. GENERAL CONFIGURATION
   ========================================== */

const AdminConfig = {
    appName: "English Up",
    version: "1.0.0",
    currentPage: "dashboard"
};


/* ==========================================
   3. TOAST NOTIFICATION SYSTEM
   ========================================== */

function showToast(message, duration = 3500) {

    if (!toastContainer) return;

    const toast = document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}


/* ==========================================
   4. MOBILE SIDEBAR
   ========================================== */

function openSidebar() {

    if (!sidebar) return;

    sidebar.classList.add("open");

    sidebarOverlay?.classList.add("show");

    menuToggle?.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";
}


function closeSidebar() {

    if (!sidebar) return;

    sidebar.classList.remove("open");

    sidebarOverlay?.classList.remove("show");

    menuToggle?.setAttribute("aria-expanded", "false");

    document.body.style.overflow = "";
}


menuToggle?.addEventListener("click", () => {

    if (sidebar?.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }

});


sidebarClose?.addEventListener("click", closeSidebar);

sidebarOverlay?.addEventListener("click", closeSidebar);


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeSidebar();
    }

});


/* ==========================================
   5. NAVIGATION
   ========================================== */

function setActiveNavigation() {

    const currentPath = window.location.pathname;

    const navigationLinks = document.querySelectorAll(
        ".nav-link[data-page]"
    );

    navigationLinks.forEach(link => {

        const linkPath = new URL(
            link.getAttribute("href"),
            window.location.href
        ).pathname;

        const isActive = currentPath === linkPath;

        link.classList.toggle("active", isActive);

        if (isActive) {
            AdminConfig.currentPage =
                link.dataset.page || "dashboard";

            link.setAttribute("aria-current", "page");

        } else {

            link.removeAttribute("aria-current");

        }

    });

}


document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        closeSidebar();

    });

});


setActiveNavigation();


/* ==========================================
   6. DASHBOARD DATE
   ========================================== */

function updateDashboardDate() {

    if (!dashboardDate) return;

    const now = new Date();

    dashboardDate.textContent = now.toLocaleDateString(
        "uz-UZ",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}

updateDashboardDate();


/* ==========================================
   7. GLOBAL NAVIGATION SEARCH
   ========================================== */

function searchNavigation(query) {

    const links = document.querySelectorAll(
        ".sidebar-navigation .nav-link"
    );

    const sections = document.querySelectorAll(
        ".sidebar-navigation .nav-section-title"
    );

    const normalizedQuery = query
        .trim()
        .toLocaleLowerCase("uz");

    if (!normalizedQuery) {

        links.forEach(link => {
            link.style.display = "flex";
        });

        sections.forEach(section => {
            section.style.display = "block";
        });

        return;
    }

    links.forEach(link => {

        const text = link.textContent
            .trim()
            .toLocaleLowerCase("uz");

        const matches = text.includes(normalizedQuery);

        link.style.display = matches ? "flex" : "none";

    });

    sections.forEach(section => {

        let next = section.nextElementSibling;

        let hasVisibleLink = false;

        while (next && !next.classList.contains("nav-section-title")) {

            if (
                next.classList.contains("nav-link") &&
                next.style.display !== "none"
            ) {
                hasVisibleLink = true;
            }

            next = next.nextElementSibling;

        }

        section.style.display = hasVisibleLink
            ? "block"
            : "none";

    });

}


globalSearch?.addEventListener("input", event => {

    searchNavigation(event.target.value);

});


globalSearch?.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        globalSearch.value = "";

        searchNavigation("");

    }

});


/* ==========================================
   8. NOTIFICATIONS
   ========================================== */

notificationButton?.addEventListener("click", () => {

    showToast(
        "Bildirishnomalar tizimi Firebase bilan ulanishdan keyin ishlaydi."
    );

});


/* ==========================================
   9. LOGOUT BUTTON
   ========================================== */

// Firebase Authentication hali ulanmagan.
// Shu sababli hozircha haqiqiy chiqish funksiyasi yo'q.

logoutButton?.addEventListener("click", () => {

    showToast(
        "Chiqish funksiyasi Firebase autentifikatsiyasi ulangach faollashadi."
    );

});


/* ==========================================
   10. SYSTEM STATUS
   ========================================== */

function updateSystemStatus() {

    const firebaseStatus = document.getElementById(
        "firebaseStatus"
    );

    const authStatus = document.getElementById(
        "authStatus"
    );

    const databaseStatus = document.getElementById(
        "databaseStatus"
    );

    if (firebaseStatus) {
        firebaseStatus.textContent = "Hali ulanmagan";
    }

    if (authStatus) {
        authStatus.textContent = "Hali sozlanmagan";
    }

    if (databaseStatus) {
        databaseStatus.textContent = "Hali ulanmagan";
    }

}

updateSystemStatus();


/* ==========================================
   11. DASHBOARD INITIALIZATION
   ========================================== */

function initializeDashboard() {

    updateDashboardDate();

    setActiveNavigation();

    updateSystemStatus();

}


/* ==========================================
   12. LOADING SCREEN
   ========================================== */

function hideLoadingScreen() {

    if (!adminLoading) return;

    adminLoading.style.opacity = "0";

    adminLoading.style.transition = "opacity 0.25s ease";

    setTimeout(() => {

        adminLoading.style.display = "none";

    }, 260);

}


/* ==========================================
   13. RESPONSIVE MENU
   ========================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 760) {

        closeSidebar();

    }

});


/* ==========================================
   14. START ADMIN INTERFACE
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

    hideLoadingScreen();

    console.log(
        "English Up Admin Interface initialized."
    );

    console.log(
        "Version:",
        AdminConfig.version
    );

});


/* ==========================================
   END ENGLISH UP ADMIN SCRIPT
   ========================================== */

