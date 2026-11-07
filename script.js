
const M = (q, a, correct) => ({ type: "mcq", q, a, correct });
const T = (q, answer, extra = []) => ({
  type: "text", q, answers: [answer, ...extra]
});

const lessons = [
{
title: "English Alphabet",
sections: [
"English alifbosida 26 ta harf mavjud.",
"A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z.",
"A — Apple, B — Book, C — Cat, D — Dog.",
"Harflarni ovoz chiqarib o‘qing va ularning yozilishini mashq qiling."
],
practice: [
M("How many letters are in the English alphabet?", ["24", "26", "28"], 1),
M("Which letter comes after B?", ["A", "C", "D"], 1),
T("Apple so‘zining birinchi harfini yozing.", "A"),
T("Book so‘zining o‘zbekcha tarjimasini yozing.", "kitob"),
M("Qaysi biri ingliz alifbosidagi harf?", ["Cat", "M", "Pen"], 1)
],
test: [
M("Which letter comes before D?", ["B", "C", "E"], 1),
M("Which word starts with C?", ["Apple", "Cat", "Book"], 1),
M("How many vowels are there in the English alphabet?", ["5", "7", "10"], 0),
M("Which is the last letter?", ["X", "Y", "Z"], 2),
M("Choose the correct spelling.", ["Bok", "Book", "Boock"], 1)
],
independent: [
T("Apple so‘zini o‘zbekchaga tarjima qiling.", "olma"),
T("Kitob so‘zini inglizchaga tarjima qiling.", "book"),
T("Cat so‘zining tarjimasini yozing.", "mushuk"),
T("It so‘zini ingliz tilida yozing.", "dog"),
T("B harfi bilan boshlanadigan Book so‘zini yozing.", "book"),
T("Olma haqida inglizcha so‘z yozing.", "apple"),
M("Choose the correct word: Mening ismim.", ["Name", "My name", "Book"], 1),
M("Which word means uy?", ["House", "Apple", "Pen"], 0),
T("Ingliz alifbosining birinchi harfini yozing.", "a"),
T("Ingliz alifbosining oxirgi harfini yozing.", "z")
]
},
{
title: "Greetings",
sections: [
"Hello! — Salom!",
"Good morning! — Xayrli tong!",
"Good afternoon! — Xayrli kun!",
"Good evening! — Xayrli kech!",
"Goodbye! — Xayr!",
"How are you? — Qalaysiz?",
"I am fine, thank you. — Yaxshiman, rahmat.",
"My name is Ali. — Mening ismim Ali.",
"Nice to meet you. — Tanishganimdan xursandman."
],
practice: [
M("Hello so‘zining tarjimasi?", ["Salom", "Xayr", "Rahmat"], 0),
T("Xayrli tongni ingliz tilida yozing.", "good morning", ["good morning!"]),
M("How are you? savoliga mos javobni toping.", ["I am fine", "Good night", "Goodbye"], 0),
T("Thank you so‘zining tarjimasi.", "rahmat"),
M("Goodbye qachon ishlatiladi?", ["Uchrashganda", "Xayrlashganda", "Rahmat aytganda"], 1)
],
test: [
M("Good evening — bu nima?", ["Xayrli tong", "Xayrli kech", "Xayrli kun"], 1),
M("What is your name? tarjimasi?", ["Ismingiz nima?", "Qayerdansiz?", "Yoshingiz nechida?"], 0),
M("I am fine — tarjimasi?", ["Men bandman", "Men yaxshiman", "Men xursandman"], 1),
M("Nice to meet you — tarjimasi?", ["Xayr", "Tanishganimdan xursandman", "Rahmat"], 1),
M("Rahmat ingliz tilida qanday?", ["Please", "Sorry", "Thank you"], 2)
],
independent: [
T("Salom so‘zini inglizchaga tarjima qiling.", "hello", ["hi"]),
T("Good morning tarjimasini yozing.", "xayrli tong"),
T("Xayr so‘zini inglizchaga tarjima qiling.", "goodbye", ["bye"]),
T("Yaxshiman, rahmat — ingliz tilida.", "i am fine thank you", ["i am fine, thank you"]),
T("Mening ismim Ali — ingliz tilida.", "my name is ali"),
T("Qalaysiz? — ingliz tilida.", "how are you"),
T("To‘g‘ri javobni toping: How are you?", ["I am fine", "My name is", "Goodbye"], 0),
T("To‘g‘ri javobni toping: What is your name?", ["I am fine", "My name is Ali", "Good night"], 1),
T("Xatoni toping: I fine.", ["I am fine", "I is fine", "I are fine"], 0),
T("Xatoni tuzating: Good moring.", "good morning")
]
},
{
title: "Numbers and Colors",
sections: [
"Numbers — Sonlar:",
"One — 1, Two — 2, Three — 3, Four — 4, Five — 5.",
"Six — 6, Seven — 7, Eight — 8, Nine — 9, Ten — 10.",
"Colors — Ranglar:",
"Red — qizil, Blue — ko‘k, Green — yashil.",
"Yellow — sariq, Black — qora, White — oq."
],
practice: [
M("Five nechani anglatadi?", ["3", "5", "7"], 1),
T("Qizil rangni ingliz tilida yozing.", "red"),
M("What comes after Six?", ["Five", "Seven", "Eight"], 1),
T("Blue so‘zining tarjimasi.", "ko'k", ["ko‘k"]),
M("Which one is a color?", ["Green", "Seven", "Ten"], 0)
],
test: [
M("Eight nechani anglatadi?", ["6", "7", "8"], 2),
M("Yellow tarjimasi?", ["Qora", "Sariq", "Oq"], 1),
M("What comes before Ten?", ["Eight", "Nine", "Seven"], 1),
M("What color is grass usually?", ["Green", "Red", "Black"], 0),
M("Three + Two = ?", ["Four", "Five", "Six"], 1)
],
independent: [
T("One so‘zining tarjimasi.", "bir"),
T("O‘n sonini ingliz tilida yozing.", "ten"),
T("Black so‘zining tarjimasi.", "qora"),
T("Yashil rangni ingliz tilida yozing.", "green"),
T("Seven so‘zining tarjimasi.", "yetti"),
T("Sariq rangni ingliz tilida yozing.", "yellow"),
M("Choose the correct spelling.", ["Blu", "Blue", "Bloo"], 1),
M("Which number is Nine?", ["7", "8", "9"], 2),
T("Four + One = ? Inglizcha yozing.", "five"),
T("Oq rangni ingliz tilida yozing.", "white")
]
},
{
title: "Pronouns",
sections: [
"Pronouns — Olmoshlar.",
"I — men. You — sen/siz.",
"He — u (erkak). She — u (ayol).",
"It — u (narsa yoki hayvon).",
"We — biz. They — ular.",
"Misollar: I am a student. She is a teacher. They are friends."
],
practice: [
M("I means ...", ["Men", "Sen", "U"], 0),
M("She kimga nisbatan ishlatiladi?", ["Erkak", "Ayol", "Ko‘plik"], 1),
T("Biz so‘zining inglizcha tarjimasi.", "we"),
M("They means ...", ["Men", "Biz", "Ular"], 2),
T("He olmoshining tarjimasi.", "u erkak", ["erkak"])
],
test: [
M("You means ...", ["Siz", "U", "Biz"], 0),
M("Which pronoun is used for a girl?", ["He", "She", "It"], 1),
M("It is used for ...", ["Faqat erkak", "Narsa yoki hayvon", "Faqat ayol"], 1),
M("They means ...", ["Ular", "Men", "Sen"], 0),
M("Choose the correct sentence.", ["She are happy", "She is happy", "She am happy"], 1)
],
independent: [
T("Men so‘zini inglizchaga tarjima qiling.", "i"),
T("Ular so‘zini inglizchaga tarjima qiling.", "they"),
T("We so‘zining tarjimasi.", "biz"),
T("He so‘zining tarjimasi.", "u erkak", ["erkak"]),
T("Sen/Siz so‘zini inglizchada yozing.", "you"),
T("Ayol uchun ishlatiladigan olmoshni yozing.", "she"),
T("To‘g‘ri javob: Ali is a boy. ___ is a boy.", ["He", "She", "They"], 0),
M("To‘g‘ri javob: Anna is a girl. ___ is a girl.", ["He", "She", "It"], 1),
T("Xatoni tuzating: They is friends.", "they are friends"),
T("Xatoni tuzating: I are a student.", "i am a student")
]
},
{
title: "Verb To Be",
sections: [
"To Be fe’lining shakllari: AM, IS, ARE.",
"I am — Men ...man.",
"He is — U ... (erkak). She is — U ... (ayol).",
"It is — U ... (narsa).",
"You are — Siz ...siz. We are — Biz ...miz.",
"They are — Ular ...",
"Inkor: I am not tired. He is not busy.",
"So‘roq: Are you ready? Is she happy?"
],
practice: [
M("I ___ a student.", ["is", "am", "are"], 1),
M("She ___ happy.", ["am", "is", "are"], 1),
T("They ___ friends. To‘g‘ri shaklni yozing.", "are"),
M("You ___ a teacher.", ["is", "are", "am"], 1),
T("He ___ my brother. To‘g‘ri shaklni yozing.", "is")
],
test: [
M("We ___ students.", ["am", "is", "are"], 2),
M("It ___ a cat.", ["is", "are", "am"], 0),
M("I ___ not tired.", ["is", "am", "are"], 1),
M("___ she happy?", ["Am", "Are", "Is"], 2),
M("They ___ at home.", ["are", "is", "am"], 0)
],
independent: [
T("Men o‘quvchiman — ingliz tilida.", "i am a student"),
T("U xursand (ayol) — ingliz tilida.", "she is happy"),
T("Biz do‘stmiz — ingliz tilida.", "we are friends"),
T("They are happy tarjimasi.", "ular xursand"),
T("I am not busy tarjimasi.", "men band emasman"),
T("I ___ happy. To‘g‘ri shaklni yozing.", "am"),
M("Choose: He ___ a teacher.", ["am", "is", "are"], 1),
M("Choose: ___ they ready?", ["Is", "Am", "Are"], 2),
T("Xatoni tuzating: She are a student.", "she is a student"),
T("Xatoni tuzating: We is happy.", "we are happy")
]
}
];

let currentLesson = 1;

function hideAllPages() {
  ["homePage", "lessonsPage", "beginnerPage", "lessonPage"].forEach(id => {
    const page = document.getElementById(id);
    if (page) page.style.display = "none";
  });
}

function showPage(id) {
  hideAllPages();
  const page = document.getElementById(id);
  if (page) page.style.display = "block";
  window.scrollTo(0, 0);
}

function goHome() { showPage("homePage"); }
function openLessons() { showPage("lessonsPage"); }
function openBeginner() { showPage("beginnerPage"); }

function openLesson(number) {
  if (number < 1 || number > lessons.length) return;
  currentLesson = number;
  renderLesson();
  showPage("lessonPage");
}

function normalize(value) {
  return value.toLowerCase().trim()
    .replace(/[.,!?']/g, "")
    .replace(/\s+/g, " ");
}

function renderTask(task, index, section) {
  const name = `${section}_${index}`;
  let html = `<div class="quiz-question" style="margin:14px 0;padding:14px;border:1px solid #ddd;border-radius:12px">
    <strong>${index + 1}. ${task.q}</strong>`;

  if (task.type === "mcq") {
    task.a.forEach((option, i) => {
      html += `<label style="display:block;margin:10px 0">
        <input type="radio" name="${name}" value="${i}"> ${option}
      </label>`;
    });
  } else {
    html += `<input type="text" id="${name}" placeholder="Javobingizni yozing"
      style="width:100%;padding:12px;margin-top:10px;border:1px solid #aaa;border-radius:8px">`;
  }

  return html + `</div>`;
}

function renderSection(title, tasks, section) {
  let html = `<section style="margin-top:25px">
    <h3>${title}</h3>
    <p>Topshiriqlarni bajaring va javoblaringizni tekshiring.</p>
    <div id="${section}_tasks">`;

  tasks.forEach((task, i) => {
    html += renderTask(task, i, section);
  });

  html += `</div>
    <button type="button" onclick="checkSection('${section}')">
      Javoblarni tekshirish
    </button>
    <div id="${section}_result" style="margin-top:14px;font-weight:bold"></div>
  </section>`;

  return html;
}

function renderLesson() {
  const lesson = lessons[currentLesson - 1];
  const content = document.getElementById("lessonContent");
  if (!content) return;

  let html = `<div class="lesson-content">
    <h2>${currentLesson}-dars: ${lesson.title}</h2>
    <h3>📚 Mavzu tushuntirishi</h3>`;

  lesson.sections.forEach(line => {
    html += `<p>${line}</p>`;
  });

  html += renderSection("✍️ 5 ta amaliy mashq", lesson.practice, "practice");
  html += renderSection("📝 5 ta test", lesson.test, "test");
  html += renderSection("🎯 10 ta mustaqil ishlash topshirig‘i", lesson.independent, "independent");

  html += `<div class="lesson-navigation" style="display:flex;gap:10px;margin-top:25px">
    <button onclick="changeLesson(-1)" ${currentLesson === 1 ? "disabled" : ""}>⬅ Oldingi dars</button>
    <button onclick="changeLesson(1)" ${currentLesson === lessons.length ? "disabled" : ""}>Keyingi dars ➡</button>
  </div></div>`;

  content.innerHTML = html;
}

function checkSection(section) {
  const lesson = lessons[currentLesson - 1];
  const tasks = {
    practice: lesson.practice,
    test: lesson.test,
    independent: lesson.independent
  }[section];

  let score = 0;
  let unanswered = 0;
  let feedback = "";

  tasks.forEach((task, i) => {
    const name = `${section}_${i}`;
    let correct = false;
    let answer = "";

    if (task.type === "mcq") {
      const selected = document.querySelector(`input[name="${name}"]:checked`);
      if (!selected) {
        unanswered++;
        return;
      }
      correct = Number(selected.value) === task.correct;
      answer = task.a[task.correct];
    } else {
      const input = document.getElementById(name);
      const value = input ? normalize(input.value) : "";
      if (!value) {
        unanswered++;
        return;
      }
      correct = task.answers.some(a => normalize(a) === value);
      answer = task.answers[0];
    }

    if (correct) {
      score++;
      feedback += `<p>✅ ${i + 1}. To‘g‘ri</p>`;
    } else {
      feedback += `<p>❌ ${i + 1}. Namunaviy javob: ${answer}</p>`;
    }
  });

  const result = document.getElementById(`${section}_result`);

  if (unanswered > 0) {
    result.innerHTML = `⚠️ ${unanswered} ta savol javobsiz qoldi. Barcha savollarga javob bering.`;
    return;
  }

  const percent = Math.round(score / tasks.length * 100);

  result.innerHTML = `
    <h3>Natijangiz: ${score}/${tasks.length} — ${percent}%</h3>
    <p>${percent === 100 ? "🏆 Ajoyib! Hammasi to‘g‘ri!" :
      percent >= 60 ? "👏 Yaxshi natija! Mashqni davom ettiring." :
      "💪 Mavzuni qayta o‘rganib, yana urinib ko‘ring."}</p>
    ${feedback}
  `;
}

function changeLesson(direction) {
  const next = currentLesson + direction;
  if (next >= 1 && next <= lessons.length) openLesson(next);
}

function showMessage(text) {
  const message = document.getElementById("message");
  if (!message) return;
  message.textContent = text;
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
  }, 3000);
}
