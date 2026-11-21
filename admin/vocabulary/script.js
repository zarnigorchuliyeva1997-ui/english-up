/* =====================================
   ENGLISH UP — ADMIN VOCABULARY
   ===================================== */

(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);

    let words = [];
    let editingWordId = null;

    const STORAGE_KEY = "englishUpAdminVocabulary";

    const levelNames = {
        beginner: "Beginner",
        elementary: "Elementary",
        pre_intermediate: "Pre-Intermediate",
        intermediate: "Intermediate",
        upper_intermediate: "Upper-Intermediate",
        ielts: "IELTS"
    };

    const categoryNames = {
        general: "General",
        family: "Family",
        home: "Home",
        school: "School",
        food: "Food",
        colors: "Colors",
        clothes: "Clothes",
        verbs: "Verbs",
        adjectives: "Adjectives"
    };

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

        let toast = $("vocabularyToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "vocabularyToast";
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

    function loadWords() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            words = saved ? JSON.parse(saved) : [];

            if (!Array.isArray(words)) {
                words = [];
            }
        } catch (error) {
            console.error("Vocabulary loading error:", error);
            words = [];
        }
    }

    function saveWords() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
            return true;
        } catch (error) {
            console.error("Vocabulary saving error:", error);
            showToast("Ma'lumotni saqlash imkoni bo'lmadi.", "error");
            return false;
        }
    }

    function getLevelName(level) {
        return levelNames[level] || level || "—";
    }

    function getCategoryName(category) {
        return categoryNames[category] || category || "—";
    }

    function updateStatistics() {
        const total = words.length;

        const beginner = words.filter(
            word => word.level === "beginner"
        ).length;

        const other = total - beginner;

        const categories = new Set(
            words.map(word => word.category).filter(Boolean)
        ).size;

        if ($("totalWords")) $("totalWords").textContent = total;
        if ($("beginnerWords")) $("beginnerWords").textContent = beginner;
        if ($("otherWords")) $("otherWords").textContent = other;
        if ($("wordCategories")) $("wordCategories").textContent = categories;
    }

    function getFilteredWords() {
        const search = ($("wordSearch")?.value || "")
            .trim()
            .toLowerCase();

        const level = $("wordLevelFilter")?.value || "";
        const category = $("wordCategoryFilter")?.value || "";

        return words.filter(word => {
            const searchable = [
                word.english,
                word.uzbek,
                word.pronunciation,
                word.example
            ].join(" ").toLowerCase();

            const matchesSearch = !search || searchable.includes(search);
            const matchesLevel = !level || word.level === level;
            const matchesCategory = !category || word.category === category;

            return matchesSearch && matchesLevel && matchesCategory;
        });
    }

    function renderWords() {
        const tbody = $("wordsTableBody");
        if (!tbody) return;

        const filtered = getFilteredWords();

        if ($("wordCount")) {
            $("wordCount").textContent =
                `${filtered.length} ta so'z`;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="vocabulary-empty">
                            <strong>Hozircha so'zlar mavjud emas</strong>
                            <p>Yangi so'z qo'shish uchun yuqoridagi tugmani bosing.</p>
                        </div>
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = filtered.map((word, index) => `
            <tr>
                <td>${index + 1}</td>

                <td>
                    <span class="word-english">
                        ${escapeHTML(word.english)}
                    </span>
                </td>

                <td>
                    <span class="word-translation">
                        ${escapeHTML(word.uzbek)}
                    </span>
                </td>

                <td>
                    <span class="word-pronunciation">
                        ${escapeHTML(word.pronunciation || "—")}
                    </span>
                </td>

                <td>
                    <span class="word-badge">
                        ${escapeHTML(getLevelName(word.level))}
                    </span>
                </td>

                <td>${escapeHTML(getCategoryName(word.category))}</td>

                <td>${escapeHTML(word.day || "—")}</td>

                <td>
                    <div class="word-actions">
                        <button
                            class="word-action"
                            data-action="edit"
                            data-id="${escapeHTML(word.id)}"
                            type="button"
                        >Tahrirlash</button>

                        <button
                            class="word-action delete"
                            data-action="delete"
                            data-id="${escapeHTML(word.id)}"
                            type="button"
                        >O'chirish</button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    function updatePage() {
        updateStatistics();
        renderWords();
    }

    function openWordForm(word = null) {
        const panel = $("wordFormPanel");
        const form = $("wordForm");

        if (!panel || !form) return;

        form.reset();

        editingWordId = word ? word.id : null;

        if ($("wordFormTitle")) {
            $("wordFormTitle").textContent =
                word ? "So'zni tahrirlash" : "Yangi so'z qo'shish";
        }

        if ($("wordId")) {
            $("wordId").value = word?.id || "";
        }

        if (word) {
            $("wordEnglish").value = word.english || "";
            $("wordUzbek").value = word.uzbek || "";
            $("wordPronunciation").value = word.pronunciation || "";
            $("wordType").value = word.type || "";
            $("wordLevel").value = word.level || "beginner";
            $("wordCategory").value = word.category || "general";
            $("wordDay").value = word.day || "";
            $("wordExample").value = word.example || "";
            $("wordExampleUzbek").value = word.exampleUzbek || "";
        } else {
            if ($("wordLevel")) $("wordLevel").value = "beginner";
            if ($("wordCategory")) $("wordCategory").value = "general";
        }

        panel.classList.add("active");
        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function closeWordForm() {
        const panel = $("wordFormPanel");
        if (panel) panel.classList.remove("active");

        editingWordId = null;
    }

    function handleWordSubmit(event) {
        event.preventDefault();

        const english = $("wordEnglish")?.value.trim();
        const uzbek = $("wordUzbek")?.value.trim();
        const pronunciation = $("wordPronunciation")?.value.trim();
        const type = $("wordType")?.value || "";
        const level = $("wordLevel")?.value || "";
        const category = $("wordCategory")?.value || "";
        const day = $("wordDay")?.value.trim() || "";
        const example = $("wordExample")?.value.trim() || "";
        const exampleUzbek = $("wordExampleUzbek")?.value.trim() || "";

        if (!english || !uzbek || !pronunciation || !level || !category) {
            showToast("Majburiy maydonlarni to'ldiring.", "error");
            return;
        }

        const duplicate = words.some(word =>
            word.english.toLowerCase() === english.toLowerCase() &&
            word.id !== editingWordId
        );

        if (duplicate) {
            showToast("Bu inglizcha so'z ro'yxatda mavjud.", "error");
            return;
        }

        const wordData = {
            id: editingWordId || (
                "word_" + Date.now() + "_" +
                Math.random().toString(36).slice(2, 8)
            ),
            english,
            uzbek,
            pronunciation,
            type,
            level,
            category,
            day,
            example,
            exampleUzbek,
            updatedAt: new Date().toISOString()
        };

        if (editingWordId) {
            const index = words.findIndex(
                word => word.id === editingWordId
            );

            if (index !== -1) {
                words[index] = {
                    ...words[index],
                    ...wordData
                };
            }
        } else {
            words.unshift(wordData);
        }

        if (!saveWords()) return;

        updatePage();
        closeWordForm();

        showToast(
            editingWordId
                ? "So'z yangilandi."
                : "Yangi so'z qo'shildi."
        );
    }

    function editWord(id) {
        const word = words.find(item => item.id === id);

        if (!word) {
            showToast("So'z topilmadi.", "error");
            return;
        }

        openWordForm(word);
    }

    function deleteWord(id) {
        const word = words.find(item => item.id === id);

        if (!word) return;

        const confirmed = confirm(
            `"${word.english}" so'zini o'chirmoqchimisiz?`
        );

        if (!confirmed) return;

        words = words.filter(item => item.id !== id);

        if (!saveWords()) return;

        updatePage();
        showToast("So'z o'chirildi.");
    }

    function handleTableClick(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "edit") editWord(id);
        if (action === "delete") deleteWord(id);
    }

    function refreshWords() {
        loadWords();
        updatePage();
        showToast("Ro'yxat yangilandi.");
    }

    function bindEvents() {
        $("addWordBtn")?.addEventListener("click", () => {
            openWordForm();
        });

        $("refreshWords")?.addEventListener("click", refreshWords);

        $("wordSearch")?.addEventListener("input", renderWords);
        $("wordLevelFilter")?.addEventListener("change", renderWords);
        $("wordCategoryFilter")?.addEventListener("change", renderWords);

        $("wordForm")?.addEventListener("submit", handleWordSubmit);

        $("closeWordForm")?.addEventListener("click", closeWordForm);
        $("cancelWordForm")?.addEventListener("click", closeWordForm);

        $("wordsTableBody")?.addEventListener(
            "click",
            handleTableClick
        );
    }

    function initialize() {
        loadWords();
        bindEvents();
        updatePage();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();
