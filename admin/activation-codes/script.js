
(() => {
  "use strict";

  const API = "/api/activation-codes";

  const $ = (id) => document.getElementById(id);

  const state = {
    codes: [],
    generatedCodes: [],
    search: "",
    status: "",
    plan: ""
  };

  const PLAN_LABELS = {
    "1": "1 oy",
    "2": "2 oy",
    "3": "3 oy",
    "4": "4 oy",
    "5": "5 oy"
  };

  function getToken() {
    return localStorage.getItem("englishUpToken") || "";
  }

  async function apiRequest(path, options = {}) {
    const token = getToken();

    if (!token) {
      throw new Error("Admin sessiyasi topilmadi. Qayta tizimga kiring.");
    }

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    let data = {};

    try {
      data = await response.json();
    } catch (_) {
      data = {};
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error("Ruxsat yo‘q yoki sessiya muddati tugagan.");
    }

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Server bilan ishlashda xatolik.");
    }

    return data;
  }

  function notify(message, type = "info") {
    if (typeof window.showToast === "function") {
      window.showToast(message, type);
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
      "'": "&#39;"
    })[char]);
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("uz-UZ");
  }

  function statusLabel(status) {
    const labels = {
      unused: "Ishlatilmagan",
      used: "Ishlatilgan",
      cancelled: "Bekor qilingan",
      revoked: "Bekor qilingan"
    };

    return labels[status] || status || "—";
  }

  function statusClass(status) {
    if (status === "used") return "used";
    if (status === "cancelled" || status === "revoked") return "cancelled";
    return "unused";
  }

  function updateStatistics(stats = {}) {
    const total = $("codesTotal");
    const unused = $("codesUnused");
    const used = $("codesUsed");
    const cancelled = $("codesCancelled");

    if (total) total.textContent = stats.total ?? 0;
    if (unused) unused.textContent = stats.unused ?? 0;
    if (used) used.textContent = stats.used ?? 0;
    if (cancelled) cancelled.textContent = stats.cancelled ?? 0;
  }

  function renderCodes() {
    const body = $("codesTableBody");
    const count = $("codesCount");

    if (!body) return;

    const rows = state.codes;

    if (count) count.textContent = `${rows.length} ta kod`;

    if (!rows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:24px">
            Aktivatsiya kodlari topilmadi.
          </td>
        </tr>
      `;
      return;
    }

    body.innerHTML = rows.map((item) => {
      const cancelled = item.status === "cancelled" ||
        item.status === "revoked";

      const codeText = item.code
        ? escapeHTML(item.code)
        : "EU-••••-••••-••••";

      return `
        <tr>
          <td>${escapeHTML(item.id)}</td>
          <td><code>${codeText}</code></td>
          <td>${escapeHTML(item.email || "—")}</td>
          <td>${escapeHTML(item.plan || "—")}</td>
          <td>${formatDate(item.created_at || item.createdAt)}</td>
          <td>${formatDate(item.used_at || item.usedAt)}</td>
          <td>
            <span class="status-badge ${statusClass(item.status)}">
              ${escapeHTML(statusLabel(item.status))}
            </span>
            ${
              item.note
                ? `<div class="small">${escapeHTML(item.note)}</div>`
                : ""
            }
          </td>
          <td>
            ${
              !cancelled && item.status !== "used"
                ? `<button type="button"
                    class="btn btn-danger btn-sm"
                    data-revoke-id="${escapeHTML(item.id)}">
                    Bekor qilish
                  </button>`
                : "—"
            }
          </td>
        </tr>
      `;
    }).join("");
  }

  async function loadCodes() {
    const params = new URLSearchParams({
      limit: "100",
      search: state.search,
      status: state.status,
      plan: state.plan
    });

    const data = await apiRequest(`/admin/list?${params.toString()}`);

    state.codes = Array.isArray(data.items) ? data.items : [];

    updateStatistics(data.stats || {});
    renderCodes();
  }

  async function createCodes(event) {
    event.preventDefault();

    const email = $("codeEmail")?.value.trim();
    const planValue = $("codePlan")?.value;
    const quantity = Number($("codeQuantity")?.value || 1);
    const note = $("codeNote")?.value.trim() || "";

    if (!email) {
      notify("Foydalanuvchi emailini kiriting.", "error");
      return;
    }

    if (!PLAN_LABELS[planValue]) {
      notify("Obuna muddatini tanlang.", "error");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      notify("Kodlar soni 1 dan 100 gacha bo‘lishi kerak.", "error");
      return;
    }

    const durationDays = Number(planValue) * 30;
    const button = event.submitter;

    if (button) button.disabled = true;

    try {
      const data = await apiRequest("/admin/create", {
        method: "POST",
        body: JSON.stringify({
          email,
          plan: PLAN_LABELS[planValue],
          durationDays,
          quantity,
          note
        })
      });

      state.generatedCodes = Array.isArray(data.items)
        ? data.items
        : [];

      showGeneratedCodes(state.generatedCodes);

      notify(data.message || "Aktivatsiya kodlari yaratildi.", "success");

      $("createCodeForm")?.reset();

      await loadCodes();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      if (button) button.disabled = false;
    }
  }

  function showGeneratedCodes(items) {
    const card = $("generatedCard");
    const list = $("generatedCodesList");

    if (!card || !list) return;

    list.innerHTML = items.map((item) => `
      <div class="generated-code">
        <code>${escapeHTML(item.code)}</code>
        <button type="button"
          class="btn btn-sm"
          data-copy-code="${escapeHTML(item.code)}">
          Nusxalash
        </button>
      </div>
    `).join("");

    card.hidden = items.length === 0;
    card.style.display = items.length ? "block" : "none";
  }

  async function revokeCode(id) {
    if (!confirm("Ushbu aktivatsiya kodini bekor qilmoqchimisiz?")) {
      return;
    }

    try {
      const data = await apiRequest(`/admin/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });

      notify(data.message || "Kod bekor qilindi.", "success");
      await loadCodes();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  function bindEvents() {
    $("createCodeForm")?.addEventListener("submit", createCodes);

    $("refreshCodes")?.addEventListener("click", () => {
      loadCodes().catch((error) => notify(error.message, "error"));
    });

    $("codeSearch")?.addEventListener("input", (event) => {
      state.search = event.target.value.trim();
      loadCodes().catch((error) => notify(error.message, "error"));
    });

    $("codeStatusFilter")?.addEventListener("change", (event) => {
      state.status = event.target.value;
      loadCodes().catch((error) => notify(error.message, "error"));
    });

    $("codePlanFilter")?.addEventListener("change", (event) => {
      state.plan = event.target.value
        ? PLAN_LABELS[event.target.value] || event.target.value
        : "";

      loadCodes().catch((error) => notify(error.message, "error"));
    });

    $("codesTableBody")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-revoke-id]");
      if (button) revokeCode(button.dataset.revokeId);
    });

    $("generatedCodesList")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-copy-code]");
      if (!button) return;

      navigator.clipboard.writeText(button.dataset.copyCode)
        .then(() => notify("Kod nusxalandi.", "success"))
        .catch(() => notify("Nusxalash amalga oshmadi.", "error"));
    });

    $("copyAllCodes")?.addEventListener("click", () => {
      const codes = state.generatedCodes
        .map((item) => item.code)
        .filter(Boolean)
        .join("\n");

      if (!codes) {
        notify("Nusxalash uchun kodlar yo‘q.", "error");
        return;
      }

      navigator.clipboard.writeText(codes)
        .then(() => notify("Barcha kodlar nusxalandi.", "success"))
        .catch(() => notify("Nusxalash amalga oshmadi.", "error"));
    });
  }

  async function init() {
    bindEvents();

    try {
      await loadCodes();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
