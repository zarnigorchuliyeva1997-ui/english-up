
/* =====================================================
   ENGLISH UP ADMIN
   STUDENTS MANAGEMENT
   File: admin/students/script.js
   ===================================================== */

"use strict";

(() => {
  /* -----------------------------------------------
     1. DOM ELEMENTS
  ----------------------------------------------- */

  const elements = {
    search: document.getElementById("studentSearch"),
    filter: document.getElementById("studentFilter"),
    table: document.getElementById("studentsTableBody"),

    total: document.getElementById("studentsTotal"),
    active: document.getElementById("studentsActive"),
    expired: document.getElementById("studentsExpired"),

    refresh: document.getElementById("refreshStudents")
  };

  /* -----------------------------------------------
     2. STATE
  ----------------------------------------------- */

  let students = [];
  let isLoading = false;

  /* -----------------------------------------------
     3. HELPERS
  ----------------------------------------------- */

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });
  }

  function normalize(value) {
    return String(value ?? "")
      .trim()
      .toLocaleLowerCase();
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function getSubscriptionStatus(student) {
    if (!student.subscription) return "none";

    const endDate = new Date(student.subscription.endDate);

    if (
      !student.subscription.endDate ||
      Number.isNaN(endDate.getTime())
    ) {
      return "none";
    }

    return endDate.getTime() >= Date.now()
      ? "active"
      : "expired";
  }

  function getStatusLabel(status) {
    const labels = {
      active: "Faol",
      expired: "Muddati tugagan",
      none: "Obuna yo‘q"
    };

    return labels[status] || "Noma’lum";
  }

  function getStatusClass(status) {
    const classes = {
      active: "status-active",
      expired: "status-expired",
      none: "status-none"
    };

    return classes[status] || "status-none";
  }

  /* -----------------------------------------------
     4. STATISTICS
  ----------------------------------------------- */

  function updateStatistics() {
    const total = students.length;

    const active = students.filter(student =>
      getSubscriptionStatus(student) === "active"
    ).length;

    const expired = students.filter(student =>
      getSubscriptionStatus(student) === "expired"
    ).length;

    if (elements.total) {
      elements.total.textContent = total;
    }

    if (elements.active) {
      elements.active.textContent = active;
    }

    if (elements.expired) {
      elements.expired.textContent = expired;
    }
  }

  /* -----------------------------------------------
     5. TABLE RENDERING
  ----------------------------------------------- */

  function renderStudents(list) {
    if (!elements.table) return;

    if (isLoading) {
      elements.table.innerHTML = `
        <tr>
          <td colspan="6" class="students-empty">
            Ma’lumotlar yuklanmoqda...
          </td>
        </tr>
      `;
      return;
    }

    if (!list.length) {
      elements.table.innerHTML = `
        <tr>
          <td colspan="6" class="students-empty">
            Hozircha o‘quvchilar ma’lumoti mavjud emas.
          </td>
        </tr>
      `;
      return;
    }

    elements.table.innerHTML = list.map(student => {
      const status = getSubscriptionStatus(student);

      const name = escapeHTML(
        student.name || "Ism kiritilmagan"
      );

      const email = escapeHTML(
        student.email || "Gmail mavjud emas"
      );

      const registered = formatDate(student.createdAt);

      const endDate = student.subscription?.endDate
        ? formatDate(student.subscription.endDate)
        : "—";

      return `
        <tr>
          <td>
            <div class="student-name">${name}</div>
          </td>

          <td>
            <div class="student-email">${email}</div>
          </td>

          <td>${escapeHTML(registered)}</td>

          <td>
            <span class="student-status ${getStatusClass(status)}">
              ${getStatusLabel(status)}
            </span>
          </td>

          <td>${escapeHTML(endDate)}</td>

          <td>
            <span class="students-note">
              Firebase ulanmagan
            </span>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* -----------------------------------------------
     6. SEARCH AND FILTER
  ----------------------------------------------- */

  function filterStudents() {
    const searchValue = normalize(
      elements.search?.value
    );

    const selectedStatus = elements.filter?.value || "all";

    const filtered = students.filter(student => {
      const name = normalize(student.name);
      const email = normalize(student.email);

      const matchesSearch =
        name.includes(searchValue) ||
        email.includes(searchValue);

      const status = getSubscriptionStatus(student);

      const matchesStatus =
        selectedStatus === "all" ||
        selectedStatus === status;

      return matchesSearch && matchesStatus;
    });

    renderStudents(filtered);
  }

  /* -----------------------------------------------
     7. LOAD STUDENTS
  ----------------------------------------------- */

  async function loadStudents() {
    if (isLoading) return;

    isLoading = true;
    renderStudents([]);

    try {
      /*
        FIREBASE CONNECTION WILL BE ADDED HERE.

        Real student data must be loaded from Firestore
        after Firebase Authentication and security rules
        have been configured.

        Never use local demo data as real student records.
      */

      students = [];

      updateStatistics();
      renderStudents(students);

    } catch (error) {
      console.error(
        "Students loading error:",
        error
      );

      if (elements.table) {
        elements.table.innerHTML = `
          <tr>
            <td colspan="6" class="students-empty">
              Ma’lumotlarni yuklashda xatolik yuz berdi.
            </td>
          </tr>
        `;
      }

    } finally {
      isLoading = false;
    }
  }

  /* -----------------------------------------------
     8. EVENT LISTENERS
  ----------------------------------------------- */

  function initializeEvents() {
    if (elements.search) {
      elements.search.addEventListener(
        "input",
        filterStudents
      );
    }

    if (elements.filter) {
      elements.filter.addEventListener(
        "change",
        filterStudents
      );
    }

    if (elements.refresh) {
      elements.refresh.addEventListener(
        "click",
        loadStudents
      );
    }
  }

  /* -----------------------------------------------
     9. INITIALIZATION
  ----------------------------------------------- */

  function initializeStudentsPage() {
    initializeEvents();
    loadStudents();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeStudentsPage,
      { once: true }
    );
  } else {
    initializeStudentsPage();
  }

})();

