/* ENGLISH UP — LISTENING ADMIN */

(() => {
  "use strict";

  const STORAGE_KEY = "englishUpAdminListening";

  const $ = (id) => document.getElementById(id);

  const elements = {
    total: $("totalAudios"),
    active: $("activeAudios"),
    draft: $("draftAudios"),
    questions: $("totalAudioQuestions"),

    formPanel: $("audioFormPanel"),
    form: $("audioForm"),
    formTitle: $("audioFormTitle"),
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

    addButton: $("addAudioBtn"),
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

  let audios = loadAudios();
  let selectedAudioId = null;

  function loadAudios() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Listening data error:", error);
      return [];
    }
  }

  function saveAudios() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(audios));
      return true;
    } catch (error) {
      showToast("Ma'lumotni saqlashda xatolik yuz berdi.", "error");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
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
        color:white;
        background:#333;
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

  function getStatusLabel(status) {
    const labels = {
      active: "Faol",
      draft: "Qoralama",
      archived: "Arxiv"
    };

    return labels[status] || status;
  }

  function updateStats() {
    if (elements.total) {
      elements.total.textContent = audios.length;
    }

    if (elements.active) {
      elements.active.textContent =
        audios.filter(audio => audio.status === "active").length;
    }

    if (elements.draft) {
      elements.draft.textContent =
        audios.filter(audio => audio.status === "draft").length;
    }

    if (elements.questions) {
      elements.questions.textContent =
        audios.reduce((sum, audio) => sum + (audio.questions?.length || 0), 0);
    }
  }

  function getFilteredAudios() {
    const search = elements.search?.value.trim().toLowerCase() || "";
    const level = elements.levelFilter?.value || "";
    const status = elements.statusFilter?.value || "";

    return audios.filter(audio => {
      const matchesSearch =
        !search ||
        audio.title.toLowerCase().includes(search) ||
        audio.category.toLowerCase().includes(search);

      const matchesLevel = !level || audio.level === level;
      const matchesStatus = !status || audio.status === status;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }

  function renderAudios() {
    if (!elements.table) return;

    const filtered = getFilteredAudios();

    if (elements.count) {
      elements.count.textContent = filtered.length;
    }

    if (filtered.length === 0) {
      elements.table.innerHTML = `
        <tr>
          <td colspan="7" class="audio-empty">
            Hozircha audio materiallar mavjud emas.
          </td>
        </tr>
      `;
      return;
    }

    elements.table.innerHTML = filtered.map(audio => `
      <tr>
        <td>
          <strong>${escapeHTML(audio.title)}</strong>
        </td>
        <td>${escapeHTML(audio.level)}</td>
        <td>${escapeHTML(audio.category)}</td>
        <td>${escapeHTML(audio.duration)} min</td>
        <td>${audio.questions.length}</td>
        <td>
          <span class="audio-status ${escapeHTML(audio.status)}">
            ${escapeHTML(getStatusLabel(audio.status))}
          </span>
        </td>
        <td>
          <div class="audio-action">
            <button type="button" data-action="questions"
              data-id="${escapeHTML(audio.id)}">
              Savollar
            </button>
            <button type="button" data-action="edit"
              data-id="${escapeHTML(audio.id)}">
              Tahrirlash
            </button>
            <button type="button" class="delete-audio"
              data-action="delete" data-id="${escapeHTML(audio.id)}">
              O'chirish
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  function renderAll() {
    updateStats();
    renderAudios();
  }

  function openAudioForm(audio = null) {
    if (!elements.formPanel || !elements.form) return;

    elements.form.reset();

    if (audio) {
      elements.formTitle.textContent = "Audio materialni tahrirlash";
      elements.id.value = audio.id;
      elements.title.value = audio.title;
      elements.level.value = audio.level;
      elements.category.value = audio.category;
      elements.duration.value = audio.duration;
      elements.url.value = audio.url;
      elements.transcript.value = audio.transcript;
      elements.description.value = audio.description;
      elements.attempts.value = audio.attempts;
      elements.status.value = audio.status;
    } else {
      elements.formTitle.textContent = "Yangi audio material";
      elements.id.value = "";
      elements.attempts.value = "5";
      elements.status.value = "draft";
    }

    elements.formPanel.classList.add("show");
    elements.formPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeAudioForm() {
    elements.formPanel?.classList.remove("show");
    elements.form?.reset();
  }

  function saveAudio(event) {
    event.preventDefault();

    const title = elements.title.value.trim();
    const url = elements.url.value.trim();

    if (!title) {
      showToast("Audio nomini kiriting.", "error");
      return;
    }

    if (!url) {
      showToast("Audio URL manzilini kiriting.", "error");
      return;
    }

    const existingId = elements.id.value;
    const existing = audios.find(audio => audio.id === existingId);

    const audio = {
      id: existingId || (
        "audio_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7)
      ),
      title,
      level: elements.level.value,
      category: elements.category.value,
      duration: Number(elements.duration.value) || 0,
      url,
      transcript: elements.transcript.value.trim(),
      description: elements.description.value.trim(),
      attempts: elements.attempts.value,
      status: elements.status.value,
      questions: existing?.questions || [],
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const previousAudios = [...audios];

    if (existing) {
      audios = audios.map(item => item.id === existingId ? audio : item);
    } else {
      audios.unshift(audio);
    }

    if (!saveAudios()) {
      audios = previousAudios;
      return;
    }

    closeAudioForm();
    renderAll();
    showToast(existing ? "Audio yangilandi." : "Audio qo'shildi.");
  }

  function deleteAudio(id) {
    const audio = audios.find(item => item.id === id);
    if (!audio) return;

    if (!confirm(`"${audio.title}" audio materialini o'chirmoqchimisiz?`)) {
      return;
    }

    const previousAudios = [...audios];
    audios = audios.filter(item => item.id !== id);

    if (!saveAudios()) {
      audios = previousAudios;
      return;
    }

    if (selectedAudioId === id) {
      closeQuestionsPanel();
    }

    renderAll();
    showToast("Audio material o'chirildi.");
  }

  function openQuestionsPanel(id) {
    const audio = audios.find(item => item.id === id);
    if (!audio || !elements.questionsPanel) return;

    selectedAudioId = id;
    elements.questionsTitle.textContent = `Savollar: ${audio.title}`;
    elements.questionsPanel.classList.add("show");

    renderQuestions();
    elements.questionsPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeQuestionsPanel() {
    selectedAudioId = null;
    elements.questionsPanel?.classList.remove("show");
    elements.questionForm?.reset();

    if (elements.questionId) {
      elements.questionId.value = "";
    }
  }

  function renderQuestions() {
    const audio = audios.find(item => item.id === selectedAudioId);
    if (!audio || !elements.questionsList) return;

    const questions = audio.questions || [];

    if (elements.questionCount) {
      elements.questionCount.textContent = questions.length;
    }

    if (questions.length === 0) {
      elements.questionsList.innerHTML = `
        <div class="audio-empty">
          Bu audio uchun hali savollar qo'shilmagan.
        </div>
      `;
      return;
    }

    elements.questionsList.innerHTML = questions.map((question, index) => `
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
          <button type="button" data-question-action="edit"
            data-id="${escapeHTML(question.id)}">
            Tahrirlash
          </button>
          <button type="button" class="delete-audio"
            data-question-action="delete"
            data-id="${escapeHTML(question.id)}">
            O'chirish
          </button>
        </div>
      </div>
    `).join("");
  }

  function editQuestion(id) {
    const audio = audios.find(item => item.id === selectedAudioId);
    const question = audio?.questions.find(item => item.id === id);

    if (!question) return;

    elements.questionId.value = question.id;
    elements.questionText.value = question.text;
    elements.optionA.value = question.options.A;
    elements.optionB.value = question.options.B;
    elements.optionC.value = question.options.C;
    elements.optionD.value = question.options.D;
    elements.correctAnswer.value = question.correctAnswer;
    elements.questionPoints.value = question.points;

    elements.questionText.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  function saveQuestion(event) {
    event.preventDefault();

    const audio = audios.find(item => item.id === selectedAudioId);
    if (!audio) return;

    const text = elements.questionText.value.trim();

    const options = {
      A: elements.optionA.value.trim(),
      B: elements.optionB.value.trim(),
      C: elements.optionC.value.trim(),
      D: elements.optionD.value.trim()
    };

    if (!text || Object.values(options).some(value => !value)) {
      showToast("Savol va barcha javob variantlarini to'ldiring.", "error");
      return;
    }

    const correctAnswer = elements.correctAnswer.value;

    if (!["A", "B", "C", "D"].includes(correctAnswer)) {
      showToast("To'g'ri javobni tanlang.", "error");
      return;
    }

    const questionId = elements.questionId.value;

    const question = {
      id: questionId || (
        "question_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7)
      ),
      text,
      options,
      correctAnswer,
      points: Math.max(1, Number(elements.questionPoints.value) || 1)
    };

    const previousAudios = JSON.stringify(audios);

    if (questionId) {
      audio.questions = audio.questions.map(item =>
        item.id === questionId ? question : item
      );
    } else {
      audio.questions.push(question);
    }

    if (!saveAudios()) {
      audios = JSON.parse(previousAudios);
      return;
    }

    elements.questionForm.reset();
    elements.questionId.value = "";

    renderQuestions();
    renderAll();

    showToast(questionId ? "Savol yangilandi." : "Savol qo'shildi.");
  }

  function deleteQuestion(id) {
    const audio = audios.find(item => item.id === selectedAudioId);
    if (!audio) return;

    if (!confirm("Ushbu savolni o'chirmoqchimisiz?")) return;

    const previousAudios = JSON.stringify(audios);

    audio.questions = audio.questions.filter(item => item.id !== id);

    if (!saveAudios()) {
      audios = JSON.parse(previousAudios);
      return;
    }

    renderQuestions();
    renderAll();
    showToast("Savol o'chirildi.");
  }

  function bindEvents() {
    elements.addButton?.addEventListener("click", () => openAudioForm());
    elements.closeForm?.addEventListener("click", closeAudioForm);
    elements.cancelForm?.addEventListener("click", closeAudioForm);
    elements.form?.addEventListener("submit", saveAudio);

    elements.refresh?.addEventListener("click", renderAll);
    elements.search?.addEventListener("input", renderAudios);
    elements.levelFilter?.addEventListener("change", renderAudios);
    elements.statusFilter?.addEventListener("change", renderAudios);

    elements.table?.addEventListener("click", event => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const id = button.dataset.id;
      const action = button.dataset.action;
      const audio = audios.find(item => item.id === id);

      if (action === "edit" && audio) openAudioForm(audio);
      if (action === "delete") deleteAudio(id);
      if (action === "questions") openQuestionsPanel(id);
    });

    elements.closeQuestions?.addEventListener("click", closeQuestionsPanel);

    elements.questionForm?.addEventListener("submit", saveQuestion);

    elements.cancelQuestion?.addEventListener("click", () => {
      elements.questionForm?.reset();
      if (elements.questionId) elements.questionId.value = "";
    });

    elements.questionsList?.addEventListener("click", event => {
      const button = event.target.closest("button[data-question-action]");
      if (!button) return;

      const id = button.dataset.id;

      if (button.dataset.questionAction === "edit") {
        editQuestion(id);
      }

      if (button.dataset.questionAction === "delete") {
        deleteQuestion(id);
      }
    });
  }

  function init() {
    if (!elements.table || !elements.form) {
      console.error("Listening admin: HTML elementlari topilmadi.");
      return;
    }

    bindEvents();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
