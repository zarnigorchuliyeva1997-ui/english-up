
/* =========================================
   ENGLISH UP ADMIN
   ACTIVATION CODES — PAGE SCRIPT
   GitHub Independent Mode
   Version: 2.0.0
========================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const STORAGE_KEY = "englishUpActivationCodes";

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
    generate: $("generateCodes"),

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

  /* -----------------------------------------
     HTML XAVFSIZLIGI
  ----------------------------------------- */

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  /* -----------------------------------------
     XABAR CHIQARISH
  ----------------------------------------- */

  function showNotice(message) {
    if (typeof window.showToast === "function") {
      window.showToast(message);
    } else {
      alert(message);
    }
  }

  /* -----------------------------------------
     SANANI FORMATLASH
  ----------------------------------------- */

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  /* -----------------------------------------
     TARIF NOMI
  ----------------------------------------- */

  function getPlanLabel(plan) {
    return PLAN_LABELS[String(plan)] || "Noma'lum";
  }

  /* -----------------------------------------
     STATUS NOMI
  ----------------------------------------- */

  function getStatusLabel(status) {
    const labels = {
      unused: "Ishlatilmagan",
      used: "Ishlatilgan",
      cancelled: "Bekor qilingan"
    };

    return labels[status] || "Noma'lum";
  }

  function getStatusClass(status) {
    const classes = {
      unused: "code-status-unused",
      used: "code-status-used",
      cancelled: "code-status-cancelled"
    };

    return classes[status] || "";
  }

  /* -----------------------------------------
     LOCAL STORAGE
  ----------------------------------------- */

  function saveCodes() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(activationCodes)
      );

      return true;
    } catch (error) {
      console.error("Storage error:", error);
      showNotice("Ma'lumotlarni saqlash amalga oshmadi.");
      return false;
    }
  }

  function loadCodes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        activationCodes = [];
        return;
      }

      const parsed = JSON.parse(saved);

      activationCodes = Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {
      console.error("Loading error:", error);
      activationCodes = [];
      showNotice("Saqlangan kodlarni o'qishda xatolik yuz berdi.");
    }
  }

  /* -----------------------------------------
     KOD YARATISH
  ----------------------------------------- */

  function generateRandomCode() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const randomValues = new Uint32Array(12);

    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(randomValues);
    } else {
      throw new Error("Secure random generator unavailable.");
    }

    let result = "";

    for (let i = 0; i < randomValues.length; i++) {
      result += characters[
        randomValues[i] % characters.length
      ];
    }

    return "EU-" +
      result.slice(0, 4) + "-" +
      result.slice(4, 8) + "-" +
      result.slice(8, 12);
  }

  function createUniqueCode() {
    let code;
    let attempts = 0;

    do {
      code = generateRandomCode();
      attempts++;

      if (attempts > 20) {
        throw new Error("Unique code generation failed.");
      }

    } while (
      activationCodes.some(item => item.code === code)
    );

    return code;
  }

  /* -----------------------------------------
     STATISTIKA
  ----------------------------------------- */

  function updateStatistics() {
    const total = activationCodes.length;

    const unused = activationCodes.filter(
      code => code.status === "unused"
    ).length;

    const used = activationCodes.filter(
      code => code.status === "used"
    ).length;

    const cancelled = activationCodes.filter(
      code => code.status === "cancelled"
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

    if (elements.cancelled) {
      elements.cancelled.textContent = cancelled;
    }
  }

  /* -----------------------------------------
     QIDIRUV VA FILTRLASH
  ----------------------------------------- */

  function getFilteredCodes() {
    const query = state.search.trim().toLowerCase();

    return activationCodes.filter(code => {
      const codeValue = String(code.code || "").toLowerCase();

      const email = String(
        code.email || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        codeValue.includes(query) ||
        email.includes(query);

      const matchesStatus =
        state.status === "all" ||
        code.status === state.status;

      const matchesPlan =
        state.plan === "all" ||
        String(code.plan) === state.plan;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan
      );
    });
  }

  /* -----------------------------------------
     BO'SH JADVAL
  ----------------------------------------- */

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

  /* -----------------------------------------
     KODLAR JADVALI
  ----------------------------------------- */

  function renderTable() {
    if (!elements.table) return;

    const filtered = getFilteredCodes();

    if (elements.count) {
      elements.count.textContent =
        `${filtered.length} ta kod`;
    }

    if (filtered.length === 0) {
      if (activationCodes.length === 0) {
        renderEmpty(
          "Hozircha kodlar mavjud emas",
          "Yangi aktivatsiya kodi yaratish uchun yuqoridagi formadan foydalaning."
        );
      } else {
        renderEmpty(
          "Natija topilmadi",
          "Qidiruv yoki filtr shartlarini o'zgartirib ko'ring."
        );
      }

      return;
    }

    elements.table.innerHTML = filtered.map(code => `
      <tr>
        <td>
          <strong>${escapeHTML(code.code)}</strong>
        </td>

        <td>
          ${escapeHTML(code.email)}
        </td>

        <td>
          ${escapeHTML(getPlanLabel(code.plan))}
        </td>

        <td>
          ${escapeHTML(formatDate(code.createdAt))}
        </td>

        <td>
          ${escapeHTML(formatDate(code.usedAt))}
        </td>

        <td>
          <span class="code-status ${getStatusClass(code.status)}">
            ${escapeHTML(getStatusLabel(code.status))}
          </span>
        </td>

        <td>
          ${
            code.status === "unused"
              ? `
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-action="cancel"
                  data-code="${escapeHTML(code.code)}"
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

  /* -----------------------------------------
     YANGI YARATILGAN KODLAR
  ----------------------------------------- */

  function renderGeneratedCodes() {
    if (!elements.generatedCard || !elements.generatedList) {
      return;
    }

    if (latestGeneratedCodes.length === 0) {
      elements.generatedCard.hidden = true;
      return;
    }

    elements.generatedCard.hidden = false;

    elements.generatedList.innerHTML =
      latestGeneratedCodes.map(code => `
        <div class="generated-code-item">
          <div>
            <strong>${escapeHTML(code.code)}</strong>
            <small>
              ${escapeHTML(code.email)} —
              ${escapeHTML(getPlanLabel(code.plan))}
            </small>
          </div>
        </div>
      `).join("");
  }

  /* -----------------------------------------
     FORM TEKSHIRISH
  ----------------------------------------- */

  function validateForm() {
    if (
      !elements.email ||
      !elements.plan ||
      !elements.quantity
    ) {
      showNotice("Forma elementlari topilmadi.");
      return false;
    }

    const email = elements.email.value.trim().toLowerCase();

    const quantity = Number(elements.quantity.value);

    const plan = String(elements.plan.value);

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  /* -----------------------------------------
     YANGI KODLAR YARATISH
  ----------------------------------------- */

  function handleCreateCodes(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const email = elements.email.value
      .trim()
      .toLowerCase();

    const plan = String(elements.plan.value);

    const quantity = Number(elements.quantity.value);

    const note = elements.note
      ? elements.note.value.trim()
      : "";

    const newCodes = [];

    try {
      for (let i = 0; i < quantity; i++) {
        const code = {
          id: `${Date.now()}-${i}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,

          code: createUniqueCode(),

          email: email,

          plan: plan,

          note: note,

          status: "unused",

          createdAt: new Date().toISOString(),

          usedAt: null,

          usedByEmail: null,

          activatedAt: null,

          expiresAt: null
        };

        newCodes.push(code);
        activationCodes.unshift(code);
      }

    } catch (error) {
      activationCodes = activationCodes.filter(
        item => !newCodes.includes(item)
      );

      console.error("Code generation error:", error);

      showNotice("Kod yaratishda xatolik yuz berdi.");
      return;
    }

    if (!saveCodes()) {
      activationCodes = activationCodes.filter(
        item => !newCodes.includes(item)
      );
      return;
    }

    latestGeneratedCodes = newCodes;

    renderGeneratedCodes();
    updateStatistics();
    renderTable();

    showNotice(
      `${newCodes.length} ta kod muvaffaqiyatli yaratildi.`
    );

    elements.form.reset();

    if (elements.quantity) {
      elements.quantity.value = "1";
    }

    if (elements.plan) {
      elements.plan.value = "1";
    }
  }

  /* -----------------------------------------
     KODNI BEKOR QILISH
  ----------------------------------------- */

  function cancelCode(codeValue) {
    const code = activationCodes.find(
      item => item.code === codeValue
    );

    if (!code || code.status !== "unused") {
      showNotice("Bu kodni bekor qilib bo'lmaydi.");
      return;
    }

    const confirmed = confirm(
      `${code.code} kodini bekor qilmoqchimisiz?`
    );

    if (!confirmed) return;

    code.status = "cancelled";
    code.cancelledAt = new Date().toISOString();

    if (!saveCodes()) {
      code.status = "unused";
      delete code.cancelledAt;
      return;
    }

    updateStatistics();
    renderTable();

    showNotice("Kod bekor qilindi.");
  }

  /* -----------------------------------------
     KODLARNI NUSXALASH
  ----------------------------------------- */

  async function copyText(text) {
    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
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
    if (latestGeneratedCodes.length === 0) {
      showNotice("Nusxalash uchun yangi kodlar mavjud emas.");
      return;
    }

    const text = latestGeneratedCodes
      .map(code => (
        `${code.code} | ${code.email} | ${getPlanLabel(code.plan)}`
      ))
      .join("\n");

    await copyText(text);
  }

  /* -----------------------------------------
     YANGILASH
  ----------------------------------------- */

  function refreshPage() {
    loadCodes();
    updateStatistics();
    renderTable();
  }

  /* -----------------------------------------
     EVENTLAR
  ----------------------------------------- */

  function bindEvents() {
    if (elements.form) {
      elements.form.addEventListener(
        "submit",
        handleCreateCodes
      );
    }

    if (elements.search) {
      elements.search.addEventListener("input", event => {
        state.search = event.target.value;
        renderTable();
      });
    }

    if (elements.statusFilter) {
      elements.statusFilter.addEventListener("change", event => {
        state.status = event.target.value;
        renderTable();
      });
    }

    if (elements.planFilter) {
      elements.planFilter.addEventListener("change", event => {
        state.plan = event.target.value;
        renderTable();
      });
    }

    if (elements.refresh) {
      elements.refresh.addEventListener(
        "click",
        refreshPage
      );
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

        cancelCode(button.dataset.code);
      });
    }
  }

  /* -----------------------------------------
     ISHGA TUSHIRISH
  ----------------------------------------- */

  function initialize() {
    loadCodes();
    bindEvents();
    updateStatistics();
    renderTable();
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
