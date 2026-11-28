(() => {
  "use strict";

  const API = {
    lessons: "/api/lessons",
    courses: "/api/courses/admin/all"
  };

  const TOKEN_KEY = "englishUpToken";

  const $ = id => document.getElementById(id);

  const elements = {
    total: $("totalLessons"),
    published: $("publishedLessons"),
    drafts: $("draftLessons"),
    courses: $("lessonCourses"),
    table: $("lessonsTableBody"),
    count: $("lessonCount"),
    search: $("lessonSearch"),
    courseFilter: $("lessonCourseFilter"),
    statusFilter: $("lessonStatusFilter"),
    add: $("addLessonBtn"),
    refresh: $("refreshLessons"),
    panel: $("lessonFormPanel"),
    form: $("lessonForm"),
    formTitle: $("lessonFormTitle"),
    close: $("closeLessonForm"),
    cancel: $("cancelLessonForm"),
    toast: $("toastMessage")
  };

  let lessons = [];
  let courses = [];
  let toastTimer = null;
  let loading = false;

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 3000);
  }

  async function apiRequest(url, options = {}) {
    const token = getToken();

    if (!token) {
      redirectToLogin();
      throw new Error("Admin session not found.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    if (response.status === 401 || response.status === 403) {
      redirectToLogin();
      throw new Error("Session expired or access denied.");
    }

    let data = {};

    try {
      data = await response.json();
    } catch {
      throw new Error("Server returned an invalid response.");
    }

    if (!response.ok || data.success === false) {
      throw new Error(
        data.message || `Request failed (${response.status})`
      );
    }

    return data;
  }

  function redirectToLogin() {
    localStorage.removeItem("englishUpToken");
    localStorage.removeItem("englishUpAdmin");

    window.location.href = "../login/index.html";
  }

  function getCourseName(courseId) {
    const course = courses.find(
      item => Number(item.id) === Number(courseId)
    );

    return course
      ? `${course.title} (${course.level})`
      : "Unknown course";
  }

  function getCourseLevel(courseId) {
    const course = courses.find(
      item => Number(item.id) === Number(courseId)
    );

    return course ? course.level : "";
  }

  function updateStats() {
    elements.total.textContent = lessons.length;

    elements.published.textContent = lessons.filter(
      lesson => lesson.is_active === true
    ).length;

    elements.drafts.textContent = lessons.filter(
      lesson => lesson.is_active !== true
    ).length;

    elements.courses.textContent = new Set(
      lessons.map(lesson => lesson.course_id)
    ).size;
  }

  function getFilteredLessons() {
    const search = elements.search.value.trim().toLowerCase();
    const course = elements.courseFilter.value;
    const status = elements.statusFilter.value;

    return lessons.filter(lesson => {
      const title = String(lesson.title || "").toLowerCase();
      const description = String(lesson.description || "").toLowerCase();
      const courseName = getCourseName(lesson.course_id).toLowerCase();

      const matchesSearch =
        title.includes(search) ||
        description.includes(search) ||
        courseName.includes(search);

      const matchesCourse =
        course === "all" ||
        String(lesson.course_id) === course;

      const isPublished = lesson.is_active === true;

      const matchesStatus =
        status === "all" ||
        (status === "published" && isPublished) ||
        (status === "draft" && !isPublished);

      return matchesSearch && matchesCourse && matchesStatus;
    }).sort((a, b) => {
      const courseCompare =
        Number(a.course_id) - Number(b.course_id);

      if (courseCompare !== 0) return courseCompare;

      return Number(a.lesson_order) - Number(b.lesson_order);
    });
  }

  function renderLessons() {
    const filtered = getFilteredLessons();

    elements.count.textContent = `${filtered.length} lessons`;

    if (!filtered.length) {
      elements.table.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            No lessons available.
          </td>
        </tr>
      `;
      return;
    }

    elements.table.innerHTML = filtered.map(lesson => {
      const published = lesson.is_active === true;

      return `
        <tr>
          <td>
            <strong>${escapeHTML(lesson.title)}</strong>
            <br>
            <small>${escapeHTML(lesson.description || "")}</small>
          </td>

          <td>${escapeHTML(getCourseName(lesson.course_id))}</td>

          <td>${Number(lesson.lesson_order) || 0}</td>

          <td>—</td>

          <td>
            <span class="lesson-status ${published ? "published" : "draft"}">
              ${published ? "Published" : "Draft"}
            </span>
          </td>

          <td>
            <button
              type="button"
              class="lesson-action edit-lesson"
              data-id="${escapeHTML(lesson.id)}"
            >Edit</button>

            <button
              type="button"
              class="lesson-action delete-lesson"
              data-id="${escapeHTML(lesson.id)}"
            >Delete</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function updatePage() {
    updateStats();
    renderLessons();
  }

  function populateCourseSelects() {
    const formSelect = elements.form.querySelector("#lessonCourse");
    const filterSelect = elements.courseFilter;

    const currentFormValue = formSelect.value;
    const currentFilterValue = filterSelect.value;

    formSelect.innerHTML = `
      <option value="">Select course</option>
      ${courses.map(course => `
        <option value="${escapeHTML(course.id)}">
          ${escapeHTML(course.title)} (${escapeHTML(course.level)})
        </option>
      `).join("")}
    `;

    filterSelect.innerHTML = `
      <option value="all">All courses</option>
      ${courses.map(course => `
        <option value="${escapeHTML(course.id)}">
          ${escapeHTML(course.title)}
        </option>
      `).join("")}
    `;

    if (
      courses.some(course =>
        String(course.id) === currentFormValue
      )
    ) {
      formSelect.value = currentFormValue;
    }

    if (
      courses.some(course =>
        String(course.id) === currentFilterValue
      )
    ) {
      filterSelect.value = currentFilterValue;
    }
  }

  async function loadCourses() {
    const data = await apiRequest(API.courses);

    courses = Array.isArray(data.courses)
      ? data.courses
      : [];

    populateCourseSelects();
  }

  async function loadLessons() {
    if (loading) return;

    loading = true;
    elements.refresh.disabled = true;

    try {
      const data = await apiRequest(
        `${API.lessons}/admin/all`
      );

      lessons = Array.isArray(data.lessons)
        ? data.lessons
        : [];

      updatePage();
    } catch (error) {
      showToast(error.message || "Could not load lessons.");
    } finally {
      loading = false;
      elements.refresh.disabled = false;
    }
  }

  async function refreshPage() {
    try {
      await loadCourses();
      await loadLessons();
      showToast("Lessons refreshed.");
    } catch (error) {
      showToast(error.message || "Refresh failed.");
    }
  }

  function openForm(lesson = null) {
    elements.form.reset();

    $("lessonId").value = "";
    $("lessonCourse").disabled = false;

    if (lesson) {
      elements.formTitle.textContent = "Edit Lesson";

      $("lessonId").value = lesson.id;
      $("lessonTitle").value = lesson.title || "";
      $("lessonCourse").value = String(lesson.course_id);
      $("lessonOrder").value = lesson.lesson_order || 1;
      $("lessonStatus").value =
        lesson.is_active === true ? "published" : "draft";
      $("lessonDescription").value = lesson.description || "";
      $("lessonContent").value = lesson.content || "";

      // Backend PATCH endpoint currently does not change course_id.
      $("lessonCourse").disabled = true;
    } else {
      elements.formTitle.textContent = "Add New Lesson";
      $("lessonOrder").value = 1;
      $("lessonStatus").value = "draft";
    }

    elements.panel.hidden = false;

    elements.panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeForm() {
    elements.panel.hidden = true;
    elements.form.reset();
    $("lessonId").value = "";
    $("lessonCourse").disabled = false;
  }

  async function saveLesson(event) {
    event.preventDefault();

    const id = $("lessonId").value.trim();
    const title = $("lessonTitle").value.trim();
    const courseId = Number($("lessonCourse").value);
    const order = Number($("lessonOrder").value);
    const status = $("lessonStatus").value;
    const description = $("lessonDescription").value.trim();
    const content = $("lessonContent").value.trim();

    if (!title || !courseId) {
      showToast("Enter lesson title and select a course.");
      return;
    }

    if (!Number.isInteger(order) || order < 1 || order > 500) {
      showToast("Lesson number must be between 1 and 500.");
      return;
    }

    const isActive = status === "published";

    const payload = {
      title,
      lessonOrder: order,
      description,
      content,
      isActive
    };

    try {
      if (id) {
        await apiRequest(`${API.lessons}/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });

        showToast("Lesson updated successfully.");
      } else {
        payload.courseId = courseId;

        await apiRequest(API.lessons, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        showToast("Lesson created successfully.");
      }

      closeForm();
      await loadLessons();
    } catch (error) {
      showToast(error.message || "Could not save lesson.");
    }
  }

  async function handleTableAction(event) {
    const button = event.target.closest("button[data-id]");

    if (!button) return;

    const id = button.dataset.id;

    const lesson = lessons.find(
      item => String(item.id) === String(id)
    );

    if (!lesson) return;

    if (button.classList.contains("edit-lesson")) {
      openForm(lesson);
      return;
    }

    if (button.classList.contains("delete-lesson")) {
      const confirmed = window.confirm(
        `Delete "${lesson.title}"?`
      );

      if (!confirmed) return;

      try {
        await apiRequest(
          `${API.lessons}/${encodeURIComponent(id)}`,
          { method: "DELETE" }
        );

        showToast("Lesson deleted successfully.");
        await loadLessons();
      } catch (error) {
        showToast(error.message || "Could not delete lesson.");
      }
    }
  }

  function initialize() {
    elements.add.addEventListener("click", () => openForm());

    elements.close.addEventListener("click", closeForm);
    elements.cancel.addEventListener("click", closeForm);

    elements.form.addEventListener("submit", saveLesson);
    elements.table.addEventListener("click", handleTableAction);

    elements.search.addEventListener("input", renderLessons);
    elements.courseFilter.addEventListener("change", renderLessons);
    elements.statusFilter.addEventListener("change", renderLessons);

    elements.refresh.addEventListener("click", refreshPage);

    if (!getToken()) {
      redirectToLogin();
      return;
    }

    refreshPage();
  }

  initialize();
})();
