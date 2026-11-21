
/* ==========================================
   ENGLISH UP ADMIN PANEL
   SHARED MAIN JAVASCRIPT
   Version: 1.1.0
   ========================================== */

"use strict";


/* ==========================================
   1. CONFIGURATION
   ========================================== */

const AdminConfig = {
    appName: "English Up",
    version: "1.1.0",
    currentPage: "dashboard",
    mobileBreakpoint: 760
};


/* ==========================================
   2. SAFE DOM HELPERS
   ========================================== */

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


/* ==========================================
   3. TOAST NOTIFICATIONS
   ========================================== */

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


document.addEventListener("keydown", event => {

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

    let activeFound = false;

    navigationLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        let linkPath;

        try {

            linkPath = new URL(
                href,
                window.location.href
            ).pathname;

        } catch (error) {

            console.warn("Navigation URL error:", href);
            return;

        }

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

    });

    if (!activeFound) {

        AdminConfig.currentPage = "unknown";

    }

}


document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        closeSidebar();

    });

});


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

    const normalizedQuery = String(query)
        .trim()
        .toLocaleLowerCase("uz");

    if (!normalizedQuery) {

        links.forEach(link => {

            link.style.display = "";

        });

        sections.forEach(section => {

            section.style.display = "";

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

        section.style.display = hasVisibleLink
            ? ""
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
        "Bildirishnomalar Firebase integratsiyasidan keyin faollashadi."
    );

});


/* ==========================================
   9. LOGOUT
   ========================================== */

// Firebase Authentication hali ulanmagan.
// Haqiqiy chiqish funksiyasi keyin qo'shiladi.

logoutButton?.addEventListener("click", () => {

    showToast(
        "Chiqish funksiyasi Firebase Authentication ulangach faollashadi."
    );

});


/* ==========================================
   10. SYSTEM STATUS
   ========================================== */

function updateSystemStatus() {

    const firebaseStatus = getElement("firebaseStatus");
    const authStatus = getElement("authStatus");
    const databaseStatus = getElement("databaseStatus");

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

    window.setTimeout(() => {

        adminLoading.style.display = "none";

    }, 260);

}


/* ==========================================
   13. RESPONSIVE MENU
   ========================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > AdminConfig.mobileBreakpoint) {

        closeSidebar();

    }

});


/* ==========================================
   14. START ADMIN INTERFACE
   ========================================== */

function startAdminInterface() {

    initializeDashboard();

    hideLoadingScreen();

    console.log(
        "English Up Admin Interface initialized."
    );

    console.log(
        "Version:",
        AdminConfig.version
    );

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


/* ==========================================
   END ENGLISH UP ADMIN SCRIPT
   ========================================== */
