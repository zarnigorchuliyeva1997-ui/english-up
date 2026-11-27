
/* ==========================================
   ENGLISH UP ADMIN PANEL
   SHARED MAIN JAVASCRIPT
   Version: 3.0.0
   Timeweb + JWT + PostgreSQL
   ========================================== */

"use strict";

/* 1. CONFIGURATION */

const AdminConfig = {
    appName: "English Up",
    version: "3.0.0",
    currentPage: "dashboard",
    mobileBreakpoint: 760,
    mode: "timeweb",
    tokenKey: "englishUpToken",
    adminKey: "englishUpAdmin"
};

/* 2. SAFE DOM HELPERS */

const getElement = (id) => document.getElementById(id);

const sidebar = getElement("sidebar");
const sidebarOverlay = getElement("sidebarOverlay");
const menuToggle = getElement("menuToggle");
const sidebarClose = getElement("sidebarClose");
const logoutButton = getElement("logoutButton");
const notificationButton = getElement("notificationButton");
const globalSearch = getElement("globalSearch");
const adminLoading = getElement("adminLoading");
const dashboardDate = getElement("dashboardDate");
const toastContainer = getElement("toastContainer");

/* 3. TOAST NOTIFICATIONS */

function showToast(message, duration = 3500) {
    if (!toastContainer) {
        console.info(message);
        return;
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = String(message);

    toastContainer.appendChild(toast);

    window.setTimeout(() => {
        toast.remove();
    }, duration);
}

/* 4. MOBILE SIDEBAR */

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

        if (globalSearch) {
            globalSearch.value = "";
            searchNavigation("");
        }
    }
});

/* 5. NAVIGATION */

function setActiveNavigation() {
    const currentPath = window.location.pathname;

    const navigationLinks = document.querySelectorAll(
        ".nav-link[data-page]"
    );

    let activeFound = false;

    navigationLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        try {
            const linkPath = new URL(
                href,
                window.location.href
            ).pathname;

            const isActive = currentPath === linkPath;

            link.classList.toggle("active", isActive);

            if (isActive) {
                activeFound = true;

                AdminConfig.currentPage =
                    link.dataset.page || "dashboard";

                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        } catch (error) {
            console.warn("Navigation URL error:", href);
        }
    });

    if (!activeFound) {
        AdminConfig.currentPage = "unknown";
    }
}

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeSidebar);
});

/* 6. DASHBOARD DATE */

function updateDashboardDate() {
    if (!dashboardDate) return;

    dashboardDate.textContent = new Date().toLocaleDateString(
        "uz-UZ",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

/* 7. GLOBAL SEARCH */

function searchNavigation(query) {
    const links = document.querySelectorAll(
        ".sidebar-navigation .nav-link"
    );

    const sections = document.querySelectorAll(
        ".sidebar-navigation .nav-section-title"
    );

    const normalizedQuery = String(query)
        .trim()
        .toLocaleLowerCase("uz");

    if (!normalizedQuery) {
        links.forEach((link) => {
            link.style.display = "";
        });

        sections.forEach((section) => {
            section.style.display = "";
        });

        return;
    }

    links.forEach((link) => {
        const text = link.textContent
            .trim()
            .toLocaleLowerCase("uz");

        link.style.display = text.includes(normalizedQuery)
            ? "flex"
            : "none";
    });

    sections.forEach((section) => {
        let next = section.nextElementSibling;
        let hasVisibleLink = false;

        while (
            next &&
            !next.classList.contains("nav-section-title")
        ) {
            if (
                next.classList.contains("nav-link") &&
                next.style.display !== "none"
            ) {
                hasVisibleLink = true;
            }

            next = next.nextElementSibling;
        }

        section.style.display = hasVisibleLink ? "" : "none";
    });
}

globalSearch?.addEventListener("input", (event) => {
    searchNavigation(event.target.value);
});

globalSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        globalSearch.value = "";
        searchNavigation("");
    }
});

/* 8. NOTIFICATIONS */

notificationButton?.addEventListener("click", () => {
    showToast("Hozircha yangi bildirishnomalar yo‘q.");
});

/* 9. LOGOUT - JWT SESSION */

function logoutAdmin() {
    const confirmed = window.confirm(
        "Admin paneldan chiqmoqchimisiz?"
    );

    if (!confirmed) return;

    try {
        localStorage.removeItem(AdminConfig.tokenKey);
        localStorage.removeItem(AdminConfig.adminKey);

        // Eski sessiya kaliti qolgan bo‘lsa, uni ham tozalash.
        localStorage.removeItem("englishUpAdminSession");

        sessionStorage.clear();
    } catch (error) {
        console.error("Logout storage error:", error);
    }

    window.location.replace("./login/index.html");
}

logoutButton?.addEventListener("click", logoutAdmin);

/* 10. SYSTEM STATUS */

function updateSystemStatus() {
    const firebaseStatus = getElement("firebaseStatus");
    const authStatus = getElement("authStatus");
    const databaseStatus = getElement("databaseStatus");

    if (firebaseStatus) {
        firebaseStatus.textContent = "Timeweb API";
    }

    if (authStatus) {
        authStatus.textContent = "JWT autentifikatsiya";
    }

    if (databaseStatus) {
        databaseStatus.textContent = "PostgreSQL";
    }
}

/* 11. ADMIN INFORMATION */

function updateAdminInformation() {
    const adminNameElements = document.querySelectorAll(
        "#adminName, #sidebarAdminName"
    );

    try {
        const savedAdmin = localStorage.getItem(
            AdminConfig.adminKey
        );

        if (!savedAdmin) return;

        const admin = JSON.parse(savedAdmin);

        const displayName =
            admin.name ||
            admin.fullName ||
            admin.email ||
            "Administrator";

        adminNameElements.forEach((element) => {
            element.textContent = displayName;
        });
    } catch (error) {
        console.warn("Admin information could not be loaded.");
    }
}

/* 12. DASHBOARD INITIALIZATION */

function initializeDashboard() {
    updateDashboardDate();
    setActiveNavigation();
    updateSystemStatus();
    updateAdminInformation();
}

/* 13. LOADING SCREEN */

function hideLoadingScreen() {
    if (!adminLoading) return;

    adminLoading.style.opacity = "0";
    adminLoading.style.transition = "opacity 0.25s ease";

    window.setTimeout(() => {
        adminLoading.style.display = "none";
    }, 260);
}

/* 14. RESPONSIVE MENU */

window.addEventListener("resize", () => {
    if (window.innerWidth > AdminConfig.mobileBreakpoint) {
        closeSidebar();
    }
});

/* 15. START ADMIN INTERFACE */

function startAdminInterface() {
    initializeDashboard();
    hideLoadingScreen();

    console.log("English Up Admin Interface initialized.");
    console.log("Version:", AdminConfig.version);
    console.log("Mode:", AdminConfig.mode);
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        startAdminInterface,
        { once: true }
    );
} else {
    startAdminInterface();
}

/* END ENGLISH UP ADMIN SCRIPT */
