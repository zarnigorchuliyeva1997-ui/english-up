/* =========================================
   ENGLISH UP ADMIN
   SUBSCRIPTIONS — POSTGRESQL API
========================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const API_URL = "/api/subscriptions";
  const TOKEN_KEY = "englishUpToken";
  const PAGE_LIMIT = 20;

  const elements = {
    total: $("totalSubscriptions"),
    active: $("activeSubscriptions"),
    expiring: $("expiringSubscriptions"),
    expired: $("expiredSubscriptions"),
    search: $("subscriptionSearch"),
    status: $("subscriptionStatusFilter"),
    plan: $("subscriptionPlanFilter"),
    table: $("subscriptionsTableBody"),
    count: $("subscriptionCount"),
    pagination: $("subscriptionPagination"),
    refresh: $("refreshSubscriptions")
  };

  let subscriptions = [];
  let currentPage = 1;
  let totalPages = 1;
  let totalSubscriptions = 0;
  let loading = false;

  const state = {
    search: "",
    status: "all",
    plan: "all"
  };

  const PLAN_LABELS = {
    monthly: "1 oylik",
    quarterly: "3 oylik",
    yearly: "1 yillik",
    "three-months": "3 oylik",
    "six-months": "6 oylik"
  };

  const STATUS_LABELS = {
    active: "Faol",
    expiring: "Tugash arafasida",
    expired: "Muddati tugagan",
    cancelled: "Bekor qilingan",
    pending: "Kutilmoqda",
    inactive: "Faol emas"
  };

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function showMessage(message) {
    if (typeof window.showToast === "function") {
      window.showToast(message);
    } else {
      console.info(message);
    }
  }

  function parseDate(value) {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDate(value) {
    const date = parseDate(value);

    if (!date) return "—";

    return new Intl.DateTimeFormat("uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function getStatus(subscription) {
    if (subscription.status === "cancelled") {
      return "cancelled";
    }

    if (subscription.status === "pending") {
      return "pending";
    }

    const endDate = parseDate(subscription.end_date);

    if (!endDate || endDate <= new Date()) {
      return "expired";
    }

    if (subscription.status === "expired") {
      return "expired";
    }

    const daysLeft = Math.ceil(
      (endDate.getTime() - Date.now()) / 86400000
    );

    if (daysLeft <= 7) {
      return "expiring";
    }

    return "active";
  }

  function getStatusClass(status) {
    const classes = {
      active: "status-active",
      expiring: "status-expiring",
      expired: "status-expired",
      cancelled: "status-inactive",
      pending: "status-expiring"
    };

    return classes[status] || "status-inactive";
  }

  async function apiRequest(path, options = {}) {
    const token = getToken();

    if (!token) {
      throw new Error("Admin sessiyasi topilmadi. Qayta kiring.");
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("englishUpAdmin");

      window.location.href = "../login/index.html";

      throw new Error("Sessiya tugagan yoki ruxsat mavjud emas.");
    }

    if (!response.ok || data.success === false) {
      throw new Error(
        data.message || `Server xatosi: ${response.status}`
      );
    }

    return data;
  }

  function getFilteredSubscriptions() {
    const query = state.search.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const name = String(
        subscription.user_name || ""
      ).toLowerCase();

      const email = String(
        subscription.user_email || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query);

      const status = getStatus(subscription);

      const matchesStatus =
        state.status === "all" ||
        status === state.status;

      const matchesPlan =
        state.plan === "all" ||
        subscription.plan === state.plan;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }

  function updateStatistics() {
    const counts = {
      total: totalSubscriptions,
      active: 0,
      expiring: 0,
      expired: 0
    };

    subscriptions.forEach((subscription) => {
      const status = getStatus(subscription);

      if (status === "active") counts.active++;
      if (status === "expiring") counts.expiring++;
      if (status === "expired") counts.expired++;
    });

    if (elements.total) {
      elements.total.textContent = counts.total;
    }

    if (elements.active) {
      elements.active.textContent = counts.active;
    }

    if (elements.expiring) {
      elements.expiring.textContent = counts.expiring;
    }

    if (elements.expired) {
      elements.expired.textContent = counts.expired;
    }
  }

  function renderEmpty(message, description) {
    if (!elements.table) return;

    elements.table.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="empty-icon">💳</div>
          <strong>${escapeHTML(message)}</strong>
          <p>${escapeHTML(description)}</p>
        </td>
      </tr>
    `;
  }

  function renderTable() {
    if (!elements.table) return;

    const filtered = getFilteredSubscriptions();

    if (elements.count) {
      elements.count.textContent =
        `${filtered.length} ta obuna (ushbu sahifada)`;
    }

    if (!filtered.length) {
      renderEmpty(
        subscriptions.length
          ? "Natija topilmadi"
          : "Hozircha obunalar mavjud emas",
        subscriptions.length
          ? "Qidiruv yoki filtr shartlarini o‘zgartiring."
          : "PostgreSQL bazasida obunalar topilmadi."
      );

      return;
    }

    elements.table.innerHTML = filtered.map((subscription) => {
      const status = getStatus(subscription);

      const plan =
        PLAN_LABELS[subscription.plan] ||
        subscription.plan ||
        "Noma'lum";

      const canCancel = [
        "active",
        "pending"
      ].includes(subscription.status);

      return `
        <tr>
          <td>
            <strong>
              ${escapeHTML(subscription.user_name || "Noma'lum")}
            </strong>
          </td>

          <td>
            ${escapeHTML(subscription.user_email || "—")}
          </td>

          <td>
            ${escapeHTML(plan)}
          </td>

          <td>
            ${escapeHTML(formatDate(subscription.start_date))}
          </td>

          <td>
            ${escapeHTML(formatDate(subscription.end_date))}
          </td>

          <td>
            <span class="subscription-status ${getStatusClass(status)}">
              ${escapeHTML(STATUS_LABELS[status] || "Noma'lum")}
            </span>
          </td>

          <td>
            ${
              canCancel
                ? `
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-cancel-subscription="${Number(subscription.id)}"
                  >
                    Bekor qilish
                  </button>
                `
                : "—"
            }
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderPagination() {
    if (!elements.pagination) return;

    elements.pagination.innerHTML = `
      <button
        type="button"
        data-page="${currentPage - 1}"
        ${currentPage <= 1 ? "disabled" : ""}
      >
        ←
      </button>

      <span>${currentPage} / ${totalPages}</span>

      <button
        type="button"
        data-page="${currentPage + 1}"
        ${currentPage >= totalPages ? "disabled" : ""}
      >
        →
      </button>
    `;
  }

  async function loadSubscriptions() {
    if (loading) return;

    loading = true;

    if (elements.table) {
      renderEmpty("Yuklanmoqda...", "Obunalar serverdan olinmoqda.");
    }

    try {
      const data = await apiRequest(
        `/admin?page=${currentPage}&limit=${PAGE_LIMIT}`
      );

      subscriptions = Array.isArray(data.subscriptions)
        ? data.subscriptions
        : [];

      const pagination = data.pagination || {};

      totalSubscriptions = Number(pagination.total) || 0;
      totalPages = Math.max(
        1,
        Number(pagination.totalPages) || 1
      );

      currentPage = Number(pagination.page) || currentPage;

      updateStatistics();
      renderTable();
      renderPagination();

    } catch (error) {
      console.error("Subscriptions API:", error);

      renderEmpty(
        "Obunalarni yuklab bo‘lmadi",
        error.message
      );

      showMessage(error.message);

    } finally {
      loading = false;
    }
  }

  async function cancelSubscription(subscriptionId) {
    const confirmed = window.confirm(
      "Ushbu obunani bekor qilishni tasdiqlaysizmi?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/admin/${subscriptionId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: "cancelled"
          })
        }
      );

      showMessage("Obuna bekor qilindi.");

      await loadSubscriptions();

    } catch (error) {
      console.error("Subscription update:", error);
      showMessage(error.message);
    }
  }

  function applyFilters() {
    state.search = elements.search?.value || "";
    state.status = elements.status?.value || "all";
    state.plan = elements.plan?.value || "all";

    renderTable();
  }

  function bindEvents() {
    elements.search?.addEventListener("input", applyFilters);

    elements.status?.addEventListener("change", applyFilters);

    elements.plan?.addEventListener("change", applyFilters);

    elements.refresh?.addEventListener("click", () => {
      loadSubscriptions();
    });

    elements.pagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");

      if (!button || button.disabled) return;

      const page = Number(button.dataset.page);

      if (
        !Number.isInteger(page) ||
        page < 1 ||
        page > totalPages
      ) {
        return;
      }

      currentPage = page;
      loadSubscriptions();
    });

    elements.table?.addEventListener("click", (event) => {
      const button = event.target.closest(
        "[data-cancel-subscription]"
      );

      if (!button) return;

      const subscriptionId = Number(
        button.dataset.cancelSubscription
      );

      if (
        Number.isInteger(subscriptionId) &&
        subscriptionId > 0
      ) {
        cancelSubscription(subscriptionId);
      }
    });
  }

  function initialize() {
    bindEvents();
    loadSubscriptions();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

})();
