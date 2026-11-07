
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
    document.getElementById("lessonsPage").style.display = "block";
    window.scrollTo(0, 0);
}

function goHome() {
    document.getElementById("lessonsPage").style.display = "none";
    document.getElementById("homePage").style.display = "block";
    window.scrollTo(0, 0);
}

function selectLevel(level) {
    showMessage(level + " darslari tayyorlanmoqda!");
}
