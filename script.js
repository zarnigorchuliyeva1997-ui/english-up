
const lessons = [
    {
        title: "1-dars — English Alphabet 🔤",
        subtitle: "Ingliz alifbosi",
        sections: [
            {
                heading: "Ingliz alifbosi",
                content: "Ingliz tilida 26 ta harf mavjud. Ular katta va kichik shaklda yoziladi."
            },
            {
                heading: "26 ta harf",
                content: "A a — Ey<br>B b — Bi<br>C c — Si<br>D d — Di<br>E e — Ii<br>F f — Ef<br>G g — Ji<br>H h — Eych<br>I i — Ay<br>J j — Jey<br>K k — Key<br>L l — El<br>M m — Em<br>N n — En<br>O o — Ou<br>P p — Pi<br>Q q — Kyu<br>R r — Ar<br>S s — Es<br>T t — Ti<br>U u — Yu<br>V v — Vi<br>W w — Dabliyu<br>X x — Eks<br>Y y — Uay<br>Z z — Zed / Zi"
            },
            {
                heading: "Misollar",
                content: "A — Apple (olma)<br>B — Book (kitob)<br>C — Cat (mushuk)<br>D — Dog (it)"
            }
        ],
        task: "Ingliz alifbosidagi 26 ta harfni tartib bilan yozing va ovoz chiqarib o‘qing."
    },
    {
        title: "2-dars — Greetings 👋",
        subtitle: "Salomlashish va tanishish",
        sections: [
            {
                heading: "Salomlashish",
                content: "Hello — Salom<br>Hi — Salom<br>Good morning — Xayrli tong<br>Good afternoon — Xayrli kun<br>Good evening — Xayrli kech<br>Goodbye — Xayr"
            },
            {
                heading: "Hol-ahvol so‘rash",
                content: "How are you? — Qalaysiz?<br>I am fine. — Men yaxshiman.<br>Thank you. — Rahmat.<br>And you? — Siz-chi?"
            },
            {
                heading: "Tanishish",
                content: "What is your name? — Ismingiz nima?<br>My name is Ali. — Mening ismim Ali.<br>Nice to meet you. — Tanishganimdan xursandman."
            }
        ],
        task: "O‘zingizni ingliz tilida tanishtiring. Kamida 4 ta gap yozing."
    },
    {
        title: "3-dars — Numbers and Colors 🔢",
        subtitle: "Sonlar va ranglar",
        sections: [
            {
                heading: "1 dan 10 gacha sonlar",
                content: "One — Bir<br>Two — Ikki<br>Three — Uch<br>Four — To‘rt<br>Five — Besh<br>Six — Olti<br>Seven — Yetti<br>Eight — Sakkiz<br>Nine — To‘qqiz<br>Ten — O‘n"
            },
            {
                heading: "Ranglar",
                content: "Red — Qizil<br>Blue — Ko‘k<br>Green — Yashil<br>Yellow — Sariq<br>Black — Qora<br>White — Oq<br>Orange — To‘q sariq<br>Pink — Pushti<br>Brown — Jigarrang<br>Purple — Binafsha"
            },
            {
                heading: "Misollar",
                content: "I have two books. — Menda ikkita kitob bor.<br>My car is red. — Mening mashinam qizil.<br>Three apples are green. — Uchta olma yashil."
            }
        ],
        task: "1 dan 10 gacha inglizcha sanang va 5 ta rang nomi bilan gap tuzing."
    },
    {
        title: "4-dars — Pronouns 👤",
        subtitle: "Kishilik olmoshlari",
        sections: [
            {
                heading: "Kishilik olmoshlari",
                content: "I — Men<br>You — Sen / Siz<br>He — U (erkak)<br>She — U (ayol)<br>It — U (narsa yoki hayvon)<br>We — Biz<br>They — Ular"
            },
            {
                heading: "Olmoshlarning ishlatilishi",
                content: "I am a student. — Men o‘quvchiman.<br>You are my friend. — Sen mening do‘stimsan.<br>He is a teacher. — U o‘qituvchi.<br>She is happy. — U xursand.<br>It is a cat. — Bu mushuk.<br>We are students. — Biz o‘quvchilarmiz.<br>They are friends. — Ular do‘stlar."
            },
            {
                heading: "Eslab qoling",
                content: "He — erkak kishi uchun.<br>She — ayol kishi uchun.<br>It — odatda narsa va hayvonlar uchun ishlatiladi."
            }
        ],
        task: "Har bir olmosh bilan bittadan inglizcha gap yozing."
    },
    {
        title: "5-dars — Verb To Be 📖",
        subtitle: "Am, Is, Are",
        sections: [
            {
                heading: "To be nima?",
                content: "To be fe'lining hozirgi zamondagi shakllari: am, is, are. Ular kim yoki nima ekanini, holatni va joylashuvni ifodalashga yordam beradi."
            },
            {
                heading: "Am / Is / Are",
                content: "I am — Men ...man<br>He is — U ...<br>She is — U ...<br>It is — U ...<br>You are — Sen/Siz ...<br>We are — Biz ...<br>They are — Ular ..."
            },
            {
                heading: "Darak gaplar",
                content: "I am happy. — Men xursandman.<br>He is a doctor. — U shifokor.<br>She is my sister. — U mening singlim.<br>We are friends. — Biz do‘stmiz.<br>They are at home. — Ular uyda."
            },
            {
                heading: "Inkor va savol",
                content: "Inkor:<br>I am not tired. — Men charchamaganman.<br>He is not busy. — U band emas.<br>They are not ready. — Ular tayyor emas.<br><br>Savol:<br>Are you happy? — Siz xursandmisiz?<br>Is he a teacher? — U o‘qituvchimi?<br>Am I right? — Men haqmanmi?"
            }
        ],
        task: "Am, is, are yordamida 5 ta darak, 3 ta inkor va 3 ta savol gap tuzing."
    }
];

let currentLesson = 1;

function hideAllPages() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("lessonsPage").style.display = "none";
    document.getElementById("beginnerPage").style.display = "none";
    document.getElementById("lessonPage").style.display = "none";
}

function showPage(pageId) {
    hideAllPages();
    document.getElementById(pageId).style.display = "block";
    window.scrollTo(0, 0);
}

function goHome() {
    showPage("homePage");
}

function openLessons() {
    showPage("lessonsPage");
}

function openBeginner() {
    showPage("beginnerPage");
}

function openLesson(number) {
    currentLesson = number;
    renderLesson();
    showPage("lessonPage");
}

function renderLesson() {
    const lesson = lessons[currentLesson - 1];
    const content = document.getElementById("lessonContent");

    let html = `
        <div class="lesson-content">
            <h1>${lesson.title}</h1>
            <p>${lesson.subtitle}</p>
    `;

    lesson.sections.forEach(section => {
        html += `
            <h2>${section.heading}</h2>
            <div class="lesson-example">${section.content}</div>
        `;
    });

    html += `
        <h2>🎯 Mustaqil topshiriq</h2>
        <p>${lesson.task}</p>
        </div>
    `;

    content.innerHTML = html;

    document.getElementById("previousLesson").disabled = currentLesson === 1;
    document.getElementById("nextLesson").disabled = currentLesson === lessons.length;
}

function changeLesson(direction) {
    const next = currentLesson + direction;

    if (next >= 1 && next <= lessons.length) {
        openLesson(next);
    }
}

function showMessage(text) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}
