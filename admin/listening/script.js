/* ENGLISH UP — LISTENING ADMIN
   PostgreSQL API version
*/

(() => {
  "use strict";

  const API_BASE = "/api/listening";
  const TOKEN_KEY = "englishUpToken";

  const $ = (id) => document.getElementById(id);

  const el = {
    total: $("totalAudios"),
    active: $("activeAudios"),
    draft: $("draftAudios"),
    questions: $("totalAudioQuestions"),

    formPanel: $("audioFormPanel"),
    formTitle: $("audioFormTitle"),
    form: $("audioForm"),
    id: $("audioId"),
    title: $("audioTitle"),
    level: $("audioLevel"),
    category: $("audioCategory"),
    duration: $("audioDuration"),
    url: $("audioUrl"),
    transcript: $("audioTranscript"),
    description: $("audioDescription"),
    attempts: $("audioAttempts"),
    status: $("audioStatus"),

    add: $("addAudioBtn"),
    closeForm: $("closeAudioForm"),
    cancelForm: $("cancelAudioForm"),

    questionsPanel: $("audioQuestionsPanel"),
    questionsTitle: $("audioQuestionsTitle"),
    closeQuestions: $("closeAudioQuestions"),
    questionForm: $("audioQuestionForm"),
    questionId: $("audioQuestionId"),
    questionText: $("audioQuestionText"),
    optionA: $("audioOptionA"),
    optionB: $("audioOptionB"),
    optionC: $("audioOptionC"),
    optionD: $("audioOptionD"),
    correctAnswer: $("audioCorrectAnswer"),
    questionPoints: $("audioQuestionPoints"),
    cancelQuestion: $("cancelAudioQuestion"),
    questionCount: $("audioQuestionCount"),
    questionsList: $("audioQuestionsList"),

    refresh: $("refreshAudios"),
    search: $("audioSearch"),
    levelFilter: $("audioLevelFilter"),
    statusFilter: $("audioStatusFilter"),
    table: $("audiosTableBody"),
    count: $("audioCount")
  };

  let audios = [];
  let selectedAudioId = null;
  let selectedQuestions = [];

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
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

  function showToast(message, type = "success") {
    if (typeof window.showToast === "function") {
      window.showToast(message, type);
      return;
    }

    let toast = $("listeningToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "listeningToast";
      toast.style.cssText = `
        position:fixed;
        right:20px;
        bottom:20px;
        z-index:99999;
        padding:13px 18px;
        border-radius:10px;
        color:#fff;
        background:#25834f;
        box-shadow:0 5px 20px rgba(0,0,0,.2);
        font-size:14px;
        max-width:calc(100% - 40px);
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.background = type === "error" ? "#c0392b" : "#25834f";
    toast.style.display = "block";

    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }

  async function apiRequest(path, options = {}) {
    const token = getToken();

    if (!token) {
      window.location.href = "../login/index.html";
      throw new Error("Tizimga qayta kirishingiz kerak.");
    }

    const headers = {
      "Authorization": `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    };

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "../login/index.html";
      throw new Error("Ruxsat berilmadi. Qayta tizimga kiring.");
    }

    if (!response.ok || data.success === false) {
      throw new Error(
        data.message || "Server bilan ishlashda xatolik yuz berdi."
      );
    }

    return data;
  }

  function normalizeAudio(audio) {
    const active = Boolean(audio.is_active ?? audio.isActive);

    return {
      id: audio.id,
      title: audio.title || "",
      level: audio.level || "",
      description: audio.description || "",
      transcript: audio.transcript || "",
      audioUrl: audio.audio_url || audio.audioUrl || "",
      duration: Number(
        audio.duration_seconds ?? audio.durationSeconds ?? 0
      ),
      isActive: active,
      questions: Array.isArray(audio.questions) ? audio.questions : [],
      questionCount: Number(
        audio.questions_count ??
        audio.question_count ??
        audio.questionCount ??
        (Array.isArray(audio.questions) ? audio.questions.length : 0)
      )
    };
  }

  function getStatus(audio) {
    return audio.isActive ? "active" : "draft";
  }

  function getStatusLabel(status) {
    return status === "active" ? "Faol" : "Qoralama";
  }

  function updateStats() {
    if (el.total) {
      el.total.textContent = audios.length;
    }

    if (el.active) {
      el.active.textContent =
        audios.filter(audio => audio.isActive).length;
    }

    if (el.draft) {
      el.draft.textContent =
        audios.filter(audio => !audio.isActive).length;
    }

    if (el.questions) {
      el.questions.textContent = audios.reduce(
        (sum, audio) => sum + audio.questionCount,
        0
      );
    }
  }

  function getFilteredAudios() {
    const search = el.search?.value.trim().toLowerCase() || "";
    const level = el.levelFilter?.value || "";
    const status = el.statusFilter?.value || "";

    return audios.filter(audio => {
      const matchesSearch =
        !search || audio.title.toLowerCase().includes(search);

      const matchesLevel =
        !level || audio.level === level;

      const matchesStatus =
        !status || getStatus(audio) === status;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }

  function renderAudios() {
    if (!el.table) return;

    const filtered = getFilteredAudios();

    if (el.count) {
      el.count.textContent = filtered.length;
    }

    if (!filtered.length) {
      el.table.innerHTML = `
        <tr>
          <td colspan="7" class="audio-empty">
            Hozircha audio materiallar mavjud emas.
          </td>
        </tr>
      `;
      return;
    }

    el.table.innerHTML = filtered.map(audio => {
      const status = getStatus(audio);

      return `
        <tr>
          <td><strong>${escapeHTML(audio.title)}</strong></td>
          <td>${escapeHTML(audio.level || "—")}</td>
          <td>—</td>
          <td>${escapeHTML(audio.duration)} min</td>
          <td>${audio.questionCount}</td>
          <td>
            <span class="audio-status ${status}">
              ${getStatusLabel(status)}
            </span>
          </td>
          <td>
            <div class="audio-action">
              <button type="button"
                data-action="questions"
                data-id="${escapeHTML(audio.id)}">
                Savollar
              </button>

              <button type="button"
                data-action="edit"
                data-id="${escapeHTML(audio.id)}">
                Tahrirlash
              </button>

              <button type="button"
                class="delete-audio"
                data-action="delete"
                data-id="${escapeHTML(audio.id)}">
                O'chirish
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderAll() {
    updateStats();
    renderAudios();
  }

  async function loadAudios() {
    if (el.table) {
      el.table.innerHTML = `
        <tr>
          <td colspan="7" class="audio-empty">Yuklanmoqda...</td>
        </tr>
      `;
    }

    try {
      const data = await apiRequest("/admin/all");

      const rows = data.lessons || data.audios || data.listeningLessons || [];

      audios = rows.map(normalizeAudio);

      renderAll();
    } catch (error) {
      console.error("Listening load error:", error);

      if (el.table) {
        el.table.innerHTML = `
          <tr>
            <td colspan="7" class="audio-empty">
              ${escapeHTML(error.message)}
            </td>
          </tr>
        `;
      }

      showToast(error.message, "error");
    }
  }

  function openAudioForm(audio = null) {
    if (!el.form || !el.formPanel) return;

    el.form.reset();

    if (audio) {
      el.formTitle.textContent = "Audio materialni tahrirlash";
      el.id.value = audio.id;
      el.title.value = audio.title;
      el.level.value = audio.level;
      el.duration.value = audio.duration || 5;
      el.url.value = audio.audioUrl;
      el.transcript.value = audio.transcript;
      el.description.value = audio.description;
      el.status.value = audio.isActive ? "active" : "draft";
    } else {
      el.formTitle.textContent = "Yangi audio material";
      el.id.value = "";
      el.duration.value = 5;
      el.status.value = "draft";
    }

    el.formPanel.classList.add("show");
    el.formPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeAudioForm() {
    el.formPanel?.classList.remove("show");
    el.form?.reset();

    if (el.id) {
      el.id.value = "";
    }
  }

  async function saveAudio(event) {
    event.preventDefault();

    const id = el.id.value.trim();
    const durationMinutes = Number(el.duration.value);

    if (!el.title.value.trim()) {
      showToast("Audio nomini kiriting.", "error");
      return;
    }

    if (!el.url.value.trim()) {
      showToast("Audio URL manzilini kiriting.", "error");
      return;
    }

    if (!Number.isFinite(durationMinutes) || durationMinutes < 0) {
      showToast("Audio davomiyligini tekshiring.", "error");
      return;
    }

    const payload = {
      title: el.title.value.trim(),
      level: el.level.value || null,
      description: el.description.value.trim() || null,
      transcript: el.transcript.value.trim() || null,
      audioUrl: el.url.value.trim(),
      durationSeconds: Math.round(durationMinutes * 60),
      isActive: el.status.value === "active"
    };

    try {
      if (id) {
        await apiRequest(`/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });

        showToast("Audio material yangilandi.");
      } else {
        await apiRequest("", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        showToast("Audio material qo'shildi.");
      }

      closeAudioForm();
      await loadAudios();
    } catch (error) {
      console.error("Listening save error:", error);
      showToast(error.message, "error");
    }
  }

  async function deleteAudio(id) {
    const audio = audios.find(item => String(item.id) === String(id));
    if (!audio) return;

    if (!confirm(`"${audio.title}" audio materialini o'chirmoqchimisiz?`)) {
      return;
    }

    try {
      await apiRequest(`/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });

      if (String(selectedAudioId) === String(id)) {
        closeQuestionsPanel();
      }

      showToast("Audio material o'chirildi.");
      await loadAudios();
    } catch (error) {
      console.error("Listening delete error:", error);
      showToast(error.message, "error");
    }
  }

  function normalizeQuestion(question) {
    const options = question.options || {};

    return {
      id: question.id,
      text: question.question || question.text || "",
      options: {
        A: Array.isArray(options) ? options[0] || "" : options.A || "",
        B: Array.isArray(options) ? options[1] || "" : options.B || "",
        C: Array.isArray(options) ? options[2] || "" : options.C || "",
        D: Array.isArray(options) ? options[3] || "" : options.D || ""
      },
      correctAnswer: question.correct_answer || question.correctAnswer || "",
      points: Number(question.points || 1),
      explanation: question.explanation || ""
    };
  }

  async function loadQuestions(audioId) {
    const data = await apiRequest(`/${encodeURIComponent(audioId)}`);

    const lesson = data.lesson || data.audio || {};
    const questions = data.questions || lesson.questions || [];

    selectedQuestions = Array.isArray(questions)
      ? questions.map(normalizeQuestion)
      : [];

    const audio = audios.find(
      item => String(item.id) === String(audioId)
    );

    if (audio) {
      audio.questionCount = selectedQuestions.length;
      audio.questions = selectedQuestions;
    }

    renderQuestions();
    updateStats();
    renderAudios();
  }

  async function openQuestions(id) {
    const audio = audios.find(item => String(item.id) === String(id));
    if (!audio || !el.questionsPanel) return;

    selectedAudioId = audio.id;
    selectedQuestions = [];

    el.questionsTitle.textContent = `Savollar: ${audio.title}`;
    el.questionsPanel.classList.add("show");

    if (el.questionsList) {
      el.questionsList.innerHTML = `
        <div class="audio-empty">Savollar yuklanmoqda...</div>
      `;
    }

    el.questionsPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    try {
      await loadQuestions(id);
    } catch (error) {
      console.error("Listening questions load error:", error);

      if (el.questionsList) {
        el.questionsList.innerHTML = `
          <div class="audio-empty">
            ${escapeHTML(error.message)}
          </div>
        `;
      }

      showToast(error.message, "error");
    }
  }

  function closeQuestionsPanel() {
    selectedAudioId = null;
    selectedQuestions = [];

    el.questionsPanel?.classList.remove("show");
    el.questionForm?.reset();

    if (el.questionId) {
      el.questionId.value = "";
    }
  }

  function renderQuestions() {
    if (!el.questionsList) return;

    if (el.questionCount) {
      el.questionCount.textContent = selectedQuestions.length;
    }

    if (!selectedQuestions.length) {
      el.questionsList.innerHTML = `
        <div class="audio-empty">
          Bu audio uchun hali savollar qo'shilmagan.
        </div>
      `;
      return;
    }

    el.questionsList.innerHTML = selectedQuestions.map((question, index) => `
      <div class="audio-question-item">
        <h4>${index + 1}. ${escapeHTML(question.text)}</h4>
        <p>A) ${escapeHTML(question.options.A)}</p>
        <p>B) ${escapeHTML(question.options.B)}</p>
        <p>C) ${escapeHTML(question.options.C)}</p>
        <p>D) ${escapeHTML(question.options.D)}</p>
        <p class="correct-answer">
          To'g'ri javob: ${escapeHTML(question.correctAnswer)}
          | Ball: ${escapeHTML(question.points)}
        </p>

        <div class="audio-action">
          <button type="button"
            data-question-action="edit"
            data-id="${escapeHTML(question.id)}">
            Tahrirlash
          </button>

          <button type="button"
            class="delete-audio"
            data-question-action="delete"
            data-id="${escapeHTML(question.id)}">
            O'chirish
          </button>
        </div>
      </div>
    `).join("");
  }

  function resetQuestionForm() {
    el.questionForm?.reset();

    if (el.questionId) {
      el.questionId.value = "";
    }

    if (el.questionPoints) {
      el.questionPoints.value = 1;
    }
  }

  function editQuestion(id) {
    const question = selectedQuestions.find(
      item => String(item.id) === String(id)
    );

    if (!question) return;

    el.questionId.value = question.id;
    el.questionText.value = question.text;
    el.optionA.value = question.options.A;
    el.optionB.value = question.options.B;
    el.optionC.value = question.options.C;
    el.optionD.value = question.options.D;
    el.correctAnswer.value = question.correctAnswer;
    el.questionPoints.value = question.points;

    el.questionForm.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  async function saveQuestion(event) {
    event.preventDefault();

    if (!selectedAudioId) {
      showToast("Avval audio materialni tanlang.", "error");
      return;
    }

    const questionId = el.questionId.value.trim();

    const payload = {
      question: el.questionText.value.trim(),
      options: {
        A: el.optionA.value.trim(),
        B: el.optionB.value.trim(),
        C: el.optionC.value.trim(),
        D: el.optionD.value.trim()
      },
      correctAnswer: el.correctAnswer.value,
      points: Number(el.questionPoints.value)
    };

    if (
      !payload.question ||
      !payload.options.A ||
      !payload.options.B ||
      !payload.options.C ||
      !payload.options.D ||
      !["A", "B", "C", "D"].includes(payload.correctAnswer) ||
      !Number.isInteger(payload.points) ||
      payload.points < 1
    ) {
      showToast("Savol ma'lumotlarini to'liq kiriting.", "error");
      return;
    }

    const basePath = `/${encodeURIComponent(selectedAudioId)}/questions`;

    try {
      if (questionId) {
        await apiRequest(
          `${basePath}/${encodeURIComponent(questionId)}`,
          {
            method: "PUT",
            body: JSON.stringify(payload)
          }
        );

        showToast("Savol yangilandi.");
      } else {
        await apiRequest(basePath, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        showToast("Savol qo'shildi.");
      }

      resetQuestionForm();
      await loadQuestions(selectedAudioId);
    } catch (error) {
      console.error("Listening question save error:", error);
      showToast(error.message, "error");
    }
  }

  async function deleteQuestion(id) {
    const question = selectedQuestions.find(
      item => String(item.id) === String(id)
    );

    if (!question) return;

    if (!confirm("Ushbu savolni o'chirmoqchimisiz?")) {
      return;
    }

    try {
      await apiRequest(
        `/${encodeURIComponent(selectedAudioId)}/questions/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      showToast("Savol o'chirildi.");
      resetQuestionForm();
      await loadQuestions(selectedAudioId);
    } catch (error) {
      console.error("Listening question delete error:", error);
      showToast(error.message, "error");
    }
  }

  function bindEvents() {
    el.add?.addEventListener("click", () => openAudioForm());

    el.closeForm?.addEventListener("click", closeAudioForm);
    el.cancelForm?.addEventListener("click", closeAudioForm);

    el.form?.addEventListener("submit", saveAudio);

    el.closeQuestions?.addEventListener(
      "click",
      closeQuestionsPanel
    );

    el.cancelQuestion?.addEventListener(
      "click",
      resetQuestionForm
    );

    el.questionForm?.addEventListener(
      "submit",
      saveQuestion
    );

    el.refresh?.addEventListener("click", loadAudios);

    el.search?.addEventListener("input", renderAudios);
    el.levelFilter?.addEventListener("change", renderAudios);
    el.statusFilter?.addEventListener("change", renderAudios);

    el.table?.addEventListener("click", event => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const id = button.dataset.id;
      const action = button.dataset.action;

      if (action === "questions") {
        openQuestions(id);
      } else if (action === "edit") {
        const audio = audios.find(
          item => String(item.id) === String(id)
        );

        if (audio) openAudioForm(audio);
      } else if (action === "delete") {
        deleteAudio(id);
      }
    });

    el.questionsList?.addEventListener("click", event => {
      const button = event.target.closest(
        "button[data-question-action]"
      );

      if (!button) return;

      const id = button.dataset.id;
      const action = button.dataset.questionAction;

      if (action === "edit") {
        editQuestion(id);
      } else if (action === "delete") {
        deleteQuestion(id);
      }
    });
  }

  function initialize() {
    if (!getToken()) {
      window.location.href = "../login/index.html";
      return;
    }

    bindEvents();
    loadAudios();
  }

  initialize();
})();
