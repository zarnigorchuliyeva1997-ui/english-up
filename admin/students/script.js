
"use strict";

(() => {
    const STORAGE_KEY = "englishUpStudents";

    const elements = {
        search: document.getElementById("studentSearch"),
        filter: document.getElementById("studentFilter"),
        table: document.getElementById("studentsTableBody"),
        total: document.getElementById("studentsTotal"),
        active: document.getElementById("studentsActive"),
        expired: document.getElementById("studentsExpired"),
        refresh: document.getElementById("refreshStudents")
    };

    let students = [];

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function formatDate(value) {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "—";

        return new Intl.DateTimeFormat("uz-UZ").format(date);
    }

    function getStatus(student) {
        if (!student.subscription?.endDate) return "none";

        const endDate = new Date(student.subscription.endDate);

        if (Number.isNaN(endDate.getTime())) return "none";

        return endDate >= new Date() ? "active" : "expired";
    }

    function updateStatistics() {
        elements.total.textContent = students.length;
        elements.active.textContent =
            students.filter(s => getStatus(s) === "active").length;
        elements.expired.textContent =
            students.filter(s => getStatus(s) === "expired").length;
    }

    function renderStudents(list) {
        if (!list.length) {
            elements.table.innerHTML = `
                <tr>
                    <td colspan="6" class="students-empty">
                        Hozircha o‘quvchilar mavjud emas.
                    </td>
                </tr>`;
            return;
        }

        elements.table.innerHTML = list.map(student => {
            const status = getStatus(student);

            const labels = {
                active: "Faol",
                expired: "Muddati tugagan",
                none: "Obuna yo‘q"
            };

            const classes = {
                active: "status-active",
                expired: "status-expired",
                none: "status-none"
            };

            return `
                <tr>
                    <td>${escapeHTML(student.name || "Ism kiritilmagan")}</td>
                    <td>${escapeHTML(student.email || "—")}</td>
                    <td>${escapeHTML(formatDate(student.createdAt))}</td>
                    <td>
                        <span class="student-status ${classes[status]}">
                            ${labels[status]}
                        </span>
                    </td>
                    <td>${escapeHTML(formatDate(student.subscription?.endDate))}</td>
                    <td>—</td>
                </tr>`;
        }).join("");
    }

    function filterStudents() {
        const search = (elements.search.value || "").trim().toLowerCase();
        const filter = elements.filter.value;

        const result = students.filter(student => {
            const matchesSearch =
                (student.name || "").toLowerCase().includes(search) ||
                (student.email || "").toLowerCase().includes(search);

            const status = getStatus(student);
            const matchesFilter = filter === "all" || filter === status;

            return matchesSearch && matchesFilter;
        });

        renderStudents(result);
    }

    function loadStudents() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            students = saved ? JSON.parse(saved) : [];

            if (!Array.isArray(students)) students = [];

            updateStatistics();
            filterStudents();
        } catch (error) {
            console.error("Students loading error:", error);
            students = [];
            updateStatistics();
            renderStudents([]);
        }
    }

    elements.search?.addEventListener("input", filterStudents);
    elements.filter?.addEventListener("change", filterStudents);
    elements.refresh?.addEventListener("click", loadStudents);

    loadStudents();
})();
