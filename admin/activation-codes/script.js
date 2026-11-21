
/* =========================================
   ENGLISH UP ADMIN
   ACTIVATION CODES — PAGE SCRIPT
========================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const elements = {
    total: $("codesTotal"),
    unused: $("codesUnused"),
    used: $("codesUsed"),
    cancelled: $("codesCancelled"),

    form: $("createCodeForm"),
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

  /*
    Firebase ulanmaguncha kodlar ro'yxati bo'sh.
    Keyinchalik Firestore'dan olinadi.
  */

  let activationCodes = [];

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

  function formatDate(value) {
    if (!value) return "—";

    const date = value instanceof Date
      ? value
      : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

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

  function getFilteredCodes() {
    const query = state.search.trim().toLowerCase();

    return activationCodes.filter(code => {
      const codeValue = String(code.code || "").toLowerCase();
      const email = String(code.usedByEmail || "").toLowerCase();

      const matchesSearch =
        !query ||
        codeValue.includes(query) ||
        email.includes(query);

      const matchesStatus =
        state.status === "all" ||
        code.status === state.status;

      const matchesPlan =
        state.plan === "all" ||
        code.plan === state.plan;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }

  function renderEmpty(title, description) {
    if (!elements.table) return;

    elements.table.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-icon">🔑</div>
          <strong>${escapeHTML(title)}</strong>
          <p>${escapeHTML(description)}</p>
        </td>
      </tr>
    `;
  }

  function renderTable() {
    if (!elements.table) return;

    const filtered = getFilteredCodes();

    if (elements.count) {
      elements.count.textContent = `${filtered.length} ta kod`;
    }

    if (filtered.length === 0) {
      if (activationCodes.length === 0) {
        renderEmpty(
          "Hozircha kodlar mavjud emas",
          "Firebase xavfsiz integratsiyasi ulangandan keyin kodlar shu yerda ko'rinadi."
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
          <strong>${escapeHTML(code.code || "—")}</strong>
        </td>

        <td>${escapeHTML(PLAN_LABELS[code.plan] || "Noma'lum")}</td>

        <td>${escapeHTML(formatDate(code.createdAt))}</td>

        <td>${escapeHTML(code.usedByEmail || "—")}</td>

        <td>
          <span class="code-status ${getStatusClass(code.status)}">
            ${escapeHTML(getStatusLabel(code.status))}
          </span>
        </td>

        <td>
          <span class="code-no-action">
            Firebase ulanmagan
          </span>
        </td>
      </tr>
    `).join("");
  }

  function showNotice(message) {
    if (typeof window.showToast === "function") {
      window.showToast(message);
      return;
    }

    alert(message);
  }

  function validateForm() {
    if (!elements.plan || !elements.quantity) {
      return false;
    }

    const quantity = Number(elements.quantity.value);

    if (!PLAN_LABELS[elements.plan.value]) {
      showNotice("Obuna tarifini to'g'ri tanlang.");
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

  function handleCreateCodes(event) {
    event.preventDefault();

    if (!validateForm()) return;

    /*
      Haqiqiy kod yaratish server tomonida bajarilishi kerak.
      Hozircha Firebase backend ulanmagan.
    */

    showNotice(
      "Aktivatsiya kodlarini yaratish uchun Firebase xavfsiz server funksiyasi hali ulanmagan."
    );
  }

  async function copyGeneratedCodes() {
    if (!activationCodes.length) {
      showNotice("Nusxalash uchun kodlar mavjud emas.");
      return;
    }

    const codes = activationCodes
      .map(code => code.code)
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(codes);
      showNotice("Kodlar nusxalandi.");
    } catch (error) {
      showNotice("Nusxalash amalga oshmadi.");
    }
  }

  function refreshPage() {
    updateStatistics();
    renderTable();
  }

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
      elements.refresh.addEventListener("click", refreshPage);
    }

    if (elements.copyAll) {
      elements.copyAll.addEventListener(
        "click",
        copyGeneratedCodes
      );
    }
  }

  function initialize() {
    bindEvents();
    refreshPage();
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
