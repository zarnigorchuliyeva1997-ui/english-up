
/* =====================================
   ENGLISH UP — ADMIN TESTS
   PostgreSQL API
   ===================================== */

(() => {
    "use strict";

    const $ = id => document.getElementById(id);

    const API_URL = "/api";
    const TOKEN_KEY = "englishUpToken";

    const LEVELS = {
        beginner: "Beginner",
        elementary: "Elementary",
        pre_intermediate: "Pre-Intermediate",
        intermediate: "Intermediate",
        upper_intermediate: "Upper-Intermediate",
        ielts: "IELTS"
    };

    const TYPES = {
        lesson: "Lesson Test",
        vocabulary: "Vocabulary Test",
        grammar: "Grammar Test",
        final: "Final Exam",
        placement: "Placement Test"
    };

    let tests = [];
    let courses = [];
    let selectedTestId = null;
    let editingQuestionId = null;
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
        toast.style.background = type === "error" ? "#b83232" : "#29243b";

        clearTimeout(toast._timer);

        toast._timer = setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
    }

    async function apiRequest(path, options = {}) {
        const token = getToken();

        if (!token) {
            window.location.href = "../login/index.html";
            throw new Error("Admin token topilmadi.");
        }

        const headers = {
            "Authorization": `Bearer ${token}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(options.headers || {})
        };

        const response = await fetch(`${API_URL}${path}`, {
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
            localStorage.removeItem("englishUpAdmin");
            window.location.href = "../login/index.html";
            throw new Error("Ruxsat berilmadi. Qayta tizimga kiring.");
        }

        if (!response.ok || data.success === false) {
            throw new Error(
                data.message || `Server xatosi: ${response.status}`
            );
        }

        return data;
    }

    function normalizeTest(row) {
        return {
            id: String(row.id),
            title: row.title || "",
            description: row.description || "",
            courseId: row.course_id ?? row.courseId ?? null,
            lessonId: row.lesson_id ?? row.lessonId ?? null,
            level: row.level || "",
            type: row.test_type || row.testType || "general",
            duration: Number(row.time_limit ?? row.timeLimit ?? 0),
            passingScore: Number(row.passing_score ?? row.passingScore ?? 80),
            status: row.is_active ? "active" : "draft",
            questionCount: Number(row.question_count ?? row.questionCount ?? 0),
            questions: []
        };
    }

    function getTest(id) {
        return tests.find(test => String(test.id) === String(id));
    }

    function getCourseForLevel(level) {
        return courses.find(course =>
            String(course.level || "").toLowerCase() ===
            String(level || "").toLowerCase()
        );
    }

    async function loadCourses() {
        const data = await apiRequest("/courses/admin/all");
        courses = Array.isArray(data.courses) ? data.courses : [];
    }

    async function loadTests(showMessage = false) {
        if (loading) return;

        loading = true;

        try {
            const data = await apiRequest("/tests/admin/all");

            tests = Array.isArray(data.tests)
                ? data.tests.map(normalizeTest)
                : [];

            updatePage();

            if (showMessage) {
                showToast("Testlar yangilandi.");
            }
        } catch (error) {
            console.error("Tests loading error:", error);
            showToast(error.message || "Testlarni yuklab bo'lmadi.", "error");
        } finally {
            loading = false;
        }
    }

    function updateStatistics() {
        const total = tests.length;
        const active = tests.filter(test => test.status === "active").length;
        const draft = tests.filter(test => test.status === "draft").length;
        const questions = tests.reduce(
            (sum, test) => sum + test.questionCount,
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
                        ${escapeHTML(LEVELS[test.level] || test.level || "—")}
                    </span>
                </td>
                <td>${escapeHTML(TYPES[test.type] || test.type)}</td>
                <td>${test.questionCount}</td>
                <td>${test.duration || 0} daq.</td>
                <td>
                    <span class="test-status status-${test.status}">
                        ${test.status === "active" ? "Faol" : "Qoralama"}
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
                            class="test-action"
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

        $("testFormTitle").textContent =
            test ? "Testni tahrirlash" : "Yangi test yaratish";

        $("testId").value = test?.id || "";
        $("testTitle").value = test?.title || "";
        $("testLevel").value = test?.level || "";
        $("testType").value = test?.type || "";
        $("testDuration").value = test?.duration || 30;
        $("testPassingScore").value = test?.passingScore ?? 80;
        $("testStatus").value = test?.status || "draft";
        $("testDescription").value = test?.description || "";

        panel.classList.add("active");
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeTestForm() {
        $("testFormPanel")?.classList.remove("active");
    }

    async function handleTestSubmit(event) {
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

        if (!Number.isFinite(passingScore) ||
            passingScore < 1 || passingScore > 100) {
            showToast("O'tish foizi 1–100 oralig'ida bo'lishi kerak.", "error");
            return;
        }

        const course = getCourseForLevel(level);

        if (!course) {
            showToast(
                "Bu daraja uchun avval Courses bo'limida kurs yarating.",
                "error"
            );
            return;
        }

        const payload = {
            courseId: Number(course.id),
            title,
            description,
            testType: type,
            timeLimit: duration,
            passingScore
        };

        const submitButton = $("testForm").querySelector(
            'button[type="submit"]'
        );

        if (submitButton) submitButton.disabled = true;

        try {
            let savedTestId = id;

            if (id) {
                await apiRequest(`/tests/${encodeURIComponent(id)}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });
            } else {
                const data = await apiRequest("/tests", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

                savedTestId = data.test?.id;

                if (!savedTestId) {
                    throw new Error("Server test ID qaytarmadi.");
                }
            }

            await apiRequest(
                `/tests/${encodeURIComponent(savedTestId)}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        isActive: status === "active"
                    })
                }
            );

            closeTestForm();
            await loadTests();
            showToast(id ? "Test yangilandi." : "Test yaratildi.");
        } catch (error) {
            console.error("Test save error:", error);
            showToast(error.message || "Testni saqlab bo'lmadi.", "error");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    }

    async function deleteTest(id) {
        const test = getTest(id);
        if (!test) return;

        if (!confirm(
            `"${test.title}" testini faolsizlantirmoqchimisiz?`
        )) return;

        try {
            await apiRequest(`/tests/${encodeURIComponent(id)}`, {
                method: "DELETE"
            });

            if (String(selectedTestId) === String(id)) {
                closeQuestionPanel();
            }

            await loadTests();
            showToast("Test faolsizlantirildi.");
        } catch (error) {
            showToast(error.message || "Testni o'chirib bo'lmadi.", "error");
        }
    }

    async function openQuestionPanel(testId) {
        const test = getTest(testId);
        if (!test) return;

        selectedTestId = testId;
        editingQuestionId = null;

        $("questionPanelTitle").textContent = `Savollar: ${test.title}`;
        $("questionPanel").classList.add("active");
        $("questionsList").innerHTML = `
            <div class="tests-empty">Savollar yuklanmoqda...</div>
        `;

        $("questionPanel").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        try {
            const data = await apiRequest(
                `/tests/${encodeURIComponent(testId)}`
            );

            const rows = Array.isArray(data.questions)
                ? data.questions
                : [];

            test.questions = rows.map(row => {
                let options = row.options || [];

                if (typeof options === "string") {
                    try {
                        options = JSON.parse(options);
                    } catch {
                        options = [];
                    }
                }

                if (!Array.isArray(options)) {
                    options = Object.values(options);
                }

                return {
                    id: String(row.id),
                    text: row.question || "",
                    options,
                    correctAnswer: row.correct_answer || row.correctAnswer || "",
                    points: Number(row.points) || 1,
                    explanation: row.explanation || ""
                };
            });

            renderQuestions();
        } catch (error) {
            console.error("Question loading error:", error);
            $("questionsList").innerHTML = `
                <div class="tests-empty">
                    ${escapeHTML(error.message)}
                </div>
            `;
            showToast(error.message || "Savollarni yuklab bo'lmadi.", "error");
        }

        resetQuestionForm();
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

    async function handleQuestionSubmit(event) {
        event.preventDefault();

        if (!selectedTestId) {
            showToast("Avval testni tanlang.", "error");
            return;
        }

        const questionText = $("questionText").value.trim();

        const options = [
            $("optionA").value.trim(),
            $("optionB").value.trim(),
            $("optionC").value.trim(),
            $("optionD").value.trim()
        ];

        const correctLetter = $("correctAnswer").value;
        const points = Number($("questionPoints").value);
        const explanation = $("questionExplanation").value.trim();

        if (!questionText || options.some(option => !option)) {
            showToast("Savol va barcha variantlarni to'ldiring.", "error");
            return;
        }

        if (!["A", "B", "C", "D"].includes(correctLetter)) {
            showToast("To'g'ri javobni belgilang.", "error");
            return;
        }

        if (!Number.isFinite(points) || points <= 0 || points > 100) {
            showToast("Ball 0 dan katta va 100 dan oshmasligi kerak.", "error");
            return;
        }

        const test = getTest(selectedTestId);
        const questionOrder = editingQuestionId
            ? Math.max(
                1,
                (test?.questions || []).findIndex(
                    item => String(item.id) === String(editingQuestionId)
                ) + 1
            )
            : (test?.questions?.length || 0) + 1;

        const payload = {
            question: questionText,
            options,
            correctAnswer: correctLetter,
            explanation,
            questionOrder,
            points
        };

        try {
            if (editingQuestionId) {
                await apiRequest(
                    `/tests/${encodeURIComponent(selectedTestId)}/questions/${encodeURIComponent(editingQuestionId)}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload)
                    }
                );
            } else {
                await apiRequest(
                    `/tests/${encodeURIComponent(selectedTestId)}/questions`,
                    {
                        method: "POST",
                        body: JSON.stringify(payload)
                    }
                );
            }

            await openQuestionPanel(selectedTestId);
            await loadTests();
            showToast(
                editingQuestionId ? "Savol yangilandi." : "Savol qo'shildi."
            );
        } catch (error) {
            console.error("Question save error:", error);
            showToast(error.message || "Savolni saqlab bo'lmadi.", "error");
        }
    }

    function renderQuestions() {
        const test = getTest(selectedTestId);
        const container = $("questionsList");

        if (!test || !container) return;

        const questions = test.questions || [];

        $("questionCount").textContent = `${questions.length} ta savol`;

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
                    ${["A", "B", "C", "D"].map((letter, optionIndex) => `
                        <div class="question-option ${
                            question.correctAnswer === letter ? "correct" : ""
                        }">
                            <strong>${letter}.</strong>
                            ${escapeHTML(question.options?.[optionIndex] || "")}
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
            item => String(item.id) === String(questionId)
        );

        if (!question) return;

        editingQuestionId = questionId;

        $("questionId").value = question.id;
        $("questionText").value = question.text;

        $("optionA").value = question.options?.[0] || "";
        $("optionB").value = question.options?.[1] || "";
        $("optionC").value = question.options?.[2] || "";
        $("optionD").value = question.options?.[3] || "";

        $("correctAnswer").value = question.correctAnswer;
        $("questionPoints").value = question.points || 1;
        $("questionExplanation").value = question.explanation || "";

        $("questionText").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    async function deleteQuestion(questionId) {
        if (!selectedTestId) return;

        if (!confirm("Ushbu savolni o'chirmoqchimisiz?")) return;

        try {
            await apiRequest(
                `/tests/${encodeURIComponent(selectedTestId)}/questions/${encodeURIComponent(questionId)}`,
                { method: "DELETE" }
            );

            await openQuestionPanel(selectedTestId);
            await loadTests();
            showToast("Savol o'chirildi.");
        } catch (error) {
            showToast(error.message || "Savolni o'chirib bo'lmadi.", "error");
        }
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
        const button = event.target.closest(
            "button[data-question-action]"
        );

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.questionAction;

        if (action === "edit") editQuestion(id);
        if (action === "delete") deleteQuestion(id);
    }

    async function refreshTests() {
        await loadTests(true);
    }

    function bindEvents() {
        $("addTestBtn")?.addEventListener("click", () => openTestForm());

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

    async function initialize() {
        bindEvents();

        try {
            await loadCourses();
        } catch (error) {
            console.error("Courses loading error:", error);
            showToast("Kurslar ro'yxatini yuklab bo'lmadi.", "error");
        }

        await loadTests();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();
