
"use strict";

/* =========================================
   ENGLISH UP — WRITING MANAGEMENT
   Local storage version
========================================= */

const STORAGE_KEY = "englishUpAdminWritingTasks";

let writingTasks = [];
let editingTaskId = null;

const $ = (id) => document.getElementById(id);

function makeId() {
  return "writing_" + Date.now() + "_" +
    Math.random().toString(36).slice(2, 8);
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

function notify(message) {
  let toast = $("writingToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "writingToast";
    toast.style.cssText = `
      position:fixed;
      right:18px;
      bottom:18px;
      z-index:99999;
      background:#25213a;
      color:#fff;
      padding:13px 18px;
      border-radius:10px;
      max-width:320px;
      font-size:14px;
      box-shadow:0 5px 20px #0002;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    writingTasks = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(writingTasks)) {
      writingTasks = [];
    }
  } catch (error) {
    writingTasks = [];
    notify("Writing ma’lumotlarini o‘qishda xatolik yuz berdi.");
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(writingTasks));
    return true;
  } catch (error) {
    notify("Ma’lumotlarni saqlashda xatolik yuz berdi.");
    return false;
  }
}

function levelName(level) {
  const names = {
    beginner: "Beginner",
    elementary: "Elementary",
    preintermediate: "Pre-Intermediate",
    intermediate: "Intermediate",
    upperintermediate: "Upper-Intermediate",
    ielts: "IELTS"
  };

  return names[level] || level;
}

function typeName(type) {
  const names = {
    sentence: "Sentence Writing",
    paragraph: "Paragraph",
    essay: "Essay",
    email: "Email / Letter",
    "ielts-task-1": "IELTS Task 1",
    "ielts-task-2": "IELTS Task 2",
    translation: "Translation",
    other: "Other"
  };

  return names[type] || type;
}

function statusName(status) {
  const names = {
    active: "Active",
    draft: "Draft",
    archived: "Archived"
  };

  return names[status] || status;
}

/* =========================================
   STATISTICS
========================================= */

function updateStats() {
  $("totalTasks").textContent = writingTasks.length;

  $("activeTasks").textContent =
    writingTasks.filter(task => task.status === "active").length;

  $("draftTasks").textContent =
    writingTasks.filter(task => task.status === "draft").length;

  $("totalSubmissions").textContent =
    writingTasks.reduce(
      (total, task) => total + (Number(task.submissions) || 0),
      0
    );
}

/* =========================================
   FILTERS AND TABLE
========================================= */

function getFilteredTasks() {
  const search = ($("taskSearch")?.value || "").trim().toLowerCase();
  const level = $("taskLevelFilter")?.value || "";
  const type = $("taskTypeFilter")?.value || "";
  const status = $("taskStatusFilter")?.value || "";

  return writingTasks.filter(task => {
    const matchesSearch =
      (task.title || "").toLowerCase().includes(search) ||
      (task.category || "").toLowerCase().includes(search) ||
      (task.prompt || "").toLowerCase().includes(search);

    return matchesSearch &&
      (!level || task.level === level) &&
      (!type || task.type === type) &&
      (!status || task.status === status);
  });
}

function renderTasks() {
  const tbody = $("tasksTableBody");
  if (!tbody) return;

  const filtered = getFilteredTasks();

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="writing-empty">
          Hozircha writing topshiriqlari topilmadi.
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = filtered.map(task => `
      <tr>
        <td>
          <strong>${escapeHTML(task.title)}</strong>
          <small>${escapeHTML(task.category || "No category")}</small>
        </td>

        <td>${escapeHTML(levelName(task.level))}</td>

        <td>${escapeHTML(typeName(task.type))}</td>

        <td>
          <span class="writing-access ${escapeHTML(task.access)}">
            ${task.access === "free" ? "Free" : "Subscription"}
          </span>
        </td>

        <td>
          <span class="writing-status ${escapeHTML(task.status)}">
            ${escapeHTML(statusName(task.status))}
          </span>
        </td>

        <td>
          <button
            class="writing-action"
            data-action="edit"
            data-id="${escapeHTML(task.id)}">
            Edit
          </button>

          <button
            class="writing-action delete-task"
            data-action="delete"
            data-id="${escapeHTML(task.id)}">
            Delete
          </button>
        </td>
      </tr>
    `).join("");
  }

  $("taskCount").textContent = `${filtered.length} ta topshiriq`;

  updateStats();
}

/* =========================================
   FORM
========================================= */

function openTaskForm(task = null) {
  const form = $("taskForm");
  if (!form) return;

  form.reset();

  editingTaskId = task ? task.id : null;

  $("taskFormTitle").textContent =
    task ? "Edit Writing Task" : "Add Writing Task";

  if (task) {
    $("taskId").value = task.id;
    $("taskTitle").value = task.title || "";
    $("taskLevel").value = task.level || "beginner";
    $("taskType").value = task.type || "paragraph";
    $("taskCategory").value = task.category || "";
    $("taskTime").value = task.time || 30;
    $("taskWords").value = task.minWords ?? 0;
    $("taskMaxWords").value = task.maxWords ?? 0;
    $("taskPrompt").value = task.prompt || "";
    $("taskInstructions").value = task.instructions || "";
    $("taskUsefulWords").value = task.usefulWords || "";
    $("taskExample").value = task.example || "";
    $("taskAccess").value = task.access || "free";
    $("taskStatus").value = task.status || "draft";
  } else {
    $("taskId").value = "";
    $("taskLevel").value = "beginner";
    $("taskType").value = "sentence";
    $("taskTime").value = 30;
    $("taskWords").value = 0;
    $("taskMaxWords").value = 0;
    $("taskAccess").value = "free";
    $("taskStatus").value = "draft";
  }

  $("taskFormPanel").style.display = "block";

  $("taskFormPanel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function closeTaskForm() {
  $("taskFormPanel").style.display = "none";
  $("taskForm")?.reset();
  editingTaskId = null;
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const title = $("taskTitle").value.trim();
  const prompt = $("taskPrompt").value.trim();

  if (!title || !prompt) {
    notify("Topshiriq nomi va savolini to‘ldiring.");
    return;
  }

  const minWords = Number($("taskWords").value) || 0;
  const maxWords = Number($("taskMaxWords").value) || 0;

  if (maxWords > 0 && minWords > maxWords) {
    notify("Maksimal so‘zlar soni minimal sondan kam bo‘lmasligi kerak.");
    return;
  }

  const oldTask = editingTaskId
    ? writingTasks.find(task => task.id === editingTaskId)
    : null;

  const task = {
    id: editingTaskId || makeId(),

    title,
    level: $("taskLevel").value,
    type: $("taskType").value,
    category: $("taskCategory").value.trim(),

    time: Number($("taskTime").value) || 30,
    minWords,
    maxWords,

    prompt,
    instructions: $("taskInstructions").value.trim(),
    usefulWords: $("taskUsefulWords").value.trim(),
    example: $("taskExample").value.trim(),

    access: $("taskAccess").value,
    status: $("taskStatus").value,

    submissions: oldTask ? oldTask.submissions || 0 : 0,

    createdAt: oldTask
      ? oldTask.createdAt
      : new Date().toISOString(),

    updatedAt: new Date().toISOString()
  };

  if (oldTask) {
    writingTasks = writingTasks.map(item =>
      item.id === editingTaskId ? task : item
    );
  } else {
    writingTasks.unshift(task);
  }

  if (!saveTasks()) return;

  renderTasks();
  closeTaskForm();

  notify(oldTask
    ? "Writing topshirig‘i yangilandi."
    : "Yangi writing topshirig‘i qo‘shildi."
  );
}

/* =========================================
   EDIT AND DELETE
========================================= */

function editTask(id) {
  const task = writingTasks.find(item => item.id === id);
  if (!task) return;

  openTaskForm(task);
}

function deleteTask(id) {
  const task = writingTasks.find(item => item.id === id);
  if (!task) return;

  if (!confirm(`"${task.title}" topshirig‘ini o‘chirmoqchimisiz?`)) {
    return;
  }

  writingTasks = writingTasks.filter(item => item.id !== id);

  if (saveTasks()) {
    renderTasks();
    notify("Writing topshirig‘i o‘chirildi.");
  }
}

/* =========================================
   EVENT LISTENERS
========================================= */

function bindEvents() {
  $("taskForm")?.addEventListener("submit", handleTaskSubmit);

  $("addTaskBtn")?.addEventListener("click", () => {
    openTaskForm();
  });

  $("closeTaskForm")?.addEventListener("click", closeTaskForm);
  $("cancelTaskForm")?.addEventListener("click", closeTaskForm);

  $("taskSearch")?.addEventListener("input", renderTasks);
  $("taskLevelFilter")?.addEventListener("change", renderTasks);
  $("taskTypeFilter")?.addEventListener("change", renderTasks);
  $("taskStatusFilter")?.addEventListener("change", renderTasks);

  $("refreshTasks")?.addEventListener("click", () => {
    loadTasks();
    renderTasks();
    notify("Writing ro‘yxati yangilandi.");
  });

  $("tasksTableBody")?.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === "edit") {
      editTask(id);
    }

    if (button.dataset.action === "delete") {
      deleteTask(id);
    }
  });
}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  bindEvents();
  renderTasks();
});
