
const M = (q, a, correct) => ({ type: "mcq", q, a, correct });
const T = (q, answer, extra = []) => ({
  type: "text",
  q,
  answers: [answer, ...extra]
});

const lessons = [
{
  title: "English Alphabet",
  subtitle: "Ingliz alifbosi",
  explanation: `
    <h2>📚 Mavzu tushuntirishi</h2>
    <p>Ingliz alifbosida 26 ta harf bor. Harflar katta va kichik shaklda yoziladi.</p>
    <div class="lesson-example">
      <b>Capital letters:</b><p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
      <b>Small letters:</b><p>abcdefghijklmnopqrstuvwxyz</p>
    </div>
    <h3>Unli harflar</h3>
    <p>A, E, I, O, U — ingliz tilidagi asosiy unli harflar.</p>
    <h3>Undosh harflar</h3>
    <p>Qolgan 21 ta harf undosh harflardir.</p>
    <h3>Misollar</h3>
    <ul>
      <li>A — Apple (olma)</li>
      <li>B — Book (kitob)</li>
      <li>C — Cat (mushuk)</li>
      <li>D — Dog (it)</li>
      <li>E — Egg (tuxum)</li>
    </ul>
    <p><b>Eslatma:</b> Harf nomi bilan uning so‘z ichidagi tovushi har doim bir xil bo‘lmaydi.</p>
  `,
  practice: [
    M("Ingliz alifbosida nechta harf bor?", ["24", "26", "28", "30"], 1),
    M("Qaysi biri unli harf?", ["B", "D", "E", "K"], 2),
    T("Apple so‘zining birinchi harfini yozing.", "a"),
    M("Qaysi so‘z B harfi bilan boshlanadi?", ["Cat", "Book", "Dog", "Egg"], 1),
    T("Ingliz tilidagi birinchi harfni yozing.", "a")
  ],
  tests: [
    M("Ingliz alifbosining oxirgi harfi qaysi?", ["X", "Y", "Z", "W"], 2),
    M("Qaysi biri unli harf?", ["T", "M", "I", "P"], 2),
    M("Book so‘zi qaysi harf bilan boshlanadi?", ["A", "B", "C", "D"], 1),
    M("Qaysi harf undosh?", ["A", "E", "O", "K"], 3),
    M("Cat so‘zining birinchi harfi?", ["C", "K", "S", "T"], 0)
  ],
  independent: [
    T("Dog so‘zining tarjimasini yozing.", "it"),
    T("Apple so‘zining tarjimasini yozing.", "olma"),
    T("Kitob so‘zini ingliz tilida yozing.", "book"),
    T("Mushuk so‘zini ingliz tilida yozing.", "cat"),
    T("A harfi bilan boshlanadigan bir inglizcha so‘z yozing.", "apple", ["ant", "animal"]),
    T("B harfi bilan boshlanadigan bir inglizcha so‘z yozing.", "book", ["ball", "boy"]),
    M("Qaysi so‘z tuxum degani?", ["Egg", "Eye", "Ear", "Eat"], 0),
    M("Qaysi so‘z it degani?", ["Cat", "Dog", "Book", "Pen"], 1),
    T("Dog so‘zining birinchi harfini yozing.", "d"),
    T("English so‘zining birinchi harfini yozing.", "e")
  ]
},
{
  title: "Greetings",
  subtitle: "Salomlashish va tanishish",
  explanation: `
    <h2>📚 Mavzu tushuntirishi</h2>
    <p>Greetings — odamlar bilan salomlashish va xayrlashish iboralari.</p>
    <h3>Salomlashish</h3>
    <ul>
      <li>Hello — Salom</li>
      <li>Hi — Salom</li>
      <li>Good morning — Xayrli tong</li>
      <li>Good afternoon — Xayrli kun</li>
      <li>Good evening — Xayrli kech</li>
    </ul>
    <h3>Hol-ahvol so‘rash</h3>
    <div class="lesson-example">
      <p><b>How are you?</b> — Qalaysiz?</p>
      <p><b>I'm fine, thank you.</b> — Yaxshiman, rahmat.</p>
      <p><b>And you?</b> — Siz-chi?</p>
    </div>
    <h3>Tanishish</h3>
    <ul>
      <li>What is your name? — Ismingiz nima?</li>
      <li>My name is Ali. — Mening ismim Ali.</li>
      <li>Nice to meet you. — Tanishganimdan xursandman.</li>
    </ul>
    <h3>Xayrlashish</h3>
    <p>Goodbye — Xayr. See you — Ko‘rishguncha.</p>
  `,
  practice: [
    M("Hello so‘zining tarjimasi?", ["Xayr", "Salom", "Rahmat", "Iltimos"], 1),
    T("Qalaysiz? iborasini ingliz tilida yozing.", "how are you"),
    M("Good morning qachon ishlatiladi?", ["Ertalab", "Kechqurun", "Tunda", "Xayrlashganda"], 0),
    T("Mening ismim Ali. Ingliz tilida yozing.", "my name is ali"),
    M("Nice to meet you tarjimasi?", ["Xayr", "Rahmat", "Tanishganimdan xursandman", "Xayrli tong"], 2)
  ],
  tests: [
    M("Good evening tarjimasi?", ["Xayrli tong", "Xayrli kech", "Xayrli kun", "Xayr"], 1),
    M("Thank you tarjimasi?", ["Rahmat", "Iltimos", "Salom", "Xayr"], 0),
    M("How are you? savoliga mos javob?", ["Goodbye", "I'm fine", "My name", "See you"], 1),
    M("What is your name? tarjimasi?", ["Qayerdansiz?", "Yoshingiz nechada?", "Ismingiz nima?", "Qalaysiz?"], 2),
    M("Goodbye tarjimasi?", ["Salom", "Rahmat", "Xayr", "Iltimos"], 2)
  ],
  independent: [
    T("Hello so‘zini tarjima qiling.", "salom"),
    T("Good morning so‘zini tarjima qiling.", "xayrli tong"),
    T("Rahmat so‘zini ingliz tilida yozing.", "thank you"),
    T("Xayr so‘zini ingliz tilida yozing.", "goodbye", ["bye"]),
    T("O‘zingizni tanishtirish uchun My name is ... jumlasini yozing.", "my name is ali", ["my name is john", "my name is sara"]),
    T("Qalaysiz? savolini ingliz tilida yozing.", "how are you"),
    M("See you tarjimasi?", ["Ko‘rishguncha", "Rahmat", "Salom", "Xayrli tong"], 0),
    M("I am fine tarjimasi?", ["Men ketdim", "Men yaxshiman", "Men o‘quvchiman", "Mening ismim"], 1),
    T("How are you? jumlasining birinchi so‘zini yozing.", "how"),
    T("Good night iborasining tarjimasini yozing.", "xayrli tun")
  ]
},
{
  title: "Numbers and Colors",
  subtitle: "Sonlar va ranglar",
  explanation: `
    <h2>📚 Mavzu tushuntirishi</h2>
    <h3>1 dan 10 gacha sonlar</h3>
    <div class="lesson-example">
      <p>1 — One | 2 — Two | 3 — Three</p>
      <p>4 — Four | 5 — Five | 6 — Six</p>
      <p>7 — Seven | 8 — Eight | 9 — Nine</p>
      <p>10 — Ten</p>
    </div>
    <h3>Asosiy ranglar</h3>
    <ul>
      <li>Red — Qizil</li>
      <li>Blue — Ko‘k</li>
      <li>Green — Yashil</li>
      <li>Yellow — Sariq</li>
      <li>Black — Qora</li>
      <li>White — Oq</li>
      <li>Orange — To‘q sariq</li>
      <li>Pink — Pushti</li>
      <li>Brown — Jigarrang</li>
      <li>Purple — Binafsha</li>
    </ul>
    <h3>Gaplarda ishlatish</h3>
    <div class="lesson-example">
      <p>One apple — Bitta olma.</p>
      <p>Two books — Ikkita kitob.</p>
      <p>A red car — Qizil mashina.</p>
      <p>A blue pen — Ko‘k ruchka.</p>
    </div>
  `,
  practice: [
    M("Five nechchi?", ["3", "4", "5", "6"], 2),
    M("Blue tarjimasi?", ["Qizil", "Ko‘k", "Yashil", "Oq"], 1),
    T("7 sonini ingliz tilida yozing.", "seven"),
    M("Yellow qaysi rang?", ["Sariq", "Qora", "Oq", "Pushti"], 0),
    T("Ikkita kitob iborasini ingliz tilida yozing.", "two books")
  ],
  tests: [
    M("Ten nechchi?", ["8", "9", "10", "11"], 2),
    M("Green tarjimasi?", ["Ko‘k", "Qora", "Yashil", "Oq"], 2),
    M("Three nechchi?", ["2", "3", "4", "5"], 1),
    M("Black tarjimasi?", ["Oq", "Qora", "Sariq", "Qizil"], 1),
    M("Pink tarjimasi?", ["Pushti", "Binafsha", "Yashil", "Jigarrang"], 0)
  ],
  independent: [
    T("Red tarjimasini yozing.", "qizil"),
    T("White tarjimasini yozing.", "oq"),
    T("To‘rt sonini ingliz tilida yozing.", "four"),
    T("To‘qqiz sonini ingliz tilida yozing.", "nine"),
    T("Sariq rangni ingliz tilida yozing.", "yellow"),
    T("Qora rangni ingliz tilida yozing.", "black"),
    M("Brown tarjimasi?", ["Jigarrang", "Pushti", "Oq", "Ko‘k"], 0),
    M("Eight nechchi?", ["6", "7", "8", "9"], 2),
    T("2 sonini ingliz tilida yozing.", "two"),
    T("Binafsha rangni ingliz tilida yozing.", "purple")
  ]
},
{
  title: "Pronouns",
  subtitle: "Kishilik olmoshlari",
  explanation: `
    <h2>📚 Mavzu tushuntirishi</h2>
    <p>Pronouns — ot o‘rnida ishlatiladigan olmoshlar.</p>
    <h3>Kishilik olmoshlari</h3>
    <div class="lesson-example">
      <p>I — Men</p>
      <p>You — Sen / Siz</p>
      <p>He — U (erkak)</p>
      <p>She — U (ayol)</p>
      <p>It — U (narsa yoki hayvon)</p>
      <p>We — Biz</p>
      <p>They — Ular</p>
    </div>
    <h3>Misollar</h3>
    <ul>
      <li>I am a student. — Men o‘quvchiman.</li>
      <li>You are my friend. — Sen mening do‘stimsan.</li>
      <li>He is a teacher. — U o‘qituvchi.</li>
      <li>She is happy. — U xursand.</li>
      <li>We are students. — Biz o‘quvchilarmiz.</li>
      <li>They are friends. — Ular do‘stlar.</li>
    </ul>
    <p><b>Eslab qoling:</b> He erkak kishi, She ayol kishi, It esa odatda narsa yoki hayvon uchun ishlatiladi.</p>
  `,
  practice: [
    M("Men so‘zining inglizchasi?", ["You", "I", "He", "We"], 1),
    M("She kim uchun ishlatiladi?", ["Erkak", "Ayol", "Narsa", "Biz"], 1),
    T("Biz olmoshini ingliz tilida yozing.", "we"),
    M("Ular so‘zining inglizchasi?", ["They", "It", "He", "I"], 0),
    T("U (erkak) olmoshini ingliz tilida yozing.", "he")
  ],
  tests: [
    M("You tarjimasi?", ["Men", "Sen / Siz", "Biz", "Ular"], 1),
    M("It qachon ishlatiladi?", ["Faqat ayol", "Faqat erkak", "Narsa yoki hayvon", "Faqat biz"], 2),
    M("He tarjimasi?", ["U (erkak)", "U (ayol)", "Biz", "Men"], 0),
    M("We tarjimasi?", ["Ular", "Sen", "Biz", "U"], 2),
    M("She tarjimasi?", ["U (erkak)", "U (ayol)", "Men", "Siz"], 1)
  ],
  independent: [
    T("They tarjimasini yozing.", "ular"),
    T("I tarjimasini yozing.", "men"),
    T("Sen so‘zini ingliz tilida yozing.", "you"),
    T("Biz so‘zini ingliz tilida yozing.", "we"),
    T("U (ayol) olmoshini yozing.", "she"),
    T("U (narsa) olmoshini yozing.", "it"),
    M("Qaysi olmosh erkak uchun?", ["She", "He", "We", "They"], 1),
    M("Qaysi olmosh ayol uchun?", ["It", "He", "She", "I"], 2),
    T("Ular so‘zining birinchi harfini yozing (inglizcha).", "t"),
    T("Men so‘zining inglizcha olmoshini yozing.", "i")
  ]
},
{
  title: "Verb To Be",
  subtitle: "Am / Is / Are",
  explanation: `
    <h2>📚 Mavzu tushuntirishi</h2>
    <p>To be fe'lining hozirgi zamondagi shakllari: <b>am, is, are</b>.</p>
    <h3>Qaysi olmosh bilan ishlatiladi?</h3>
    <div class="lesson-example">
      <p>I <b>am</b> — Men ...man</p>
      <p>He <b>is</b> — U ...</p>
      <p>She <b>is</b> — U ...</p>
      <p>It <b>is</b> — U ...</p>
      <p>You <b>are</b> — Sen / Siz ...</p>
      <p>We <b>are</b> — Biz ...</p>
      <p>They <b>are</b> — Ular ...</p>
    </div>
    <h3>Darak gap</h3>
    <ul>
      <li>I am a student. — Men o‘quvchiman.</li>
      <li>She is happy. — U xursand.</li>
      <li>They are friends. — Ular do‘stlar.</li>
    </ul>
    <h3>Inkor gap</h3>
    <p>Am / Is / Are dan keyin not qo‘shiladi.</p>
    <div class="lesson-example">
      <p>I am not tired. — Men charchamaganman.</p>
      <p>He is not a teacher. — U o‘qituvchi emas.</p>
      <p>We are not busy. — Biz band emasmiz.</p>
    </div>
    <h3>So‘roq gap</h3>
    <p>Am / Is / Are gap boshiga chiqadi.</p>
    <div class="lesson-example">
      <p>Are you ready? — Siz tayyormisiz?</p>
      <p>Is she happy? — U xursandmi?</p>
      <p>Am I late? — Men kech qoldimmi?</p>
    </div>
  `,
  practice: [
    M("I ___ a student.", ["is", "are", "am", "be"], 2),
    M("She ___ happy.", ["am", "is", "are", "be"], 1),
    T("They ___ friends. (are / is / am)", "are"),
    M("We ___ not busy.", ["am", "is", "are", "be"], 2),
    T("___ you ready? (Are / Is / Am)", "are")
  ],
  tests: [
    M("He ___ a teacher.", ["am", "is", "are", "be"], 1),
    M("You ___ my friend.", ["am", "is", "are", "be"], 2),
    M("I ___ not tired.", ["is", "are", "am", "be"], 2),
    M("___ she a student?", ["Are", "Am", "Is", "Be"], 2),
    M("They ___ at home.", ["is", "am", "are", "be"], 2)
  ],
  independent: [
    T("I am a student tarjimasini yozing.", "men o‘quvchiman"),
    T("She is happy tarjimasini yozing.", "u xursand"),
    T("Men o‘qituvchiman. Ingliz tilida yozing.", "i am a teacher"),
    T("Ular do‘stlar. Ingliz tilida yozing.", "they are friends"),
    T("I ___ happy. (am / is / are)", "am"),
    T("It ___ a book. (am / is / are)", "is"),
    M("To be fe'lining qaysi shakli I bilan ishlatiladi?", ["Is", "Are", "Am", "Be"], 2),
    M("To be fe'lining qaysi shakli They bilan ishlatiladi?", ["Is", "Am", "Are", "Be"], 2),
    T("He is not happy. jumlasidagi inkor so‘zini yozing.", "not"),
    T("Are you ready? jumlasining birinchi so‘zini yozing.", "are")
  ]
}
];

let currentLesson = 1;
const completedLessons = new Set();

function hideAllPages() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });
}

function showPage(id) {
  hideAllPages();
  const page = document.getElementById(id);
  if (page) page.style.display = "block";
  window.scrollTo(0, 0);
}

function goHome() {
  showPage("homePage");
}

function openLessons() {
  showPage("lessonsPage");
}

function openBeginner() {
  updateProgress();
  showPage("beginnerPage");
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[‘’`]/g, "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderTask(task, section, index) {
  const id = `${section}-${index}`;

  if (task.type === "mcq") {
    return `
      <div class="task-card" data-section="${section}" data-index="${index}">
        <p>${index + 1}. ${escapeHTML(task.q)}</p>
        ${task.a.map((answer, i) => `
          <label>
            <input type="radio" name="${id}" value="${i}">
            ${escapeHTML(answer)}
          </label>
        `).join("")}
        <div class="result" id="result-${id}" hidden></div>
      </div>`;
  }

  return `
    <div class="task-card" data-section="${section}" data-index="${index}">
      <p>${index + 1}. ${escapeHTML(task.q)}</p>
      <input type="text" id="answer-${id}" placeholder="Javobingizni yozing">
      <div class="result" id="result-${id}" hidden></div>
    </div>`;
}

function renderSection(title, tasks, section) {
  return `
    <section class="lesson-content">
      <h2>${title}</h2>
      <p>Har bir savolga javob bering. So‘ng tekshirish tugmasini bosing.</p>
      ${tasks.map((task, index) => renderTask(task, section, index)).join("")}
      <button class="check-btn" onclick="checkSection('${section}')">
        Javoblarni tekshirish
      </button>
      <div id="score-${section}" class="result" hidden></div>
    </section>`;
}

function renderLesson() {
  const lesson = lessons[currentLesson - 1];

  document.getElementById("lessonContent").innerHTML = `
    <div class="lesson-content">
      <h1>Lesson ${currentLesson}: ${lesson.title}</h1>
      <p class="subtitle">${lesson.subtitle}</p>
      ${lesson.explanation}
    </div>

    ${renderSection("✍️ Amaliy mashqlar", lesson.practice, "practice")}
    ${renderSection("🎯 Testlar", lesson.tests, "tests")}
    ${renderSection("🧠 Mustaqil topshiriqlar", lesson.independent, "independent")}

    <div class="lesson-navigation">
      <button onclick="changeLesson(-1)" ${currentLesson === 1 ? "disabled" : ""}>← Oldingi dars</button>
      <button onclick="changeLesson(1)" ${currentLesson === 5 ? "disabled" : ""}>Keyingi dars →</button>
    </div>
  `;

  showPage("lessonPage");
}

function openLesson(number) {
  if (number < 1 || number > lessons.length) return;
  currentLesson = number;
  renderLesson();
}

function checkSection(section) {
  const lesson = lessons[currentLesson - 1];
  const tasks = lesson[section];
  let score = 0;

  tasks.forEach((task, index) => {
    const id = `${section}-${index}`;
    const result = document.getElementById(`result-${id}`);
    let correct = false;

    if (task.type === "mcq") {
      const selected = document.querySelector(`input[name="${id}"]:checked`);
      correct = selected !== null && Number(selected.value) === task.correct;
    } else {
      const input = document.getElementById(`answer-${id}`);
      const answer = normalize(input.value);
      correct = task.answers.some(item => normalize(item) === answer);
    }

    if (correct) score++;

    result.hidden = false;
    result.className = `result ${correct ? "correct" : "incorrect"}`;
    result.textContent = correct
      ? "✓ To‘g‘ri javob!"
      : "✗ Noto‘g‘ri yoki javob kiritilmagan.";
  });

  const scoreBox = document.getElementById(`score-${section}`);
  scoreBox.hidden = false;
  scoreBox.className = "result " + (score === tasks.length ? "correct" : "incorrect");
  scoreBox.textContent = `Natija: ${score} / ${tasks.length} ta to‘g‘ri javob.`;

  if (section === "independent" && score === tasks.length) {
    completedLessons.add(currentLesson);
    updateProgress();
    showMessage("Ajoyib! Dars muvaffaqiyatli yakunlandi!");
  }
}

function updateProgress() {
  const bar = document.getElementById("beginnerProgress");
  const text = document.getElementById("progressText");

  if (bar) bar.style.width = `${completedLessons.size / lessons.length * 100}%`;
  if (text) text.textContent = `${completedLessons.size} / ${lessons.length} dars bajarildi`;
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

// HTML ichidagi onclick tugmalari uchun funksiyalarni ochiq qilish
window.goHome = goHome;
window.openLessons = openLessons;
window.openBeginner = openBeginner;
window.openLesson = openLesson;
window.changeLesson = changeLesson;
window.checkSection = checkSection;
window.showMessage = showMessage;
                         
