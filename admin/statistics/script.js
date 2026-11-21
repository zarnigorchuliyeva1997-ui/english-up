
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const readData = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);

  const getStudents = () => readData("englishUpAdminStudents");
  const getSubscriptions = () => readData("englishUpAdminSubscriptions");
  const getResults = () => readData("englishUpAdminResults");

  const getLevel = (student) =>
    String(student.level || student.courseLevel || "Noma'lum").toLowerCase();

  const getScore = (result) => {
    const direct = Number(result.percentage ?? result.scorePercent);
    if (Number.isFinite(direct) && direct >= 0 && direct <= 100) {
      return direct;
    }

    const correct = Number(result.correctAnswers ?? result.correct);
    const total = Number(result.totalQuestions ?? result.total);

    if (Number.isFinite(correct) && Number.isFinite(total) && total > 0) {
      return Math.max(0, Math.min(100, (correct / total) * 100));
    }

    const score = Number(result.score);
    if (Number.isFinite(score) && score >= 0 && score <= 100) {
      return score;
    }

    return null;
  };

  const getStudentName = (result, students) => {
    const student = students.find((item) =>
      String(item.uid || item.id || item.studentId) ===
      String(result.studentId || result.uid || "")
    );

    return result.studentName ||
      result.name ||
      student?.name ||
      student?.fullName ||
      "Noma'lum o‘quvchi";
  };

  const getDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("uz-UZ");
  };

  function renderSummary(students, subscriptions, results) {
    const scores = results.map(getScore).filter((score) => score !== null);
    const average = scores.length
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

    const activeSubscriptions = subscriptions.filter((item) => {
      const status = String(item.status || "").toLowerCase();
      return status === "active" || status === "faol";
    }).length;

    $("totalStudents").textContent = students.length;
    $("activeSubscriptions").textContent = activeSubscriptions;
    $("totalResults").textContent = results.length;
    $("averageScore").textContent = `${Math.round(average)}%`;
  }

  function renderLevels(students) {
    const container = $("levelStats");
    const levels = [
      ["beginner", "Beginner"],
      ["elementary", "Elementary"],
      ["pre-intermediate", "Pre-Intermediate"],
      ["intermediate", "Intermediate"],
      ["upper-intermediate", "Upper-Intermediate"],
      ["ielts", "IELTS"]
    ];

    if (!students.length) {
      container.innerHTML = '<p class="empty-state">Hozircha o‘quvchilar yo‘q.</p>';
      return;
    }

    const counts = levels.map(([key, label]) => ({
      label,
      count: students.filter((student) => {
        const level = getLevel(student).replace(/_/g, "-");
        return level === key;
      }).length
    }));

    const unknown = students.filter((student) => {
      const level = getLevel(student).replace(/_/g, "-");
      return !levels.some(([key]) => key === level);
    }).length;

    if (unknown) counts.push({ label: "Boshqa / belgilanmagan", count: unknown });

    container.innerHTML = counts.map((item) => {
      const percent = students.length
        ? (item.count / students.length) * 100
        : 0;

      return `
        <div class="level-stat-item">
          <div class="level-stat-top">
            <span>${escapeHTML(item.label)}</span>
            <strong>${item.count}</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${percent}%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderResultStats(results) {
    const container = $("resultStats");

    if (!results.length) {
      container.innerHTML =
        '<p class="empty-state">Hozircha natijalar mavjud emas.</p>';
      return;
    }

    const categories = {};

    results.forEach((result) => {
      const type = result.type || result.testType || result.category || "Boshqa";
      categories[type] = (categories[type] || 0) + 1;
    });

    container.innerHTML = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => `
        <div class="result-stat-item">
          <span>${escapeHTML(type)}</span>
          <strong>${count}</strong>
        </div>
      `).join("");
  }

  function renderRecentResults(results, students) {
    const container = $("recentResults");

    if (!results.length) {
      container.innerHTML =
        '<tr><td colspan="5" class="empty-state">Hozircha natijalar yo‘q.</td></tr>';
      return;
    }

    const recent = [...results]
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);

    container.innerHTML = recent.map((result) => {
      const score = getScore(result);
      const name = getStudentName(result, students);
      const type = result.type || result.testType || result.category || "Test";
      const level = result.level || result.courseLevel || "—";
      const date = getDate(result.date || result.createdAt);

      return `
        <tr>
          <td>${escapeHTML(name)}</td>
          <td>${escapeHTML(type)}</td>
          <td>${escapeHTML(level)}</td>
          <td>${score === null ? "—" : `${Math.round(score)}%`}</td>
          <td>${escapeHTML(date)}</td>
        </tr>
      `;
    }).join("");
  }

  function refreshStatistics() {
    const students = getStudents();
    const subscriptions = getSubscriptions();
    const results = getResults();

    renderSummary(students, subscriptions, results);
    renderLevels(students);
    renderResultStats(results);
    renderRecentResults(results, students);
  }

  $("refreshStats")?.addEventListener("click", refreshStatistics);

  window.addEventListener("storage", refreshStatistics);

  refreshStatistics();
})();
