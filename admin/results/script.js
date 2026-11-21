
/* ENGLISH UP — RESULTS MANAGEMENT */

(() => {
  "use strict";

  const STORAGE_KEY = "englishUpAdminResults";

  const $ = (id) => document.getElementById(id);

  const el = {
    total: $("totalResults"),
    students: $("totalStudents"),
    average: $("averageScore"),
    high: $("highScores"),
    search: $("studentSearch"),
    level: $("levelFilter"),
    type: $("resultTypeFilter"),
    table: $("studentsResultsTable"),
    count: $("studentResultsCount"),
    panel: $("studentDetailPanel"),
    info: $("selectedStudentInfo"),
    detailTotal: $("detailTotalTests"),
    detailAverage: $("detailAverage"),
    detailBest: $("detailBest"),
    detailTable: $("studentDetailResults"),
    detailCount: $("detailResultsCount")
  };

  const levelLabels = {
    beginner: "Beginner",
    elementary: "Elementary",
    "pre-intermediate": "Pre-Intermediate",
    intermediate: "Intermediate",
    "upper-intermediate": "Upper-Intermediate",
    ielts: "IELTS"
  };

  const typeLabels = {
    lesson: "Dars testi",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    listening: "Listening",
    reading: "Reading",
    writing: "Writing",
    speaking: "Speaking",
    final: "Yakuniy imtihon"
  };

  let results = loadResults();
  let selectedStudentId = null;

  function loadResults() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];

      const data = JSON.parse(saved);
      if (!Array.isArray(data)) return [];

      return data.filter((item) =>
        item &&
        typeof item === "object" &&
        typeof item.studentId === "string" &&
        typeof item.score === "number" &&
        typeof item.maxScore === "number" &&
        item.maxScore > 0 &&
        item.score >= 0 &&
        item.score <= item.maxScore
      );
    } catch (error) {
      console.error("Natijalarni yuklashda xatolik:", error);
      return [];
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

  function getPercentage(result) {
    return Math.round((result.score / result.maxScore) * 100);
  }

  function getScoreClass(percent) {
    if (percent >= 80) return "good";
    if (percent >= 60) return "medium";
    return "low";
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

  /*
   * Hozircha natijalar localStorage'dan o'qiladi.
   * Firebase ulanganda bu qism serverdan olinadigan
   * haqiqiy o'quvchi natijalari bilan almashtiriladi.
   */

  function getStudents() {
    const map = new Map();

    results.forEach((result) => {
      if (!map.has(result.studentId)) {
        map.set(result.studentId, {
          id: result.studentId,
          name: result.studentName || "Noma’lum o‘quvchi",
          email: result.studentEmail || "",
          uid: result.studentId,
          level: result.level || "beginner",
          results: []
        });
      }

      const student = map.get(result.studentId);

      student.results.push(result);

      if (result.studentName) student.name = result.studentName;
      if (result.studentEmail) student.email = result.studentEmail;
      if (result.level) student.level = result.level;
    });

    return Array.from(map.values()).map((student) => {
      const percentages = student.results.map(getPercentage);

      const average = percentages.length
        ? Math.round(
            percentages.reduce((sum, value) => sum + value, 0) /
            percentages.length
          )
        : 0;

      const dates = student.results
        .map((item) => new Date(item.date || 0).getTime())
        .filter((value) => Number.isFinite(value));

      return {
        ...student,
        average,
        best: percentages.length ? Math.max(...percentages) : 0,
        lastActivity: dates.length
          ? new Date(Math.max(...dates)).toISOString()
          : ""
      };
    });
  }

  function updateStats() {
    const students = getStudents();

    const percentages = results.map(getPercentage);

    const average = percentages.length
      ? Math.round(
          percentages.reduce((sum, value) => sum + value, 0) /
          percentages.length
        )
      : 0;

    el.total.textContent = results.length;
    el.students.textContent = students.length;
    el.average.textContent = average + "%";
    el.high.textContent = percentages.filter(
      (value) => value >= 80
    ).length;
  }

  function getFilteredStudents() {
    const query = el.search.value.trim().toLowerCase();
    const level = el.level.value;
    const type = el.type.value;

    return getStudents()
      .filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.uid.toLowerCase().includes(query);

        const matchesLevel =
          level === "all" || student.level === level;

        const matchesType =
          type === "all" ||
          student.results.some((item) => item.type === type);

        return matchesSearch && matchesLevel && matchesType;
      })
      .sort((a, b) =>
        new Date(b.lastActivity || 0) -
        new Date(a.lastActivity || 0)
      );
  }

  function renderStudents() {
    const students = getFilteredStudents();

    if (!students.length) {
      el.table.innerHTML = `
        <tr>
          <td colspan="7" class="results-empty">
            Hozircha natijalar mavjud emas.
          </td>
        </tr>
      `;
    } else {
      el.table.innerHTML = students.map((student) => `
        <tr>
          <td>
            <div class="student-name">
              ${escapeHTML(student.name)}
            </div>
            <div class="student-email">
              ${escapeHTML(student.email)}
            </div>
          </td>
          <td>
            <span class="student-uid">
              ${escapeHTML(student.uid)}
            </span>
          </td>
          <td>
            <span class="result-level">
              ${escapeHTML(levelLabels[student.level] || student.level)}
            </span>
          </td>
          <td>${student.results.length}</td>
          <td>
            <span class="result-score ${getScoreClass(student.average)}">
              ${student.average}%
            </span>
          </td>
          <td>${escapeHTML(formatDate(student.lastActivity))}</td>
          <td>
            <button
              type="button"
              class="view-results-btn"
              data-student-id="${escapeHTML(student.id)}">
              Natijalarni ko‘rish
            </button>
          </td>
        </tr>
      `).join("");
    }

    el.count.textContent =
      `Jami: ${students.length} ta o‘quvchi`;

    updateStats();
  }

  function renderStudentDetails(studentId) {
    const student = getStudents().find(
      (item) => item.id === studentId
    );

    if (!student) {
      closeDetails();
      return;
    }

    const filteredResults = student.results
      .filter((item) =>
        el.type.value === "all" || item.type === el.type.value
      )
      .sort((a, b) =>
        new Date(b.date || 0) - new Date(a.date || 0)
      );

    const percentages = student.results.map(getPercentage);

    el.info.textContent =
      `${student.name} | ${student.email || student.uid}`;

    el.detailTotal.textContent = student.results.length;
    el.detailAverage.textContent = student.average + "%";
    el.detailBest.textContent = student.best + "%";

    if (!filteredResults.length) {
      el.detailTable.innerHTML = `
        <tr>
          <td colspan="6" class="results-empty">
            Bu turdagi natijalar topilmadi.
          </td>
        </tr>
      `;
    } else {
      el.detailTable.innerHTML = filteredResults.map((item) => {
        const percentage = getPercentage(item);

        return `
          <tr>
            <td>${escapeHTML(item.title || "Nomsiz test")}</td>
            <td>
              <span class="result-type">
                ${escapeHTML(typeLabels[item.type] || item.type || "—")}
              </span>
            </td>
            <td>
              ${escapeHTML(levelLabels[item.level] || item.level || "—")}
            </td>
            <td>${item.score} / ${item.maxScore}</td>
            <td>
              <span class="result-score ${getScoreClass(percentage)}">
                ${percentage}%
              </span>
            </td>
            <td>${escapeHTML(formatDate(item.date))}</td>
          </tr>
        `;
      }).join("");
    }

    el.detailCount.textContent =
      `Ko‘rsatilgan: ${filteredResults.length} ta natija`;

    el.panel.hidden = false;
    el.panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeDetails() {
    selectedStudentId = null;
    el.panel.hidden = true;
  }

  function bindEvents() {
    el.search.addEventListener("input", renderStudents);
    el.level.addEventListener("change", renderStudents);

    el.type.addEventListener("change", () => {
      renderStudents();

      if (selectedStudentId) {
        renderStudentDetails(selectedStudentId);
      }
    });

    el.table.addEventListener("click", (event) => {
      const button = event.target.closest("[data-student-id]");
      if (!button) return;

      selectedStudentId = button.dataset.studentId;
      renderStudentDetails(selectedStudentId);
    });

    $("closeStudentDetails").addEventListener("click", closeDetails);

    $("refreshResults").addEventListener("click", () => {
      results = loadResults();
      renderStudents();

      if (selectedStudentId) {
        renderStudentDetails(selectedStudentId);
      }
    });
  }

  function init() {
    bindEvents();
    renderStudents();
    closeDetails();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
