
(() => {
  "use strict";

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

  const lessons = [];
  let toastTimer;

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

  function updateStats() {
    elements.total.textContent = lessons.length;

    elements.published.textContent = lessons.filter(
      lesson => lesson.status === "published"
    ).length;

    elements.drafts.textContent = lessons.filter(
      lesson => lesson.status === "draft"
    ).length;

    elements.courses.textContent = new Set(
      lessons.map(lesson => lesson.course)
    ).size;
  }

  function getFilteredLessons() {
    const search = elements.search.value.trim().toLowerCase();
    const course = elements.courseFilter.value;
    const status = elements.statusFilter.value;

    return lessons.filter(lesson => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(search) ||
        lesson.course.toLowerCase().includes(search) ||
        lesson.type.toLowerCase().includes(search);

      const matchesCourse =
        course === "all" || lesson.course === course;

      const matchesStatus =
        status === "all" || lesson.status === status;

      return matchesSearch && matchesCourse && matchesStatus;
    }).sort((a, b) => a.order - b.order);
  }

  function renderLessons() {
    const filtered = getFilteredLessons();

    elements.count.textContent = `${filtered.length} lessons`;

    if (!filtered.length) {
      elements.table.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            No lessons available yet.
          </td>
        </tr>
      `;
      return;
    }

    elements.table.innerHTML = filtered.map(lesson => `
      <tr>
        <td>
          <strong>${escapeHTML(lesson.title)}</strong>
          <br>
          <small>${escapeHTML(lesson.type)}</small>
        </td>
        <td>${escapeHTML(lesson.course)}</td>
        <td>${lesson.order}</td>
        <td>${lesson.duration} min</td>
        <td>
          <span class="lesson-status ${lesson.status}">
            ${lesson.status === "published" ? "Published" : "Draft"}
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
    `).join("");
  }

  function updatePage() {
    updateStats();
    renderLessons();
  }

  function openForm(lesson = null) {
    elements.form.reset();
    $("lessonId").value = "";

    if (lesson) {
      elements.formTitle.textContent = "Edit Lesson";

      $("lessonId").value = lesson.id;
      $("lessonTitle").value = lesson.title;
      $("lessonCourse").value = lesson.course;
      $("lessonOrder").value = lesson.order;
      $("lessonDuration").value = lesson.duration;
      $("lessonStatus").value = lesson.status;
      $("lessonType").value = lesson.type;
      $("lessonDescription").value = lesson.description;
      $("lessonContent").value = lesson.content;
    } else {
      elements.formTitle.textContent = "Add New Lesson";
      $("lessonDuration").value = 30;
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
  }

  function saveLesson(event) {
    event.preventDefault();

    const id = $("lessonId").value;
    const title = $("lessonTitle").value.trim();
    const course = $("lessonCourse").value;
    const order = Number($("lessonOrder").value);
    const duration = Number($("lessonDuration").value);
    const status = $("lessonStatus").value;
    const type = $("lessonType").value;
    const description = $("lessonDescription").value.trim();
    const content = $("lessonContent").value.trim();

    if (!title || !course) {
      showToast("Enter lesson title and course.");
      return;
    }

    if (!Number.isInteger(order) || order < 1 || order > 500) {
      showToast("Lesson number must be between 1 and 500.");
      return;
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 600) {
      showToast("Duration must be between 1 and 600 minutes.");
      return;
    }

    const duplicate = lessons.find(lesson =>
      lesson.course === course &&
      lesson.order === order &&
      lesson.id !== id
    );

    if (duplicate) {
      showToast("This lesson number already exists in this course.");
      return;
    }

    const data = {
      title,
      course,
      order,
      duration,
      status,
      type,
      description,
      content
    };

    if (id) {
      const existing = lessons.find(lesson => lesson.id === id);

      if (!existing) {
        showToast("Lesson not found.");
        return;
      }

      Object.assign(existing, data);
      showToast("Lesson updated temporarily.");
    } else {
      lessons.push({
        id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...data
      });

      showToast("Lesson added temporarily.");
    }

    closeForm();
    updatePage();

    showToast("Changes are temporary until Firebase is connected.");
  }

  function handleTableAction(event) {
    const button = event.target.closest("button[data-id]");
    if (!button) return;

    const lesson = lessons.find(
      item => item.id === button.dataset.id
    );

    if (!lesson) return;

    if (button.classList.contains("edit-lesson")) {
      openForm(lesson);
      return;
    }

    if (button.classList.contains("delete-lesson")) {
      const confirmed = window.confirm(
        `Delete "${lesson.title}" from this temporary list?`
      );

      if (!confirmed) return;

      const index = lessons.findIndex(
        item => item.id === lesson.id
      );

      lessons.splice(index, 1);
      updatePage();

      showToast("Lesson removed from this session only.");
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

    elements.refresh.addEventListener("click", () => {
      updatePage();
      showToast("Page refreshed. Firebase is not connected yet.");
    });

    updatePage();
  }

  initialize();
})();
