
/* ==========================================
   ENGLISH UP ADMIN PANEL
   SHARED MAIN JAVASCRIPT
   Version: 3.1.1
   Timeweb + JWT + PostgreSQL
   ========================================== */

"use strict";

/* 1. CONFIGURATION */

const ADMIN_SCRIPT_URL =
    document.currentScript?.src ||
    new URL("/admin/script.js", window.location.origin).href;

const AdminConfig = {
    appName: "English Up",
    version: "3.1.1",
    currentPage: "dashboard",
    mobileBreakpoint: 760,
    mode: "timeweb",

    apiBaseUrl:
        window.ENGLISH_UP_API_BASE_URL ||
        `${window.location.origin}/api`,

    tokenKey: "englishUpToken",
    adminKey: "englishUpAdmin",

    endpoints: {
        me: "/admin/me",
        dashboard: "/admin/dashboard",
        students: "/admin/students"
    }
};

/* 2. SAFE DOM HELPERS */

const getElement = (id) =>
    document.getElementById(id);

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

/* 4. AUTHENTICATION HELPERS */

function getAdminToken() {
    try {
        return localStorage.getItem(AdminConfig.tokenKey);
    } catch (error) {
        console.error("Token storage error:", error);
        return null;
    }
}

function clearAdminSession() {
    try {
        localStorage.removeItem(AdminConfig.tokenKey);
        localStorage.removeItem(AdminConfig.adminKey);
        localStorage.removeItem("englishUpAdminSession");

        sessionStorage.clear();
    } catch (error) {
        console.error("Session cleanup error:", error);
    }
}

function getAdminLoginUrl() {
    return new URL(
        "login/index.html",
        ADMIN_SCRIPT_URL
    ).href;
}

function redirectToAdminLogin() {
    window.location.replace(getAdminLoginUrl());
}

/* 5. CENTRAL API REQUEST SYSTEM */

async function adminApiRequest(endpoint, options = {}) {
    const token = getAdminToken();

    if (!token) {
        clearAdminSession();
        redirectToAdminLogin();

        throw new Error("Admin authentication required.");
    }

    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers
    };

    const requestOptions = {
        ...options,
        headers,
        credentials: "same-origin"
    };

    if (
        options.body &&
        typeof options.body !== "string"
    ) {
        headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify(options.body);
    }

    let response;

    try {
        response = await fetch(
            `${AdminConfig.apiBaseUrl}${endpoint}`,
            requestOptions
        );
    } catch (error) {
        console.error("API connection error:", error);

        throw new Error(
            "Server bilan aloqa o‘rnatilmadi."
        );
    }

    let data;

    try {
        data = await response.json();
    } catch (error) {
        throw new Error(
            "Server noto‘g‘ri javob qaytardi."
        );
    }

    if (
        response.status === 401 ||
        response.status === 403
    ) {
        clearAdminSession();
        redirectToAdminLogin();

        throw new Error(
            "Admin sessiyasi yaroqsiz yoki faol emas."
        );
    }

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message ||
            `API error: ${response.status}`
        );
    }

    return data;
}

/* 6. PUBLIC ADMIN API */

window.AdminAPI = {
    request: adminApiRequest,

    get(endpoint) {
        return adminApiRequest(endpoint, {
            method: "GET"
        });
    },

    post(endpoint, body = {}) {
        return adminApiRequest(endpoint, {
            method: "POST",
            body
        });
    },

    put(endpoint, body = {}) {
        return adminApiRequest(endpoint, {
            method: "PUT",
            body
        });
    },

    delete(endpoint) {
        return adminApiRequest(endpoint, {
            method: "DELETE"
        });
    },

    getAdmin() {
        return this.get(AdminConfig.endpoints.me);
    },

    getDashboard() {
        return this.get(
            AdminConfig.endpoints.dashboard
        );
    },

    getStudents(page = 1, limit = 20) {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit)
        });

        return this.get(
            `${AdminConfig.endpoints.students}?${params}`
        );
    }
};

/* 7. MOBILE SIDEBAR */

function openSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("open");
    sidebarOverlay?.classList.add("show");

    menuToggle?.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.style.overflow = "hidden";
}

function closeSidebar() {
    if (!sidebar) return;

    sidebar.classList.remove("open");
    sidebarOverlay?.classList.remove("show");

    menuToggle?.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.style.overflow = "";
}

menuToggle?.addEventListener("click", () => {
    if (sidebar?.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarClose?.addEventListener(
    "click",
    closeSidebar
);

sidebarOverlay?.addEventListener(
    "click",
    closeSidebar
);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebar();

        if (globalSearch) {
            globalSearch.value = "";
            searchNavigation("");
        }
    }
});

/* 8. NAVIGATION */

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

            link.classList.toggle(
                "active",
                isActive
            );

            if (isActive) {
                activeFound = true;

                AdminConfig.currentPage =
                    link.dataset.page || "dashboard";

                link.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                link.removeAttribute("aria-current");
            }
        } catch (error) {
            console.warn(
                "Navigation URL error:",
                href
            );
        }
    });

    if (!activeFound) {
        const isDashboard =
            /\/admin\/?$/.test(currentPath) ||
            /\/admin\/index\.html$/.test(currentPath);

        AdminConfig.currentPage =
            isDashboard ? "dashboard" : "unknown";
    }
}

document.querySelectorAll(".nav-link").forEach(
    (link) => {
        link.addEventListener(
            "click",
            closeSidebar
        );
    }
);

/* 9. DASHBOARD DATE */

function updateDashboardDate() {
    if (!dashboardDate) return;

    dashboardDate.textContent =
        new Date().toLocaleDateString(
            "uz-UZ",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
}

/* 10. GLOBAL SEARCH */

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

        link.style.display =
            text.includes(normalizedQuery)
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

        section.style.display =
            hasVisibleLink ? "" : "none";
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

/* 11. NOTIFICATIONS */

notificationButton?.addEventListener("click", () => {
    showToast(
        "Hozircha yangi bildirishnomalar yo‘q."
    );
});

/* 12. LOGOUT */

function logoutAdmin() {
    const confirmed = window.confirm(
        "Admin paneldan chiqmoqchimisiz?"
    );

    if (!confirmed) return;

    clearAdminSession();
    redirectToAdminLogin();
}

logoutButton?.addEventListener(
    "click",
    logoutAdmin
);

/* 13. SYSTEM STATUS */

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

/* 14. ADMIN INFORMATION */

function updateAdminInformation(admin) {
    if (!admin || typeof admin !== "object") {
        return;
    }

    const adminNameElements =
        document.querySelectorAll(
            "#adminName, #sidebarAdminName"
        );

    const displayName =
        admin.name ||
        admin.fullName ||
        admin.email ||
        "Administrator";

    adminNameElements.forEach((element) => {
        element.textContent = displayName;
    });

    try {
        localStorage.setItem(
            AdminConfig.adminKey,
            JSON.stringify(admin)
        );
    } catch (error) {
        console.warn(
            "Admin information storage error:",
            error
        );
    }
}

/* 15. LOAD ADMIN PROFILE FROM API */

async function loadAdminProfile() {
    const data = await window.AdminAPI.getAdmin();

    if (
        !data.success ||
        !data.user ||
        data.user.role !== "admin" ||
        data.user.is_active !== true
    ) {
        clearAdminSession();
        redirectToAdminLogin();

        throw new Error(
            "Admin profili tasdiqlanmadi."
        );
    }

    updateAdminInformation(data.user);

    window.dispatchEvent(
        new CustomEvent("admin:profile-loaded", {
            detail: data.user
        })
    );

    return data.user;
}

/* 16. DASHBOARD STATISTICS */

function renderDashboardStatistics(statistics) {
    if (
        !statistics ||
        typeof statistics !== "object"
    ) {
        return;
    }

    // HTML ID va PostgreSQL ustunlari mosligi
    const statElements = {
        totalStudents: "total_students",
        activeSubscriptions: "active_subscriptions",
        unusedCodes: "unused_codes",
        totalCourses: "total_courses"
    };

    Object.entries(statElements).forEach(
        ([elementId, statisticKey]) => {
            const element = getElement(elementId);

            if (!element) return;

            const value = statistics[statisticKey];

            element.textContent =
                value === null || value === undefined
                    ? "0"
                    : String(value);
        }
    );

    // Qo'shimcha data-stat elementlarini ham qo'llab-quvvatlash
    document.querySelectorAll("[data-stat]").forEach(
        (element) => {
            const key = element.dataset.stat;

            if (
                key &&
                Object.prototype.hasOwnProperty.call(
                    statistics,
                    key
                )
            ) {
                const value = statistics[key];

                if (
                    value === null ||
                    typeof value === "string" ||
                    typeof value === "number"
                ) {
                    element.textContent =
                        String(value ?? 0);
                }
            }
        }
    );

    window.dispatchEvent(
        new CustomEvent("admin:dashboard-loaded", {
            detail: statistics
        })
    );
}

async function loadDashboardStatistics() {
    const data = await window.AdminAPI.getDashboard();

    if (!data.success) {
        throw new Error(
            "Dashboard ma'lumotlarini yuklab bo‘lmadi."
        );
    }

    renderDashboardStatistics(data.statistics);

    return data.statistics;
}

/* 17. DASHBOARD INITIALIZATION */

function initializeDashboard() {
    updateDashboardDate();
    setActiveNavigation();
    updateSystemStatus();

    try {
        const savedAdmin = localStorage.getItem(
            AdminConfig.adminKey
        );

        if (savedAdmin) {
            updateAdminInformation(
                JSON.parse(savedAdmin)
            );
        }
    } catch (error) {
        console.warn(
            "Saved admin information error:",
            error
        );
    }
}

/* 18. LOADING SCREEN */

function hideLoadingScreen() {
    if (!adminLoading) return;

    adminLoading.style.opacity = "0";
    adminLoading.style.transition =
        "opacity 0.25s ease";

    window.setTimeout(() => {
        adminLoading.style.display = "none";
    }, 260);
}

/* 19. RESPONSIVE MENU */

window.addEventListener("resize", () => {
    if (
        window.innerWidth >
        AdminConfig.mobileBreakpoint
    ) {
        closeSidebar();
    }
});

/* 20. START ADMIN INTERFACE */

async function startAdminInterface() {
    initializeDashboard();

    if (!getAdminToken()) {
        clearAdminSession();
        redirectToAdminLogin();
        return;
    }

    try {
        await loadAdminProfile();

        if (
            AdminConfig.currentPage === "dashboard"
        ) {
            await loadDashboardStatistics();
        }

        console.log(
            "English Up Admin API connected."
        );

    } catch (error) {
        console.error(
            "Admin initialization error:",
            error
        );

        showToast(
            error.message ||
            "Admin panelni yuklashda xatolik."
        );

    } finally {
        hideLoadingScreen();
    }
}

/* 21. DOM READY */

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
