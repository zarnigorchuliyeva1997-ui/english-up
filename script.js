
function showMessage(text) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}

function openLessons() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("beginnerPage").style.display = "none";
    document.getElementById("lessonsPage").style.display = "block";
    window.scrollTo(0, 0);
}

function goHome() {
    document.getElementById("lessonsPage").style.display = "none";
    document.getElementById("beginnerPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
    window.scrollTo(0, 0);
}

function selectLevel(level) {
    if (level === "Beginner") {
        document.getElementById("lessonsPage").style.display = "none";
        document.getElementById("beginnerPage").style.display = "block";
        window.scrollTo(0, 0);
    } else {
        showMessage(level + " darslari tayyorlanmoqda!");
    }
}

function openBeginner() {
    selectLevel("Beginner");
}
function openLesson1() {
    document.getElementById("beginnerPage").style.display = "none";
    document.getElementById("lesson1Page").style.display = "block";
    window.scrollTo(0, 0);
}

function backToBeginner() {
    document.getElementById("lesson1Page").style.display = "none";
    document.getElementById("beginnerPage").style.display = "block";
    window.scrollTo(0, 0);
}
