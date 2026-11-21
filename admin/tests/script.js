/* =====================================
   ENGLISH UP — ADMIN TESTS
   ===================================== */

(() => {
    "use strict";

    const $ = id => document.getElementById(id);

    const STORAGE_KEY = "englishUpAdminTests";

    let tests = [];
    let selectedTestId = null;
    let editingQuestionId = null;

    const levels = {
        beginner: "Beginner",
        elementary: "Elementary",
        pre_intermediate: "Pre-Intermediate",
        intermediate: "Intermediate",
        upper_intermediate: "Upper-Intermediate",
        ielts: "IELTS"
    };

    const types = {
        lesson: "Lesson Test",
        vocabulary: "Vocabulary Test",
        grammar: "Grammar Test",
        final: "Final Exam",
        placement: "Placement Test"
    };

    const statuses = {
        active: "Faol",
        draft: "Qoralama",
        archived: "Arxivlangan"
    };

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
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

        let toast = $("testsToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "testsToast";
            toast.style.cssText = `
                position:fixed;
                right:20px;
                bottom:20px;
                z-index:99999;
                max-width:320px;
                padding:13px 18px;
                border-radius:10px;
                background:#29243b;
                color:white;
                font-size:13px;
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

    function loadTests() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            tests = saved ? JSON.parse(saved) : [];

            if (!Array.isArray(tests)) tests = [];
        } catch (error) {
            console.error("Tests loading error:", error);
            tests = [];
        }
    }

    function saveTests() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
            return true;
        } catch (error) {
            console.error("Tests saving error:", error);
            showToast("Ma'lumotni saqlab bo'lmadi.", "error");
            return false;
        }
    }

    function createId(prefix) {
        return prefix + "_" + Date.now() + "_" +
            Math.random().toString(36).slice(2, 8);
    }

    function getTest(id) {
        return tests.find(test => test.id === id);
    }

    function updateStatistics() {
        const total = tests.length;

        const active = tests.filter(
            test => test.status === "active"
        ).length;

        const draft = tests.filter(
            test => test.status === "draft"
        ).length;

        const questions = tests.reduce(
            (sum, test) => sum + (test.questions?.length || 0),
            0
        );

        if ($("totalTests")) $("totalTests").textContent = total;
        if ($("activeTests")) $("activeTests").textContent = active;
        if ($("draftTests")) $("draftTests").textContent = draft;
        if ($("totalQuestions")) $("totalQuestions").textContent = questions;
    }

    function getFilteredTests() {
        const search = ($("testSearch")?.value || "")
            .trim()
            .toLowerCase();

        const level = $("testLevelFilter")?.value || "";
        const status = $("testStatusFilter")?.value || "";

        return tests.filter(test => {
            const matchesSearch =
                !search || test.title.toLowerCase().includes(search);

            const matchesLevel =
                !level || test.level === level;

            const matchesStatus =
                !status || test.status === status;

            return matchesSearch && matchesLevel && matchesStatus;
        });
    }

    function renderTests() {
        const tbody = $("testsTableBody");
        if (!tbody) return;

        const filtered = getFilteredTests();

        if ($("testCount")) {
            $("testCount").textContent = `${filtered.length} ta test`;
        }

        if (!filtered.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="tests-empty">
                            Hozircha testlar mavjud emas.
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map((test, index) => `
            <tr>
                <td>${index + 1}</td>

                <td>
                    <span class="test-title-cell">
                        ${escapeHTML(test.title)}
                    </span>
                </td>

                <td>
                    <span class="test-level-badge">
                        ${escapeHTML(levels[test.level] || test.level)}
                    </span>
                </td>

                <td>${escapeHTML(types[test.type] || test.type)}</td>

                <td>${test.questions?.length || 0}</td>

                <td>${Number(test.duration) || 0} daq.</td>

                <td>
                    <span class="test-status status-${escapeHTML(test.status)}">
                        ${escapeHTML(statuses[test.status] || test.status)}
                    </span>
                </td>

                <td>
                    <div class="test-actions">
                        <button
                            type="button"
                            class="test-action"
                            data-action="questions"
                            data-id="${escapeHTML(test.id)}"
                        >Savollar</button>

                        <button
                            type="button"
                            class="test-action"
                            data-action="edit"
                            data-id="${escapeHTML(test.id)}"
                        >Tahrirlash</button>

                        <button
                            type="button"
                            class="test-action delete"
                            data-action="delete"
                            data-id="${escapeHTML(test.id)}"
                        >O'chirish</button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    function updatePage() {
        updateStatistics();
        renderTests();
    }

    function openTestForm(test = null) {
        const panel = $("testFormPanel");
        const form = $("testForm");

        if (!panel || !form) return;

        form.reset();

        if ($("testFormTitle")) {
            $("testFormTitle").textContent =
                test ? "Testni tahrirlash" : "Yangi test yaratish";
        }

        if (test) {
            $("testId").value = test.id;
            $("testTitle").value = test.title;
            $("testLevel").value = test.level;
            $("testType").value = test.type;
            $("testDuration").value = test.duration;
            $("testPassingScore").value = test.passingScore;
            $("testStatus").value = test.status;
            $("testDescription").value = test.description || "";
        } else {
            $("testId").value = "";
            $("testDuration").value = 30;
            $("testPassingScore").value = 80;
            $("testStatus").value = "draft";
        }

        panel.classList.add("active");
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeTestForm() {
        $("testFormPanel")?.classList.remove("active");
    }

    function handleTestSubmit(event) {
        event.preventDefault();

        const id = $("testId").value;
        const title = $("testTitle").value.trim();
        const level = $("testLevel").value;
        const type = $("testType").value;
        const duration = Number($("testDuration").value);
        const passingScore = Number($("testPassingScore").value);
        const status = $("testStatus").value;
        const description = $("testDescription").value.trim();

        if (!title || !level || !type) {
            showToast("Majburiy maydonlarni to'ldiring.", "error");
            return;
        }

        if (!Number.isInteger(duration) || duration < 1 || duration > 300) {
            showToast("Test vaqtini 1–300 daqiqa oralig'ida kiriting.", "error");
            return;
        }

        if (!Number.isInteger(passingScore) ||
            passingScore < 1 || passingScore > 100) {
            showToast("O'tish foizi 1–100 oralig'ida bo'lishi kerak.", "error");
            return;
        }

        const duplicate = tests.some(test =>
            test.title.toLowerCase() === title.toLowerCase() &&
            test.id !== id
        );

        if (duplicate) {
            showToast("Bu nomdagi test allaqachon mavjud.", "error");
            return;
        }

        if (id) {
            const test = getTest(id);

            if (!test) {
                showToast("Test topilmadi.", "error");
                return;
            }

            Object.assign(test, {
                title,
                level,
                type,
                duration,
                passingScore,
                status,
                description,
                updatedAt: new Date().toISOString()
            });
        } else {
            tests.unshift({
                id: createId("test"),
                title,
                level,
                type,
                duration,
                passingScore,
                status,
                description,
                questions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        if (!saveTests()) return;

        closeTestForm();
        updatePage();
        showToast(id ? "Test yangilandi." : "Yangi test yaratildi.");
    }

    function deleteTest(id) {
        const test = getTest(id);
        if (!test) return;

        const confirmed = confirm(
            `"${test.title}" testini va uning savollarini o'chirmoqchimisiz?`
        );

        if (!confirmed) return;

        tests = tests.filter(item => item.id !== id);

        if (selectedTestId === id) {
            closeQuestionPanel();
        }

        if (!saveTests()) return;

        updatePage();
        showToast("Test o'chirildi.");
    }

    function openQuestionPanel(testId) {
        const test = getTest(testId);
        if (!test) return;

        selectedTestId = testId;

        if (!Array.isArray(test.questions)) {
            test.questions = [];
        }

        $("questionPanelTitle").textContent =
            `Savollar: ${test.title}`;

        $("questionPanel").classList.add("active");

        resetQuestionForm();
        renderQuestions();

        $("questionPanel").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function closeQuestionPanel() {
        $("questionPanel")?.classList.remove("active");
        selectedTestId = null;
        editingQuestionId = null;
    }

    function resetQuestionForm() {
        $("questionForm")?.reset();

        editingQuestionId = null;

        if ($("questionId")) $("questionId").value = "";
        if ($("questionPoints")) $("questionPoints").value = 1;
    }

    function handleQuestionSubmit(event) {
        event.preventDefault();

        const test = getTest(selectedTestId);

        if (!test) {
            showToast("Avval testni tanlang.", "error");
            return;
        }

        const questionText = $("questionText").value.trim();

        const options = {
            A: $("optionA").value.trim(),
            B: $("optionB").value.trim(),
            C: $("optionC").value.trim(),
            D: $("optionD").value.trim()
        };

        const correctAnswer = $("correctAnswer").value;
        const points = Number($("questionPoints").value);
        const explanation = $("questionExplanation").value.trim();

        if (!questionText || Object.values(options).some(value => !value)) {
            showToast("Savol va barcha variantlarni to'ldiring.", "error");
            return;
        }

        if (!["A", "B", "C", "D"].includes(correctAnswer)) {
            showToast("To'g'ri javobni belgilang.", "error");
            return;
        }

        if (!Number.isInteger(points) || points < 1 || points > 100) {
            showToast("Ball 1–100 oralig'ida bo'lishi kerak.", "error");
            return;
        }

        const questionData = {
            id: editingQuestionId || createId("question"),
            text: questionText,
            options,
            correctAnswer,
            points,
            explanation,
            updatedAt: new Date().toISOString()
        };

        if (!Array.isArray(test.questions)) {
            test.questions = [];
        }

        if (editingQuestionId) {
            const index = test.questions.findIndex(
                question => question.id === editingQuestionId
            );

            if (index === -1) {
                showToast("Savol topilmadi.", "error");
                return;
            }

            test.questions[index] = {
                ...test.questions[index],
                ...questionData
            };
        } else {
            test.questions.push(questionData);
        }

        test.updatedAt = new Date().toISOString();

        if (!saveTests()) return;

        resetQuestionForm();
        renderQuestions();
        updatePage();

        showToast(
            editingQuestionId ? "Savol yangilandi." : "Savol qo'shildi."
        );
    }

    function renderQuestions() {
        const test = getTest(selectedTestId);
        const container = $("questionsList");

        if (!test || !container) return;

        const questions = test.questions || [];

        $("questionCount").textContent =
            `${questions.length} ta savol`;

        if (!questions.length) {
            container.innerHTML = `
                <div class="tests-empty">
                    Hozircha savollar mavjud emas.
                </div>
            `;
            return;
        }

        container.innerHTML = questions.map((question, index) => `
            <article class="question-item">

                <div class="question-item-title">
                    ${index + 1}. ${escapeHTML(question.text)}
                </div>

                <div class="question-options">
                    ${["A", "B", "C", "D"].map(letter => `
                        <div class="question-option ${
                            question.correctAnswer === letter ? "correct" : ""
                        }">
                            <strong>${letter}.</strong>
                            ${escapeHTML(question.options?.[letter] || "")}
                            ${question.correctAnswer === letter ? " ✓" : ""}
                        </div>
                    `).join("")}
                </div>

                <div class="question-item-footer">

                    <span class="question-points">
                        ${Number(question.points) || 1} ball
                    </span>

                    <div class="test-actions">
                        <button
                            type="button"
                            class="test-action"
                            data-question-action="edit"
                            data-id="${escapeHTML(question.id)}"
                        >Tahrirlash</button>

                        <button
                            type="button"
                            class="test-action delete"
                            data-question-action="delete"
                            data-id="${escapeHTML(question.id)}"
                        >O'chirish</button>
                    </div>

                </div>

            </article>
        `).join("");
    }

    function editQuestion(questionId) {
        const test = getTest(selectedTestId);
        const question = test?.questions?.find(
            item => item.id === questionId
        );

        if (!question) return;

        editingQuestionId = questionId;

        $("questionId").value = question.id;
        $("questionText").value = question.text;
        $("optionA").value = question.options?.A || "";
        $("optionB").value = question.options?.B || "";
        $("optionC").value = question.options?.C || "";
        $("optionD").value = question.options?.D || "";
        $("correctAnswer").value = question.correctAnswer;
        $("questionPoints").value = question.points || 1;
        $("questionExplanation").value = question.explanation || "";

        $("questionText").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function deleteQuestion(questionId) {
        const test = getTest(selectedTestId);
        if (!test) return;

        const question = test.questions.find(
            item => item.id === questionId
        );

        if (!question) return;

        if (!confirm("Ushbu savolni o'chirmoqchimisiz?")) return;

        test.questions = test.questions.filter(
            item => item.id !== questionId
        );

        if (!saveTests()) return;

        renderQuestions();
        updatePage();
        showToast("Savol o'chirildi.");
    }

    function handleTestsTableClick(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "questions") openQuestionPanel(id);

        if (action === "edit") {
            const test = getTest(id);
            if (test) openTestForm(test);
        }

        if (action === "delete") deleteTest(id);
    }

    function handleQuestionsClick(event) {
        const button = event.target.closest("button[data-question-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.questionAction;

        if (action === "edit") editQuestion(id);
        if (action === "delete") deleteQuestion(id);
    }

    function refreshTests() {
        loadTests();
        updatePage();
        showToast("Testlar ro'yxati yangilandi.");
    }

    function bindEvents() {
        $("addTestBtn")?.addEventListener("click", () => {
            openTestForm();
        });

        $("closeTestForm")?.addEventListener("click", closeTestForm);
        $("cancelTestForm")?.addEventListener("click", closeTestForm);

        $("testForm")?.addEventListener("submit", handleTestSubmit);

        $("refreshTests")?.addEventListener("click", refreshTests);

        $("testSearch")?.addEventListener("input", renderTests);
        $("testLevelFilter")?.addEventListener("change", renderTests);
        $("testStatusFilter")?.addEventListener("change", renderTests);

        $("testsTableBody")?.addEventListener(
            "click",
            handleTestsTableClick
        );

        $("questionForm")?.addEventListener(
            "submit",
            handleQuestionSubmit
        );

        $("closeQuestionPanel")?.addEventListener(
            "click",
            closeQuestionPanel
        );

        $("cancelQuestion")?.addEventListener(
            "click",
            resetQuestionForm
        );

        $("questionsList")?.addEventListener(
            "click",
            handleQuestionsClick
        );
    }

    function initialize() {
        loadTests();
        bindEvents();
        updatePage();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();
