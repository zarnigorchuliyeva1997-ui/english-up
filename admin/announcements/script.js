
/* ENGLISH UP — ANNOUNCEMENTS MANAGEMENT */

(() => {
  "use strict";

  const STORAGE_KEY = "englishUpAdminAnnouncements";

  const $ = (id) => document.getElementById(id);

  const elements = {
    formPanel: $("announcementFormPanel"),
    form: $("announcementForm"),
    formTitle: $("announcementFormTitle"),
    id: $("announcementId"),
    title: $("announcementTitle"),
    category: $("announcementCategory"),
    audience: $("announcementAudience"),
    content: $("announcementContent"),
    priority: $("announcementPriority"),
    status: $("announcementStatus"),
    start: $("announcementStart"),
    end: $("announcementEnd"),
    table: $("announcementsTableBody"),
    count: $("announcementCount"),
    search: $("announcementSearch"),
    statusFilter: $("announcementStatusFilter"),
    categoryFilter: $("announcementCategoryFilter"),
    total: $("totalAnnouncements"),
    active: $("activeAnnouncements"),
    drafts: $("draftAnnouncements"),
    archived: $("archivedAnnouncements")
  };

  const categoryLabels = {
    general: "Umumiy",
    course: "Kurslar",
    lesson: "Darslar",
    exam: "Imtihonlar",
    maintenance: "Texnik ishlar",
    important: "Muhim xabar"
  };

  const audienceLabels = {
    all: "Barcha o‘quvchilar",
    beginner: "Beginner",
    elementary: "Elementary",
    "pre-intermediate": "Pre-Intermediate",
    intermediate: "Intermediate",
    "upper-intermediate": "Upper-Intermediate",
    ielts: "IELTS",
    subscribers: "Obunachilar"
  };

  const statusLabels = {
    active: "Faol",
    draft: "Qoralama",
    archived: "Arxiv"
  };

  const priorityLabels = {
    normal: "Oddiy",
    important: "Muhim",
    urgent: "Juda muhim"
  };

  let announcements = loadAnnouncements();

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return "announcement-" + Date.now() + "-" +
      Math.random().toString(36).slice(2, 9);
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

  function loadAnnouncements() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) return [];

      return parsed.filter((item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.content === "string"
      );
    } catch (error) {
      console.error("E’lonlarni yuklashda xatolik:", error);
      return [];
    }
  }

  function saveAnnouncements() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(announcements)
      );
      return true;
    } catch (error) {
      console.error("E’lonlarni saqlashda xatolik:", error);
      alert("Ma’lumotlarni saqlab bo‘lmadi. Brauzer xotirasini tekshiring.");
      return false;
    }
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function updateStats() {
    elements.total.textContent = announcements.length;

    elements.active.textContent = announcements.filter(
      (item) => item.status === "active"
    ).length;

    elements.drafts.textContent = announcements.filter(
      (item) => item.status === "draft"
    ).length;

    elements.archived.textContent = announcements.filter(
      (item) => item.status === "archived"
    ).length;
  }

  function getFilteredAnnouncements() {
    const query = elements.search.value.trim().toLowerCase();
    const status = elements.statusFilter.value;
    const category = elements.categoryFilter.value;

    return announcements
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query);

        const matchesStatus =
          status === "all" || item.status === status;

        const matchesCategory =
          category === "all" || item.category === category;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }

  function renderAnnouncements() {
    const filtered = getFilteredAnnouncements();

    if (!filtered.length) {
      elements.table.innerHTML = `
        <tr>
          <td colspan="7" class="announcement-empty">
            Hozircha e’lon topilmadi.
          </td>
        </tr>
      `;
    } else {
      elements.table.innerHTML = filtered.map((item) => {
        const title = escapeHTML(item.title);
        const preview = escapeHTML(item.content.slice(0, 100));
        const category = escapeHTML(
          categoryLabels[item.category] || item.category
        );
        const audience = escapeHTML(
          audienceLabels[item.audience] || item.audience
        );
        const status = escapeHTML(
          statusLabels[item.status] || item.status
        );
        const priority = escapeHTML(
          priorityLabels[item.priority] || item.priority
        );
        const date = escapeHTML(formatDate(item.createdAt));

        return `
          <tr>
            <td>
              <div class="announcement-title">${title}</div>
              <div class="announcement-preview">${preview}${item.content.length > 100 ? "..." : ""}</div>
            </td>
            <td>
              <span class="announcement-category">${category}</span>
            </td>
            <td>${audience}</td>
            <td>
              <span class="announcement-priority ${escapeHTML(item.priority)}">
                ${priority}
              </span>
            </td>
            <td>
              <span class="announcement-status ${escapeHTML(item.status)}">
                ${status}
              </span>
            </td>
            <td>${date}</td>
            <td>
              <div class="announcement-actions">
                <button type="button"
                  class="edit-announcement"
                  data-action="edit"
                  data-id="${escapeHTML(item.id)}">
                  Tahrirlash
                </button>
                <button type="button"
                  class="delete-announcement"
                  data-action="delete"
                  data-id="${escapeHTML(item.id)}">
                  O‘chirish
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    elements.count.textContent =
      `Jami: ${filtered.length} ta e’lon`;

    updateStats();
  }

  function openForm(item = null) {
    elements.form.reset();

    if (item) {
      elements.formTitle.textContent = "E’lonni tahrirlash";
      elements.id.value = item.id;
      elements.title.value = item.title;
      elements.category.value = item.category;
      elements.audience.value = item.audience;
      elements.content.value = item.content;
      elements.priority.value = item.priority;
      elements.status.value = item.status;
      elements.start.value = item.start || "";
      elements.end.value = item.end || "";
    } else {
      elements.formTitle.textContent = "Yangi e’lon";
      elements.id.value = "";
      elements.priority.value = "normal";
      elements.status.value = "draft";
      elements.category.value = "general";
      elements.audience.value = "all";
    }

    elements.formPanel.hidden = false;
    elements.formPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeForm() {
    elements.form.reset();
    elements.id.value = "";
    elements.formPanel.hidden = true;
  }

  function isValidDateRange(start, end) {
    if (!start || !end) return true;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return !Number.isNaN(startDate.getTime()) &&
      !Number.isNaN(endDate.getTime()) &&
      endDate > startDate;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const id = elements.id.value;
    const title = elements.title.value.trim();
    const content = elements.content.value.trim();
    const start = elements.start.value;
    const end = elements.end.value;

    if (!title || !content) {
      alert("Sarlavha va e’lon matnini kiriting.");
      return;
    }

    if (!isValidDateRange(start, end)) {
      alert("Tugash sanasi boshlanish sanasidan keyin bo‘lishi kerak.");
      return;
    }

    const existing = id
      ? announcements.find((item) => item.id === id)
      : null;

    const announcement = {
      id: id || createId(),
      title,
      category: elements.category.value,
      audience: elements.audience.value,
      content,
      priority: elements.priority.value,
      status: elements.status.value,
      start,
      end,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const previous = announcements.slice();

    if (existing) {
      announcements = announcements.map((item) =>
        item.id === id ? announcement : item
      );
    } else {
      announcements.push(announcement);
    }

    if (!saveAnnouncements()) {
      announcements = previous;
      return;
    }

    closeForm();
    renderAnnouncements();

    alert(existing ? "E’lon yangilandi." : "E’lon saqlandi.");
  }

  function handleTableClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    const item = announcements.find((entry) => entry.id === id);
    if (!item) return;

    if (action === "edit") {
      openForm(item);
      return;
    }

    if (action === "delete") {
      const confirmed = confirm(
        `"${item.title}" e’lonini o‘chirmoqchimisiz?`
      );

      if (!confirmed) return;

      const previous = announcements.slice();

      announcements = announcements.filter(
        (entry) => entry.id !== id
      );

      if (!saveAnnouncements()) {
        announcements = previous;
        return;
      }

      renderAnnouncements();
      alert("E’lon o‘chirildi.");
    }
  }

  function bindEvents() {
    $("addAnnouncementBtn").addEventListener("click", () => openForm());

    $("closeAnnouncementForm").addEventListener("click", closeForm);
    $("cancelAnnouncement").addEventListener("click", closeForm);

    elements.form.addEventListener("submit", handleSubmit);
    elements.table.addEventListener("click", handleTableClick);

    elements.search.addEventListener("input", renderAnnouncements);
    elements.statusFilter.addEventListener("change", renderAnnouncements);
    elements.categoryFilter.addEventListener("change", renderAnnouncements);

    $("refreshAnnouncements").addEventListener("click", () => {
      announcements = loadAnnouncements();
      renderAnnouncements();
    });
  }

  function init() {
    bindEvents();
    renderAnnouncements();
    closeForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
