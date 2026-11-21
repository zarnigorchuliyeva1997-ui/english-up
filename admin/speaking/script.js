
"use strict";

/* =========================================
   ENGLISH UP — SPEAKING MANAGEMENT
   Local storage version
========================================= */

const STORAGE_KEY = "englishUpAdminSpeaking";

let speakingTasks = [];
let editingSpeakingId = null;
let activeSpeakingId = null;
let editingSpeakingQuestionId = null;

const $ = (id) => document.getElementById(id);

function makeId() {
  return "speaking_" + Date.now() + "_" +
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
  let toast = $("speakingToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "speakingToast";
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

/* =========================================
   STORAGE
========================================= */

function loadSpeakingTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    speakingTasks = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(speakingTasks)) {
      speakingTasks = [];
    }
  } catch (error) {
    speakingTasks = [];
    notify("Speaking ma’lumotlarini o‘qishda xatolik yuz berdi.");
  }
}

function saveSpeakingTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(speakingTasks));
    return true;
  } catch (error) {
    notify("Ma’lumotlarni saqlashda xatolik yuz berdi.");
    return false;
  }
}

/* =========================================
   LABELS
========================================= */

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
    personal: "Personal Questions",
    dialogue: "Dialogue",
    monologue: "Monologue",
    picture: "Picture Description",
    discussion: "Discussion",
    "ielts-part-1": "IELTS Part 1",
    "ielts-part-2": "IELTS Part 2",
    "ielts-part-3": "IELTS Part 3"
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

function updateSpeakingStats() {
  $("totalSpeakingTasks").textContent = speakingTasks.length;

  $("activeSpeakingTasks").textContent =
    speakingTasks.filter(task => task.status === "active").length;

  $("draftSpeakingTasks").textContent =
    speakingTasks.filter(task => task.status === "draft").length;

  $("totalSpeakingQuestions").textContent =
    speakingTasks.reduce(
      (total, task) => total + (task.questions?.length || 0),
      0
    );
}

/* =========================================
   FILTERS AND TABLE
========================================= */

function getFilteredSpeakingTasks() {
  const search = ($("speakingSearch")?.value || "").trim().toLowerCase();
  const level = $("speakingLevelFilter")?.value || "";
  const type = $("speakingTypeFilter")?.value || "";
  const status = $("speakingStatusFilter")?.value || "";

  return speakingTasks.filter(task => {
    const matchesSearch =
      (task.title || "").toLowerCase().includes(search) ||
      (task.category || "").toLowerCase().includes(search) ||
      (task.description || "").toLowerCase().includes(search);

    return matchesSearch &&
      (!level || task.level === level) &&
      (!type || task.type === type) &&
      (!status || task.status === status);
  });
}

function renderSpeakingTasks() {
  const tbody = $("speakingTableBody");
  if (!tbody) return;

  const filtered = getFilteredSpeakingTasks();

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="speaking-empty">
          Hozircha speaking topshiriqlari topilmadi.
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

        <td>${task.questions?.length || 0}</td>

        <td>
          <span class="speaking-access ${escapeHTML(task.access)}">
            ${task.access === "free" ? "Free" : "Subscription"}
          </span>
        </td>

        <td>
          <span class="speaking-status ${escapeHTML(task.status)}">
            ${escapeHTML(statusName(task.status))}
          </span>
        </td>

        <td>
          <button
            class="speaking-action"
            data-action="edit"
            data-id="${escapeHTML(task.id)}">
            Edit
          </button>

          <button
            class="speaking-action"
            data-action="questions"
            data-id="${escapeHTML(task.id)}">
            Questions
          </button>

          <button
            class="speaking-action delete-speaking"
            data-action="delete"
            data-id="${escapeHTML(task.id)}">
            Delete
          </button>
        </td>
      </tr>
    `).join("");
  }

  $("speakingTaskCount").textContent =
    `${filtered.length} ta topshiriq`;

  updateSpeakingStats();
}

/* =========================================
   SPEAKING TASK FORM
========================================= */

function openSpeakingForm(task = null) {
  $("speakingForm").reset();

  editingSpeakingId = task ? task.id : null;

  $("speakingFormTitle").textContent =
    task ? "Edit Speaking Task" : "Add Speaking Task";

  if (task) {
    $("speakingId").value = task.id;
    $("speakingTitle").value = task.title || "";
    $("speakingLevel").value = task.level || "beginner";
    $("speakingType").value = task.type || "personal";
    $("speakingCategory").value = task.category || "";
    $("speakingPreparation").value = task.preparation ?? 30;
    $("speakingDuration").value = task.duration ?? 60;
    $("speakingAttempts").value = String(task.attempts ?? 3);
    $("speakingDescription").value = task.description || "";
    $("speakingInstructions").value = task.instructions || "";
    $("speakingSample").value = task.sample || "";
    $("speakingAccess").value = task.access || "free";
    $("speakingStatus").value = task.status || "draft";
  } else {
    $("speakingId").value = "";
    $("speakingLevel").value = "beginner";
    $("speakingType").value = "personal";
    $("speakingPreparation").value = 30;
    $("speakingDuration").value = 60;
    $("speakingAttempts").value = "3";
    $("speakingAccess").value = "free";
    $("speakingStatus").value = "draft";
  }

  $("speakingFormPanel").style.display = "block";

  $("speakingFormPanel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function closeSpeakingForm() {
  $("speakingFormPanel").style.display = "none";
  $("speakingForm").reset();
  editingSpeakingId = null;
}

function handleSpeakingSubmit(event) {
  event.preventDefault();

  const title = $("speakingTitle").value.trim();

  if (!title) {
    notify("Speaking topshirig‘i nomini kiriting.");
    return;
  }

  const preparation = Number($("speakingPreparation").value);
  const duration = Number($("speakingDuration").value);

  if (!Number.isFinite(preparation) || preparation < 0 || preparation > 3600) {
    notify("Tayyorlanish vaqtini tekshiring.");
    return;
  }

  if (!Number.isFinite(duration) || duration < 10 || duration > 3600) {
    notify("Speaking vaqtini 10–3600 soniya oralig‘ida kiriting.");
    return;
  }

  const oldTask = editingSpeakingId
    ? speakingTasks.find(task => task.id === editingSpeakingId)
    : null;

  const task = {
    id: editingSpeakingId || makeId(),

    title,
    level: $("speakingLevel").value,
    type: $("speakingType").value,
    category: $("speakingCategory").value.trim(),

    preparation,
    duration,
    attempts: Number($("speakingAttempts").value),

    description: $("speakingDescription").value.trim(),
    instructions: $("speakingInstructions").value.trim(),
    sample: $("speakingSample").value.trim(),

    access: $("speakingAccess").value,
    status: $("speakingStatus").value,

    questions: oldTask?.questions || [],

    createdAt: oldTask
      ? oldTask.createdAt
      : new Date().toISOString(),

    updatedAt: new Date().toISOString()
  };

  if (oldTask) {
    speakingTasks = speakingTasks.map(item =>
      item.id === editingSpeakingId ? task : item
    );
  } else {
    speakingTasks.unshift(task);
  }

  if (!saveSpeakingTasks()) return;

  renderSpeakingTasks();
  closeSpeakingForm();

  notify(oldTask
    ? "Speaking topshirig‘i yangilandi."
    : "Yangi speaking topshirig‘i qo‘shildi."
  );
}

/* =========================================
   QUESTIONS
========================================= */

function getActiveSpeakingTask() {
  return speakingTasks.find(task => task.id === activeSpeakingId);
}

function openSpeakingQuestions(task) {
  activeSpeakingId = task.id;
  editingSpeakingQuestionId = null;

  $("speakingQuestionsTitle").textContent =
    task.title + " — Questions";

  $("speakingQuestionForm").reset();
  $("speakingQuestionId").value = "";

  $("speakingQuestionsPanel").style.display = "block";

  renderSpeakingQuestions();

  $("speakingQuestionsPanel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function closeSpeakingQuestions() {
  $("speakingQuestionsPanel").style.display = "none";
  activeSpeakingId = null;
  editingSpeakingQuestionId = null;
}

function renderSpeakingQuestions() {
  const task = getActiveSpeakingTask();
  const list = $("speakingQuestionsList");

  if (!task || !list) return;

  const questions = task.questions || [];

  $("speakingQuestionCount").textContent = questions.length;

  if (!questions.length) {
    list.innerHTML = `
      <p class="speaking-empty">
        Hozircha savollar qo‘shilmagan.
      </p>
    `;
    return;
  }

  list.innerHTML = questions.map((question, index) => `
    <div class="speaking-question-item">

      <strong>
        ${index + 1}. ${escapeHTML(question.text)}
      </strong>

      ${question.hint ? `
        <p class="question-hint">
          <b>Hint:</b> ${escapeHTML(question.hint)}
        </p>
      ` : ""}

      ${question.sample ? `
        <p class="question-sample">
          <b>Sample Answer:</b>
          ${escapeHTML(question.sample)}
        </p>
      ` : ""}

      <p>Answer time: ${Number(question.time) || 60} seconds</p>

      <div class="question-actions">
        <button
          class="speaking-action"
          data-question-action="edit"
          data-id="${escapeHTML(question.id)}">
          Edit
        </button>

        <button
          class="speaking-action delete-speaking"
          data-question-action="delete"
          data-id="${escapeHTML(question.id)}">
          Delete
        </button>
      </div>

    </div>
  `).join("");
}

function handleSpeakingQuestionSubmit(event) {
  event.preventDefault();

  const task = getActiveSpeakingTask();

  if (!task) {
    notify("Avval speaking topshirig‘ini tanlang.");
    return;
  }

  const text = $("speakingQuestionText").value.trim();
  const time = Number($("speakingQuestionTime").value);

  if (!text) {
    notify("Speaking savolini kiriting.");
    return;
  }

  if (!Number.isFinite(time) || time < 10 || time > 3600) {
    notify("Javob vaqtini 10–3600 soniya oralig‘ida kiriting.");
    return;
  }

  const question = {
    id: editingSpeakingQuestionId || makeId(),
    text,
    hint: $("speakingQuestionHint").value.trim(),
    sample: $("speakingQuestionSample").value.trim(),
    time
  };

  task.questions = task.questions || [];

  if (editingSpeakingQuestionId) {
    task.questions = task.questions.map(item =>
      item.id === editingSpeakingQuestionId ? question : item
    );
  } else {
    task.questions.push(question);
  }

  task.updatedAt = new Date().toISOString();

  if (!saveSpeakingTasks()) return;

  $("speakingQuestionForm").reset();
  $("speakingQuestionId").value = "";
  editingSpeakingQuestionId = null;

  renderSpeakingQuestions();
  renderSpeakingTasks();

  notify("Speaking savoli saqlandi.");
}

function editSpeakingQuestion(id) {
  const task = getActiveSpeakingTask();
  const question = task?.questions?.find(item => item.id === id);

  if (!question) return;

  editingSpeakingQuestionId = id;

  $("speakingQuestionId").value = id;
  $("speakingQuestionText").value = question.text || "";
  $("speakingQuestionHint").value = question.hint || "";
  $("speakingQuestionSample").value = question.sample || "";
  $("speakingQuestionTime").value = question.time || 60;

  $("speakingQuestionForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteSpeakingQuestion(id) {
  const task = getActiveSpeakingTask();
  if (!task) return;

  if (!confirm("Ushbu speaking savolini o‘chirmoqchimisiz?")) {
    return;
  }

  task.questions = (task.questions || []).filter(
    question => question.id !== id
  );

  if (saveSpeakingTasks()) {
    renderSpeakingQuestions();
    renderSpeakingTasks();
    notify("Speaking savoli o‘chirildi.");
  }
}

/* =========================================
   DELETE TASK
========================================= */

function deleteSpeakingTask(id) {
  const task = speakingTasks.find(item => item.id === id);
  if (!task) return;

  if (!confirm(`"${task.title}" topshirig‘ini o‘chirmoqchimisiz?`)) {
    return;
  }

  speakingTasks = speakingTasks.filter(item => item.id !== id);

  if (saveSpeakingTasks()) {
    if (activeSpeakingId === id) {
      closeSpeakingQuestions();
    }

    renderSpeakingTasks();
    notify("Speaking topshirig‘i o‘chirildi.");
  }
}

/* =========================================
   EVENTS
========================================= */

function bindSpeakingEvents() {
  $("speakingForm")?.addEventListener(
    "submit",
    handleSpeakingSubmit
  );

  $("speakingQuestionForm")?.addEventListener(
    "submit",
    handleSpeakingQuestionSubmit
  );

  $("addSpeakingBtn")?.addEventListener("click", () => {
    openSpeakingForm();
  });

  $("closeSpeakingForm")?.addEventListener(
    "click",
    closeSpeakingForm
  );

  $("cancelSpeakingForm")?.addEventListener(
    "click",
    closeSpeakingForm
  );

  $("closeSpeakingQuestions")?.addEventListener(
    "click",
    closeSpeakingQuestions
  );

  $("cancelSpeakingQuestion")?.addEventListener("click", () => {
    $("speakingQuestionForm").reset();
    $("speakingQuestionId").value = "";
    editingSpeakingQuestionId = null;
  });

  $("speakingSearch")?.addEventListener(
    "input",
    renderSpeakingTasks
  );

  $("speakingLevelFilter")?.addEventListener(
    "change",
    renderSpeakingTasks
  );

  $("speakingTypeFilter")?.addEventListener(
    "change",
    renderSpeakingTasks
  );

  $("speakingStatusFilter")?.addEventListener(
    "change",
    renderSpeakingTasks
  );

  $("refreshSpeaking")?.addEventListener("click", () => {
    loadSpeakingTasks();
    renderSpeakingTasks();
    notify("Speaking ro‘yxati yangilandi.");
  });

  $("speakingTableBody")?.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    const task = speakingTasks.find(item => item.id === id);

    if (action === "edit" && task) {
      openSpeakingForm(task);
    }

    if (action === "questions" && task) {
      openSpeakingQuestions(task);
    }

    if (action === "delete") {
      deleteSpeakingTask(id);
    }
  });

  $("speakingQuestionsList")?.addEventListener("click", event => {
    const button = event.target.closest(
      "button[data-question-action]"
    );

    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.questionAction === "edit") {
      editSpeakingQuestion(id);
    }

    if (button.dataset.questionAction === "delete") {
      deleteSpeakingQuestion(id);
    }
  });
}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadSpeakingTasks();
  bindSpeakingEvents();
  renderSpeakingTasks();
});
