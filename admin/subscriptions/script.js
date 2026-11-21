
/* =========================================
   ENGLISH UP ADMIN
   SUBSCRIPTIONS PAGE SCRIPT
========================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

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
    refresh: $("refreshSubscriptions")
  };

  // Firebase ulanmaguncha ma'lumotlar bo'sh.
  // Keyinchalik bu massiv Firestore ma'lumotlari bilan to'ldiriladi.
  let subscriptions = [];

  const state = {
    search: "",
    status: "all",
    plan: "all"
  };

  const PLAN_LABELS = {
    monthly: "1 oylik",
    "three-months": "3 oylik",
    "six-months": "6 oylik",
    yearly: "1 yillik"
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

  function parseDate(value) {
    if (!value) return null;

    const date = value instanceof Date
      ? new Date(value.getTime())
      : new Date(value);

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
    if (subscription.active === false) {
      return "inactive";
    }

    const endDate = parseDate(subscription.endDate);

    if (!endDate) {
      return "inactive";
    }

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const endDay = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    if (endDay < today) {
      return "expired";
    }

    const daysLeft = Math.ceil(
      (endDay - today) / 86400000
    );

    if (daysLeft <= 7) {
      return "expiring";
    }

    return "active";
  }

  function getStatusLabel(status) {
    const labels = {
      active: "Faol",
      expiring: "Tugash arafasida",
      expired: "Muddati tugagan",
      inactive: "Faol emas"
    };

    return labels[status] || "Noma'lum";
  }

  function getStatusClass(status) {
    const classes = {
      active: "status-active",
      expiring: "status-expiring",
      expired: "status-expired",
      inactive: "status-inactive"
    };

    return classes[status] || "status-inactive";
  }

  function getFilteredSubscriptions() {
    const query = state.search.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const name = String(subscription.name || "").toLowerCase();
      const email = String(subscription.email || "").toLowerCase();

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
      total: subscriptions.length,
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
        `${filtered.length} ta obuna`;
    }

    if (filtered.length === 0) {
      if (subscriptions.length === 0) {
        renderEmpty(
          "Hozircha obunalar mavjud emas",
          "Firebase ma'lumotlar bazasi ulangandan keyin obunalar shu yerda ko'rinadi."
        );
      } else {
        renderEmpty(
          "Natija topilmadi",
          "Qidiruv yoki filtr shartlarini o'zgartirib ko'ring."
        );
      }

      return;
    }

    elements.table.innerHTML = filtered.map((subscription) => {
      const status = getStatus(subscription);
      const plan = PLAN_LABELS[subscription.plan] || "Noma'lum";

      return `
        <tr>
          <td>
            <strong>${escapeHTML(subscription.name || "Noma'lum")}</strong>
          </td>

          <td>${escapeHTML(subscription.email || "—")}</td>

          <td>${escapeHTML(plan)}</td>

          <td>${escapeHTML(formatDate(subscription.startDate))}</td>

          <td>${escapeHTML(formatDate(subscription.endDate))}</td>

          <td>
            <span class="subscription-status ${getStatusClass(status)}">
              ${escapeHTML(getStatusLabel(status))}
            </span>
          </td>

          <td>
            <span class="subscription-no-action">
              Firebase ulanmagan
            </span>
          </td>
        </tr>
      `;
    }).join("");
  }

  function refreshPage() {
    updateStatistics();
    renderTable();
  }

  function bindEvents() {
    if (elements.search) {
      elements.search.addEventListener("input", (event) => {
        state.search = event.target.value;
        renderTable();
      });
    }

    if (elements.status) {
      elements.status.addEventListener("change", (event) => {
        state.status = event.target.value;
        renderTable();
      });
    }

    if (elements.plan) {
      elements.plan.addEventListener("change", (event) => {
        state.plan = event.target.value;
        renderTable();
      });
    }

    if (elements.refresh) {
      elements.refresh.addEventListener("click", () => {
        refreshPage();

        if (typeof window.showToast === "function") {
          window.showToast("Sahifa yangilandi");
        }
      });
    }
  }

  function initialize() {
    bindEvents();
    refreshPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();

