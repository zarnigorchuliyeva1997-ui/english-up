
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const elements = {
    totalCourses: $("totalCourses"),
    publishedCourses: $("publishedCourses"),
    draftCourses: $("draftCourses"),
    totalLessons: $("totalLessons"),
    tableBody: $("coursesTableBody"),
    courseCount: $("courseCount"),
    search: $("courseSearch"),
    statusFilter: $("courseStatusFilter"),
    levelFilter: $("courseLevelFilter"),
    addButton: $("addCourseBtn"),
    refreshButton: $("refreshCourses"),
    formPanel: $("courseFormPanel"),
    form: $("courseForm"),
    formTitle: $("courseFormTitle"),
    closeForm: $("closeCourseForm"),
    cancelForm: $("cancelCourseForm"),
    toast: $("toastMessage")
  };

  const courses = [];
  let toastTimer;

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function showToast(message) {
    if (!elements.toast) return;

    elements.toast.textContent = message;
    elements.toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 3000);
  }

  function getDate() {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }

  function updateStats() {
    const published = courses.filter(
      course => course.status === "published"
    ).length;

    const drafts = courses.filter(
      course => course.status === "draft"
    ).length;

    const lessons = courses.reduce(
      (sum, course) => sum + course.lessonCount,
      0
    );

    elements.totalCourses.textContent = courses.length;
    elements.publishedCourses.textContent = published;
    elements.draftCourses.textContent = drafts;
    elements.totalLessons.textContent = lessons;
  }

  function getFilteredCourses() {
    const search = elements.search.value.trim().toLowerCase();
    const status = elements.statusFilter.value;
    const level = elements.levelFilter.value;

    return courses.filter(course => {
      const matchesSearch =
        course.name.toLowerCase().includes(search) ||
        course.level.toLowerCase().includes(search) ||
        course.subtitle.toLowerCase().includes(search);

      const matchesStatus =
        status === "all" || course.status === status;

      const matchesLevel =
        level === "all" || course.level === level;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }

  function renderCourses() {
    const filtered = getFilteredCourses();

    elements.courseCount.textContent =
      `${filtered.length} courses`;

    if (filtered.length === 0) {
      elements.tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            No courses available yet.
          </td>
        </tr>
      `;
      return;
    }

    elements.tableBody.innerHTML = filtered.map(course => `
      <tr>
        <td>
          <strong>${escapeHTML(course.name)}</strong>
          <br>
          <small>${escapeHTML(course.subtitle || "No subtitle")}</small>
        </td>
        <td>${escapeHTML(course.level)}</td>
        <td>${course.lessonCount}</td>
        <td>
          <span class="course-status ${course.status}">
            ${course.status === "published" ? "Published" : "Draft"}
          </span>
        </td>
        <td>${escapeHTML(course.createdAt)}</td>
        <td>
          <button
            type="button"
            class="course-action edit-course"
            data-id="${escapeHTML(course.id)}"
          >Edit</button>
          <button
            type="button"
            class="course-action delete-course"
            data-id="${escapeHTML(course.id)}"
          >Delete</button>
        </td>
      </tr>
    `).join("");
  }

  function updatePage() {
    updateStats();
    renderCourses();
  }

  function openForm(course = null) {
    elements.form.reset();
    $("courseId").value = "";

    if (course) {
      elements.formTitle.textContent = "Edit Course";
      $("courseId").value = course.id;
      $("courseName").value = course.name;
      $("courseLevel").value = course.level;
      $("courseSubtitle").value = course.subtitle;
      $("courseLessonCount").value = course.lessonCount;
      $("courseDescription").value = course.description;
      $("courseStatus").value = course.status;
    } else {
      elements.formTitle.textContent = "Add New Course";
      $("courseLessonCount").value = 0;
      $("courseStatus").value = "draft";
    }

    elements.formPanel.hidden = false;
    elements.formPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeForm() {
    elements.formPanel.hidden = true;
    elements.form.reset();
    $("courseId").value = "";
  }

  function saveCourse(event) {
    event.preventDefault();

    const id = $("courseId").value;
    const name = $("courseName").value.trim();
    const level = $("courseLevel").value;
    const subtitle = $("courseSubtitle").value.trim();
    const lessonCount = Number($("courseLessonCount").value);
    const description = $("courseDescription").value.trim();
    const status = $("courseStatus").value;

    if (!name || !level) {
      showToast("Please enter the course name and level.");
      return;
    }

    if (
      !Number.isInteger(lessonCount) ||
      lessonCount < 0 ||
      lessonCount > 500
    ) {
      showToast("Lesson count must be between 0 and 500.");
      return;
    }

    if (id) {
      const course = courses.find(item => item.id === id);

      if (!course) {
        showToast("Course not found.");
        return;
      }

      Object.assign(course, {
        name,
        level,
        subtitle,
        lessonCount,
        description,
        status
      });

      showToast("Course updated in this session.");
    } else {
      courses.push({
        id: `course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        level,
        subtitle,
        lessonCount,
        description,
        status,
        createdAt: getDate()
      });

      showToast("Course added in this session.");
    }

    closeForm();
    updatePage();

    showToast(
      "Changes are temporary. Firebase is not connected yet."
    );
  }

  function handleTableAction(event) {
    const button = event.target.closest("button[data-id]");
    if (!button) return;

    const course = courses.find(
      item => item.id === button.dataset.id
    );

    if (!course) return;

    if (button.classList.contains("edit-course")) {
      openForm(course);
      return;
    }

    if (button.classList.contains("delete-course")) {
      const confirmed = window.confirm(
        `Delete "${course.name}" from this temporary list?`
      );

      if (!confirmed) return;

      const index = courses.findIndex(
        item => item.id === course.id
      );

      courses.splice(index, 1);
      updatePage();

      showToast("Course removed from this session only.");
    }
  }

  function initialize() {
    elements.addButton.addEventListener("click", () => openForm());
    elements.closeForm.addEventListener("click", closeForm);
    elements.cancelForm.addEventListener("click", closeForm);
    elements.form.addEventListener("submit", saveCourse);

    elements.search.addEventListener("input", renderCourses);
    elements.statusFilter.addEventListener("change", renderCourses);
    elements.levelFilter.addEventListener("change", renderCourses);

    elements.tableBody.addEventListener("click", handleTableAction);

    elements.refreshButton.addEventListener("click", () => {
      updatePage();
      showToast("Page refreshed. Firebase data is not connected.");
    });

    updatePage();
  }

  initialize();
})();
