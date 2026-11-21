
"use strict";

/* =========================================
   ENGLISH UP — READING LIBRARY
   Local version — Firebase integration later
========================================= */

const STORAGE_KEY = "englishUpAdminReadingLibrary";

const $ = (id) => document.getElementById(id);

let books = [];
let editingBookId = null;
let editingQuestionId = null;
let activeBookId = null;

function loadBooks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    books = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(books)) books = [];
  } catch (error) {
    books = [];
    notify("Reading ma’lumotlarini o‘qishda xatolik yuz berdi.");
  }
}

function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch (error) {
    notify("Saqlash uchun joy yetarli emas yoki brauzer xatoligi yuz berdi.");
    return false;
  }
}

function makeId() {
  return "book_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
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

function notify(message) {
  let toast = $("readingToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "readingToast";
    toast.style.cssText = `
      position:fixed;right:18px;bottom:18px;z-index:99999;
      background:#25213a;color:white;padding:13px 18px;
      border-radius:10px;max-width:320px;font-size:14px;
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

function formatType(type) {
  const names = {
    pdf: "PDF",
    ebook: "E-Book",
    audio: "Audio Book",
    complete: "Complete"
  };
  return names[type] || type;
}

function formatLevel(level) {
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

function formatStatus(status) {
  const names = {
    active: "Active",
    draft: "Draft",
    archived: "Archived"
  };
  return names[status] || status;
}

function updateStats() {
  $("totalBooks").textContent = books.length;
  $("activeBooks").textContent = books.filter(b => b.status === "active").length;
  $("pdfBooks").textContent = books.filter(b => b.type === "pdf").length;
  $("audioBooks").textContent = books.filter(b => b.type === "audio").length;
}

function getFilteredBooks() {
  const search = ($("bookSearch")?.value || "").trim().toLowerCase();
  const level = $("bookLevelFilter")?.value || "";
  const type = $("bookTypeFilter")?.value || "";
  const status = $("bookStatusFilter")?.value || "";

  return books.filter(book => {
    const matchesSearch =
      (book.title || "").toLowerCase().includes(search) ||
      (book.author || "").toLowerCase().includes(search);

    return matchesSearch &&
      (!level || book.level === level) &&
      (!type || book.type === type) &&
      (!status || book.status === status);
  });
}

function renderBooks() {
  const tbody = $("booksTableBody");
  if (!tbody) return;

  const filtered = getFilteredBooks();

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="reading-empty">
          Hozircha kitob topilmadi.
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = filtered.map(book => `
      <tr>
        <td>
          <strong>${escapeHTML(book.title)}</strong>
          <small>${escapeHTML(book.author || "Muallif ko‘rsatilmagan")}</small>
        </td>
        <td>${escapeHTML(formatLevel(book.level))}</td>
        <td>${escapeHTML(formatType(book.type))}</td>
        <td>
          <span class="book-access ${escapeHTML(book.access)}">
            ${book.access === "free" ? "Free" : "Subscription"}
          </span>
        </td>
        <td>
          <span class="book-status ${escapeHTML(book.status)}">
            ${escapeHTML(formatStatus(book.status))}
          </span>
        </td>
        <td>
          <button class="book-action" data-action="edit" data-id="${escapeHTML(book.id)}">Edit</button>
          <button class="book-action" data-action="tests" data-id="${escapeHTML(book.id)}">Tests</button>
          <button class="book-action delete-book" data-action="delete" data-id="${escapeHTML(book.id)}">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  $("bookCount").textContent = `${filtered.length} ta kitob`;
  updateStats();
}

function openBookForm(book = null) {
  const form = $("bookForm");
  if (!form) return;

  form.reset();
  editingBookId = book ? book.id : null;

  $("bookFormTitle").textContent = book ? "Edit Book" : "Add New Book";

  if (book) {
    $("bookId").value = book.id;
    $("bookTitle").value = book.title || "";
    $("bookAuthor").value = book.author || "";
    $("bookLevel").value = book.level || "beginner";
    $("bookCategory").value = book.category || "";
    $("bookType").value = book.type || "pdf";
    $("bookPages").value = book.pages || "";
    $("bookDescription").value = book.description || "";
    $("bookContent").value = book.content || "";
    $("bookAudioUrl").value = book.audioUrl || "";
    $("bookAccess").value = book.access || "free";
    $("bookStatus").value = book.status || "draft";
  } else {
    $("bookId").value = "";
    $("bookStatus").value = "draft";
    $("bookAccess").value = "free";
  }

  $("bookFormPanel").style.display = "block";
  $("bookFormPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeBookForm() {
  $("bookFormPanel").style.display = "none";
  $("bookForm")?.reset();
  editingBookId = null;
}

function getSelectedFileName(id, oldName) {
  const input = $(id);
  return input?.files?.[0]?.name || oldName || "";
}

function handleBookSubmit(event) {
  event.preventDefault();

  const title = $("bookTitle").value.trim();

  if (!title) {
    notify("Kitob nomini kiriting.");
    return;
  }

  const oldBook = editingBookId
    ? books.find(book => book.id === editingBookId)
    : null;

  const book = {
    id: editingBookId || makeId(),
    title,
    author: $("bookAuthor").value.trim(),
    level: $("bookLevel").value,
    category: $("bookCategory").value.trim(),
    type: $("bookType").value,
    pages: $("bookPages").value,
    description: $("bookDescription").value.trim(),
    content: $("bookContent").value,
    audioUrl: $("bookAudioUrl").value.trim(),
    access: $("bookAccess").value,
    status: $("bookStatus").value,

    coverName: getSelectedFileName("bookCover", oldBook?.coverName),
    pdfName: getSelectedFileName("bookPdf", oldBook?.pdfName),
    audioName: getSelectedFileName("bookAudio", oldBook?.audioName),

    questions: oldBook?.questions || [],
    createdAt: oldBook?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (oldBook) {
    books = books.map(item => item.id === editingBookId ? book : item);
  } else {
    books.unshift(book);
  }

  if (!saveBooks()) return;

  renderBooks();
  closeBookForm();
  notify(oldBook ? "Kitob yangilandi." : "Yangi kitob qo‘shildi.");
}

function deleteBook(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;

  if (!confirm(`"${book.title}" kitobini o‘chirmoqchimisiz?`)) return;

  books = books.filter(item => item.id !== id);

  if (saveBooks()) {
    renderBooks();
    notify("Kitob o‘chirildi.");
  }
}

/* =========================================
   BOOK TEST QUESTIONS
========================================= */

function openBookTests(book) {
  activeBookId = book.id;
  editingQuestionId = null;

  $("bookTestsTitle").textContent = `${book.title} — Tests`;
  $("bookTestsPanel").style.display = "block";

  $("bookTestForm")?.reset();
  $("bookQuestionId").value = "";

  renderBookQuestions();
  $("bookTestsPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeBookTests() {
  $("bookTestsPanel").style.display = "none";
  activeBookId = null;
  editingQuestionId = null;
}

function getActiveBook() {
  return books.find(book => book.id === activeBookId);
}

function renderBookQuestions() {
  const book = getActiveBook();
  const list = $("bookTestsList");

  if (!book || !list) return;

  const questions = book.questions || [];

  $("bookTestCount").textContent = `${questions.length} ta savol`;

  if (!questions.length) {
    list.innerHTML = `<p class="reading-empty">Hozircha test savollari yo‘q.</p>`;
    return;
  }

  list.innerHTML = questions.map((question, index) => `
    <div class="reading-question-item">
      <strong>${index + 1}. ${escapeHTML(question.text)}</strong>
      <p>A) ${escapeHTML(question.options.A)}</p>
      <p>B) ${escapeHTML(question.options.B)}</p>
      <p>C) ${escapeHTML(question.options.C)}</p>
      <p>D) ${escapeHTML(question.options.D)}</p>
      <p class="correct-answer">
        Correct answer: ${escapeHTML(question.correct)}
      </p>
      ${question.explanation ? `<small>${escapeHTML(question.explanation)}</small>` : ""}
      <div>
        <button class="book-action" data-question-action="edit" data-id="${escapeHTML(question.id)}">Edit</button>
        <button class="book-action delete-book" data-question-action="delete" data-id="${escapeHTML(question.id)}">Delete</button>
      </div>
    </div>
  `).join("");
}

function handleQuestionSubmit(event) {
  event.preventDefault();

  const book = getActiveBook();
  if (!book) {
    notify("Avval kitobni tanlang.");
    return;
  }

  const text = $("bookQuestionText").value.trim();
  const A = $("bookOptionA").value.trim();
  const B = $("bookOptionB").value.trim();
  const C = $("bookOptionC").value.trim();
  const D = $("bookOptionD").value.trim();

  if (!text || !A || !B || !C || !D) {
    notify("Savol va barcha 4 ta javob variantini to‘ldiring.");
    return;
  }

  const question = {
    id: editingQuestionId || makeId(),
    text,
    options: { A, B, C, D },
    correct: $("bookCorrectAnswer").value,
    points: Number($("bookQuestionPoints").value) || 1,
    explanation: $("bookQuestionExplanation").value.trim()
  };

  book.questions = book.questions || [];

  if (editingQuestionId) {
    book.questions = book.questions.map(item =>
      item.id === editingQuestionId ? question : item
    );
  } else {
    book.questions.push(question);
  }

  book.updatedAt = new Date().toISOString();

  if (!saveBooks()) return;

  $("bookTestForm").reset();
  $("bookQuestionId").value = "";
  editingQuestionId = null;

  renderBookQuestions();
  notify("Test savoli saqlandi.");
}

function editBookQuestion(id) {
  const book = getActiveBook();
  const question = book?.questions?.find(item => item.id === id);
  if (!question) return;

  editingQuestionId = id;

  $("bookQuestionId").value = id;
  $("bookQuestionText").value = question.text;
  $("bookOptionA").value = question.options.A;
  $("bookOptionB").value = question.options.B;
  $("bookOptionC").value = question.options.C;
  $("bookOptionD").value = question.options.D;
  $("bookCorrectAnswer").value = question.correct;
  $("bookQuestionPoints").value = question.points;
  $("bookQuestionExplanation").value = question.explanation || "";

  $("bookTestForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteBookQuestion(id) {
  const book = getActiveBook();
  if (!book) return;

  if (!confirm("Ushbu test savolini o‘chirmoqchimisiz?")) return;

  book.questions = (book.questions || []).filter(item => item.id !== id);

  if (saveBooks()) {
    renderBookQuestions();
    notify("Test savoli o‘chirildi.");
  }
}

/* =========================================
   EVENT LISTENERS
========================================= */

function bindEvents() {
  $("bookForm")?.addEventListener("submit", handleBookSubmit);
  $("bookTestForm")?.addEventListener("submit", handleQuestionSubmit);

  $("addBookBtn")?.addEventListener("click", () => openBookForm());
  $("closeBookForm")?.addEventListener("click", closeBookForm);
  $("cancelBookForm")?.addEventListener("click", closeBookForm);

  $("closeBookTests")?.addEventListener("click", closeBookTests);

  $("bookSearch")?.addEventListener("input", renderBooks);
  $("bookLevelFilter")?.addEventListener("change", renderBooks);
  $("bookTypeFilter")?.addEventListener("change", renderBooks);
  $("bookStatusFilter")?.addEventListener("change", renderBooks);

  $("refreshBooks")?.addEventListener("click", () => {
    loadBooks();
    renderBooks();
    notify("Kitoblar ro‘yxati yangilandi.");
  });

  $("booksTableBody")?.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    const book = books.find(item => item.id === id);

    if (action === "edit" && book) openBookForm(book);
    if (action === "tests" && book) openBookTests(book);
    if (action === "delete") deleteBook(id);
  });

  $("booksTableBody")?.addEventListener("click", event => {
    const button = event.target.closest("button[data-question-action]");
    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.questionAction === "edit") {
      editBookQuestion(id);
    }

    if (button.dataset.questionAction === "delete") {
      deleteBookQuestion(id);
    }
  });
}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  bindEvents();
  renderBooks();
});
