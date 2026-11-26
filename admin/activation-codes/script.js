
/* =========================================
   ENGLISH UP ADMIN
   ACTIVATION CODES — TIMEWEB API
   PostgreSQL MODE
   Version: 3.0.0
========================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const API = "/api/activation-codes";

  const elements = {
    total: $("codesTotal"),
    unused: $("codesUnused"),
    used: $("codesUsed"),
    cancelled: $("codesCancelled"),

    form: $("createCodeForm"),
    email: $("codeEmail"),
    plan: $("codePlan"),
    quantity: $("codeQuantity"),
    note: $("codeNote"),

    refresh: $("refreshCodes"),
    search: $("codeSearch"),
    statusFilter: $("codeStatusFilter"),
    planFilter: $("codePlanFilter"),

    table: $("codesTableBody"),
    count: $("codesCount"),

    generatedCard: $("generatedCard"),
    generatedList: $("generatedCodesList"),
    copyAll: $("copyAllCodes")
  };

  let activationCodes = [];
  let latestGeneratedCodes = [];

  const state = {
    search: "",
    status: "all",
    plan: "all"
  };

  const PLAN_LABELS = {
    "1": "1 oy",
    "2": "2 oy",
    "3": "3 oy",
    "4": "4 oy",
    "5": "5 oy"
  };

  function showNotice(message) {
    if (typeof window.showToast === "function") {
      window.showToast(message);
    } else {
      alert(message);
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function getPlanLabel(plan) {
    return String(plan || "Noma'lum");
  }

  function getStatusLabel(status) {
    return status === "used"
      ? "Ishlatilgan"
      : "Ishlatilmagan";
  }

  function getStatusClass(status) {
    return status === "used"
      ? "code-status-used"
      : "code-status-unused";
  }

  // Admin loginida saqlangan JWT tokenni topish
  function getAuthToken() {
    const knownKeys = [
      "token",
      "authToken",
      "accessToken",
      "jwt",
      "euToken",
      "englishUpToken",
      "englishUpAuth",
      "adminToken"
    ];

    function extractToken(value) {
      if (!value) return null;

      if (
        typeof value === "string" &&
        /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
      ) {
        return value;
      }

      try {
        const parsed = JSON.parse(value);

        if (typeof parsed === "object" && parsed !== null) {
          return (
            extractToken(parsed.token) ||
            extractToken(parsed.accessToken) ||
            extractToken(parsed.authToken) ||
            extractToken(parsed.jwt)
          );
        }
      } catch (_) {}

      return null;
    }

    for (const key of knownKeys) {
      const token = extractToken(localStorage.getItem(key));
      if (token) return token;
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);

      if (!key) continue;

      if (/token|auth|session|login/i.test(key)) {
        const token = extractToken(value);
        if (token) return token;
      }
    }

    return null;
  }

  async function apiRequest(path, options = {}) {
    const token = getAuthToken();

    if (!token) {
      throw new Error(
        "Admin JWT token topilmadi. Avval admin akkauntiga qayta kiring."
      );
    }

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    let data;

    try {
      data = await response.json();
    } catch (_) {
      throw new Error("Serverdan noto'g'ri javob keldi.");
    }

    if (!response.ok || data.success === false) {
      if (response.status === 401) {
        throw new Error("Admin sessiyasi tugagan. Qayta login qiling.");
      }

      if (response.status === 403) {
        throw new Error("Bu amal uchun admin huquqi kerak.");
      }

      throw new Error(
        data.message || "Server so'rovni bajara olmadi."
      );
    }

    return data;
  }

  function renderEmpty(title, description) {
    if (!elements.table) return;

    elements.table.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="empty-icon">🔑</div>
          <strong>${escapeHTML(title)}</strong>
          <p>${escapeHTML(description)}</p>
        </td>
      </tr>
    `;
  }

  function updateStatistics() {
    const total = activationCodes.length;

    const unused = activationCodes.filter(
      item => item.status === "unused"
    ).length;

    const used = activationCodes.filter(
      item => item.status === "used"
    ).length;

    if (elements.total) {
      elements.total.textContent = total;
    }

    if (elements.unused) {
      elements.unused.textContent = unused;
    }

    if (elements.used) {
      elements.used.textContent = used;
    }

    // Schema'da bekor qilingan kodlar uchun alohida status yo'q.
    if (elements.cancelled) {
      elements.cancelled.textContent = "—";
    }
  }

  function renderTable() {
    if (!elements.table) return;

    if (elements.count) {
      elements.count.textContent =
        `${activationCodes.length} ta kod`;
    }

    if (!activationCodes.length) {
      renderEmpty(
        "Hozircha kodlar mavjud emas",
        "Yangi aktivatsiya kodi yaratish uchun yuqoridagi formadan foydalaning."
      );
      return;
    }

    elements.table.innerHTML = activationCodes.map(item => `
      <tr>
        <td>
          <strong title="Kod xavfsizlik uchun bazada xesh ko'rinishida saqlanadi">
            EU-••••-••••-••••
          </strong>
          <small>ID: ${escapeHTML(item.id)}</small>
        </td>

        <td>${escapeHTML(item.email)}</td>

        <td>${escapeHTML(getPlanLabel(item.plan))}</td>

        <td>${escapeHTML(formatDate(item.created_at))}</td>

        <td>${escapeHTML(formatDate(item.used_at))}</td>

        <td>
          <span class="code-status ${getStatusClass(item.status)}">
            ${escapeHTML(getStatusLabel(item.status))}
          </span>
        </td>

        <td>
          ${
            item.status === "unused"
              ? `
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-action="cancel"
                  data-id="${escapeHTML(item.id)}"
                >
                  Bekor qilish
                </button>
              `
              : "—"
          }
        </td>
      </tr>
    `).join("");
  }

  function renderGeneratedCodes() {
    if (!elements.generatedCard || !elements.generatedList) {
      return;
    }

    if (!latestGeneratedCodes.length) {
      elements.generatedCard.hidden = true;
      return;
    }

    elements.generatedCard.hidden = false;

    elements.generatedList.innerHTML =
      latestGeneratedCodes.map(item => `
        <div class="generated-code-item">
          <div>
            <strong>${escapeHTML(item.code)}</strong>
            <small>
              ${escapeHTML(item.email)} —
              ${escapeHTML(item.plan)}
            </small>
          </div>
        </div>
      `).join("");
  }

  function getListQuery() {
    const params = new URLSearchParams();

    params.set("limit", "100");

    if (state.search.trim()) {
      params.set("search", state.search.trim());
    }

    if (state.status !== "all") {
      params.set("status", state.status);
    }

    if (state.plan !== "all") {
      params.set("plan", PLAN_LABELS[state.plan] || state.plan);
    }

    return `?${params.toString()}`;
  }

  async function loadCodes() {
    if (elements.table) {
      renderEmpty("Yuklanmoqda...", "Kodlar bazadan olinmoqda.");
    }

    try {
      const data = await apiRequest(
        `/admin/list${getListQuery()}`
      );

      activationCodes = Array.isArray(data.items)
        ? data.items
        : [];

      updateStatistics();
      renderTable();
    } catch (error) {
      console.error("Load activation codes:", error);

      activationCodes = [];
      updateStatistics();

      renderEmpty(
        "Kodlarni yuklash amalga oshmadi",
        error.message
      );

      showNotice(error.message);
    }
  }

  function validateForm() {
    if (!elements.email || !elements.plan || !elements.quantity) {
      showNotice("Forma elementlari topilmadi.");
      return false;
    }

    const email = elements.email.value.trim().toLowerCase();
    const plan = String(elements.plan.value);
    const quantity = Number(elements.quantity.value);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
      showNotice("To'g'ri Gmail manzilini kiriting.");
      return false;
    }

    if (!email.endsWith("@gmail.com")) {
      showNotice("Faqat Gmail manzilidan foydalaning.");
      return false;
    }

    if (!PLAN_LABELS[plan]) {
      showNotice("Obuna muddatini to'g'ri tanlang.");
      return false;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      showNotice("Kodlar soni 1 dan 100 gacha bo'lishi kerak.");
      return false;
    }

    return true;
  }

  async function handleCreateCodes(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const months = Number(elements.plan.value);
    const quantity = Number(elements.quantity.value);

    const payload = {
      email: elements.email.value.trim().toLowerCase(),
      plan: PLAN_LABELS[String(months)],
      durationDays: months * 30,
      quantity
    };

    const submitButton = elements.form.querySelector(
      'button[type="submit"], button:not([type])'
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const data = await apiRequest("/admin/create", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      latestGeneratedCodes = Array.isArray(data.items)
        ? data.items
        : [];

      renderGeneratedCodes();

      showNotice(data.message || "Kodlar yaratildi.");

      elements.form.reset();

      if (elements.quantity) elements.quantity.value = "1";
      if (elements.plan) elements.plan.value = "1";

      await loadCodes();
    } catch (error) {
      console.error("Create activation codes:", error);
      showNotice(error.message);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  async function cancelCode(id) {
    if (!id) return;

    const confirmed = confirm(
      "Ushbu ishlatilmagan aktivatsiya kodini bekor qilmoqchimisiz?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/admin/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });

      showNotice("Kod bekor qilindi.");
      await loadCodes();
    } catch (error) {
      console.error("Cancel activation code:", error);
      showNotice(error.message);
    }
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();

        const successful = document.execCommand("copy");
        textarea.remove();

        if (!successful) {
          throw new Error("Copy failed");
        }
      }

      showNotice("Kodlar nusxalandi.");
    } catch (error) {
      console.error("Copy error:", error);
      showNotice("Nusxalash amalga oshmadi.");
    }
  }

  async function copyGeneratedCodes() {
    if (!latestGeneratedCodes.length) {
      showNotice("Nusxalash uchun yangi kodlar mavjud emas.");
      return;
    }

    const text = latestGeneratedCodes.map(item =>
      `${item.code} | ${item.email} | ${item.plan}`
    ).join("\n");

    await copyText(text);
  }

  function bindEvents() {
    if (elements.form) {
      elements.form.addEventListener(
        "submit",
        handleCreateCodes
      );
    }

    if (elements.search) {
      elements.search.addEventListener("input", () => {
        state.search = elements.search.value;
        loadCodes();
      });
    }

    if (elements.statusFilter) {
      elements.statusFilter.addEventListener("change", () => {
        state.status = elements.statusFilter.value;
        loadCodes();
      });
    }

    if (elements.planFilter) {
      elements.planFilter.addEventListener("change", () => {
        state.plan = elements.planFilter.value;
        loadCodes();
      });
    }

    if (elements.refresh) {
      elements.refresh.addEventListener("click", loadCodes);
    }

    if (elements.copyAll) {
      elements.copyAll.addEventListener(
        "click",
        copyGeneratedCodes
      );
    }

    if (elements.table) {
      elements.table.addEventListener("click", event => {
        const button = event.target.closest(
          '[data-action="cancel"]'
        );

        if (!button) return;

        cancelCode(button.dataset.id);
      });
    }
  }

  function initialize() {
    bindEvents();
    loadCodes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
