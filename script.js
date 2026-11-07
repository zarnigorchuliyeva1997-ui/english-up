
function showMessage(text) {
    const message = document.getElementById("message");

    message.textContent = text;
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}

const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", function () {
    showMessage("English Up platformasiga xush kelibsiz!");
});

console.log("English Up muvaffaqiyatli ishga tushdi!");

