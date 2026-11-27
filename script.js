"use strict";

/* =====================================
   ENGLISH UP — MAIN SCRIPT
===================================== */

const $ = id => document.getElementById(id);

const STORAGE_KEY = "englishUpCompletedLessons";

let completedLessons = loadProgress();
let currentLesson = null;
let currentQuiz = [];
let currentQuestion = 0;
let quizScore = 0;

/* =====================================
   LESSON DATA
===================================== */

const lessons = [
  {
    id: 1,
    title: "English Alphabet",
    description: "Ingliz alifbosi va harflar talaffuzi.",
    content: `
      <h2>Lesson 1 — English Alphabet</h2>
      <p>Ingliz alifbosida 26 ta harf mavjud.</p>

      <h3>Capital and Small Letters</h3>
      <div class="lesson-box">
        <p><strong>A a</strong> — ey</p>
        <p><strong>B b</strong> — bi</p>
        <p><strong>C c</strong> — si</p>
        <p><strong>D d</strong> — di</p>
        <p><strong>E e</strong> — i</p>
        <p><strong>F f</strong> — ef</p>
        <p><strong>G g</strong> — ji</p>
        <p><strong>H h</strong> — eych</p>
        <p><strong>I i</strong> — ay</p>
        <p><strong>J j</strong> — jey</p>
        <p><strong>K k</strong> — key</p>
        <p><strong>L l</strong> — el</p>
        <p><strong>M m</strong> — em</p>
        <p><strong>N n</strong> — en</p>
        <p><strong>O o</strong> — ou</p>
        <p><strong>P p</strong> — pi</p>
        <p><strong>Q q</strong> — kyu</p>
        <p><strong>R r</strong> — ar</p>
        <p><strong>S s</strong> — es</p>
        <p><strong>T t</strong> — ti</p>
        <p><strong>U u</strong> — yu</p>
        <p><strong>V v</strong> — vi</p>
        <p><strong>W w</strong> — dabl-yu</p>
        <p><strong>X x</strong> — eks</p>
        <p><strong>Y y</strong> — way</p>
        <p><strong>Z z</strong> — zed / zi</p>
      </div>

      <h3>Vowels — Unli harflar</h3>
      <p>A, E, I, O, U</p>

      <h3>Consonants — Undosh harflar</h3>
      <p>Qolgan 21 ta harf undosh hisoblanadi.</p>

      <h3>Practice</h3>
      <p>Harflarni ovoz chiqarib takrorlang.</p>
      <p>A — Apple</p>
      <p>B — Book</p>
      <p>C — Cat</p>
      <p>D — Dog</p>
    `,
    questions: [
      M("Ingliz alifbosida nechta harf bor?", ["24", "26", "28"], 1),
      M("Qaysi biri unli harf?", ["B", "T", "A"], 2),
      M("E harfi qanday o‘qiladi?", ["i", "ey", "ar"], 0),
      M("B harfi qanday o‘qiladi?", ["bi", "si", "di"], 0),
      M("Qaysi biri undosh harf?", ["A", "E", "M"], 2)
    ]
  },

  {
    id: 2,
    title: "Greetings and Introductions",
    description: "Salomlashish va tanishish.",
    content: `
      <h2>Lesson 2 — Greetings and Introductions</h2>

      <h3>Greetings — Salomlashish</h3>
      <p><strong>Hello</strong> — Salom</p>
      <p><strong>Hi</strong> — Salom</p>
      <p><strong>Good morning</strong> — Xayrli tong</p>
      <p><strong>Good afternoon</strong> — Xayrli kun</p>
      <p><strong>Good evening</strong> — Xayrli kech</p>
      <p><strong>Good night</strong> — Xayrli tun</p>

      <h3>Useful Expressions — Foydali iboralar</h3>
      <p><strong>How are you?</strong> — Qalaysiz?</p>
      <p><strong>I'm fine.</strong> — Men yaxshiman.</p>
      <p><strong>Thank you.</strong> — Rahmat.</p>
      <p><strong>You're welcome.</strong> — Arzimaydi.</p>
      <p><strong>Goodbye.</strong> — Xayr.</p>
      <p><strong>See you.</strong> — Ko‘rishguncha.</p>

      <h3>Introducing Yourself</h3>
      <p><strong>What is your name?</strong> — Ismingiz nima?</p>
      <p><strong>My name is Ali.</strong> — Mening ismim Ali.</p>
      <p><strong>Where are you from?</strong> — Qayerdansiz?</p>
      <p><strong>I'm from Uzbekistan.</strong> — Men O‘zbekistondanman.</p>

      <h3>Dialogue — Suhbat</h3>
      <p><strong>A:</strong> Hello! How are you?</p>
      <p><strong>B:</strong> I'm fine, thank you. And you?</p>
      <p><strong>A:</strong> I'm good. What is your name?</p>
      <p><strong>B:</strong> My name is Ali.</p>
    `,
    questions: [
      M('"Good morning" tarjimasi nima?', ["Xayrli tun", "Xayrli tong", "Xayr"], 1),
      M('"Thank you" nimani anglatadi?', ["Rahmat", "Salom", "Xayr"], 0),
      M("\"What is your name?\" tarjimasi?", ["Qayerdansiz?", "Yoshingiz nechida?", "Ismingiz nima?"], 2),
      M('"I am fine" tarjimasi nima?', ["Men charchadim", "Men yaxshiman", "Men uydaman"], 1),
      M('"Goodbye" nimani anglatadi?', ["Xayr", "Rahmat", "Salom"], 0)
    ]
  },

  {
    id: 3,
    title: "Numbers and Colors",
    description: "Sonlar va ranglar.",
    content: `
      <h2>Lesson 3 — Numbers and Colors</h2>

      <h3>Numbers — Sonlar</h3>
      <p>One — Bir</p>
      <p>Two — Ikki</p>
      <p>Three — Uch</p>
      <p>Four — To‘rt</p>
      <p>Five — Besh</p>
      <p>Six — Olti</p>
      <p>Seven — Yetti</p>
      <p>Eight — Sakkiz</p>
      <p>Nine — To‘qqiz</p>
      <p>Ten — O‘n</p>
      <p>Eleven — O‘n bir</p>
      <p>Twelve — O‘n ikki</p>
      <p>Twenty — Yigirma</p>
      <p>Thirty — O‘ttiz</p>
      <p>One hundred — Bir yuz</p>

      <h3>Colors — Ranglar</h3>
      <p>Red — Qizil</p>
      <p>Blue — Ko‘k</p>
      <p>Green — Yashil</p>
      <p>Yellow — Sariq</p>
      <p>Black — Qora</p>
      <p>White — Oq</p>
      <p>Orange — To‘q sariq</p>
      <p>Pink — Pushti</p>
      <p>Purple — Binafsha</p>
      <p>Brown — Jigarrang</p>
      <p>Gray — Kulrang</p>

      <h3>Examples</h3>
      <p>I have two books. — Menda ikkita kitob bor.</p>
      <p>The apple is red. — Olma qizil.</p>
      <p>My bag is black. — Sumkam qora.</p>
    `,
    questions: [
      M('"Five" nechani anglatadi?', ["Uch", "Besh", "Yetti"], 1),
      M('"Ten" tarjimasi nima?', ["O‘n", "Yigirma", "O‘n ikki"], 0),
      M('"Red" qaysi rang?', ["Ko‘k", "Yashil", "Qizil"], 2),
      M('"White" tarjimasi nima?', ["Oq", "Qora", "Sariq"], 0),
      M('"Twenty" nechani anglatadi?', ["O‘n", "Yigirma", "O‘ttiz"], 1)
    ]
  },

  {
    id: 4,
    title: "Personal Pronouns",
    description: "Kishilik olmoshlari.",
    content: `
      <h2>Lesson 4 — Personal Pronouns</h2>

      <h3>Subject Pronouns — Kishilik olmoshlari</h3>
      <p><strong>I</strong> — Men</p>
      <p><strong>You</strong> — Sen / Siz</p>
      <p><strong>He</strong> — U (erkak)</p>
      <p><strong>She</strong> — U (ayol)</p>
      <p><strong>It</strong> — U (narsa yoki hayvon)</p>
      <p><strong>We</strong> — Biz</p>
      <p><strong>They</strong> — Ular</p>

      <h3>Examples — Misollar</h3>
      <p>I am a student. — Men o‘quvchiman.</p>
      <p>You are my friend. — Sen mening do‘stimsan.</p>
      <p>He is a teacher. — U o‘qituvchi.</p>
      <p>She is happy. — U xursand.</p>
      <p>It is a cat. — Bu mushuk.</p>
      <p>We are students. — Biz o‘quvchilarmiz.</p>
      <p>They are friends. — Ular do‘stlar.</p>

      <h3>Remember</h3>
      <p>I — faqat o‘zim haqimda.</p>
      <p>He — erkak kishi haqida.</p>
      <p>She — ayol kishi haqida.</p>
      <p>It — narsa yoki hayvon haqida.</p>
    `,
    questions: [
      M('"I" tarjimasi nima?', ["Men", "Sen", "Biz"], 0),
      M('"She" kimga nisbatan ishlatiladi?', ["Erkak", "Ayol", "Narsa"], 1),
      M('"We" tarjimasi nima?', ["Ular", "Siz", "Biz"], 2),
      M('"He" tarjimasi nima?', ["U (erkak)", "U (ayol)", "Men"], 0),
      M('"They" nimani anglatadi?', ["Biz", "Ular", "Siz"], 1)
    ]
  },

  {
    id: 5,
    title: "Verb To Be",
    description: "Am, is, are fe'llari.",
    content: `
      <h2>Lesson 5 — Verb To Be</h2>

      <h3>To Be — Bo‘lmoq</h3>
      <p>Ingliz tilida hozirgi zamonda to be fe'lining uch shakli bor: am, is, are.</p>

      <h3>AM</h3>
      <p>I am — Men ...man</p>
      <p>I am a student. — Men o‘quvchiman.</p>

      <h3>IS</h3>
      <p>He is — U ...</p>
      <p>She is — U ...</p>
      <p>It is — Bu ...</p>
      <p>He is happy. — U xursand.</p>
      <p>She is a teacher. — U o‘qituvchi.</p>

      <h3>ARE</h3>
      <p>You are — Sen/Siz ...</p>
      <p>We are — Biz ...</p>
      <p>They are — Ular ...</p>
      <p>We are friends. — Biz do‘stmiz.</p>

      <h3>Negative Form — Inkor shakli</h3>
      <p>I am not — Men emasman.</p>
      <p>He is not — U emas.</p>
      <p>They are not — Ular emas.</p>

      <h3>Questions — Savollar</h3>
      <p>Are you a student? — Siz o‘quvchimisiz?</p>
      <p>Is he your brother? — U akangizmi?</p>
      <p>Am I right? — Men haqmanmi?</p>
    `,
    questions: [
      M("I bilan qaysi shakl ishlatiladi?", ["Is", "Am", "Are"], 1),
      M("She bilan qaysi shakl ishlatiladi?", ["Are", "Am", "Is"], 2),
      M("They bilan qaysi shakl ishlatiladi?", ["Are", "Is", "Am"], 0),
      M('"I am a student" tarjimasi?', ["Men o‘qituvchiman", "Men o‘quvchiman", "U o‘quvchi"], 1),
      M("He ___ happy.", ["am", "are", "is"], 2)
    ]
  },
     {
    id: 6,
    title: "Nouns and Articles",
    description: "Otlar va a, an, the artikllari.",
    content: `
      <h2>Lesson 6 — Nouns and Articles</h2>

      <h3>Nouns — Otlar</h3>
      <p>Ot odam, joy, hayvon yoki narsaning nomini bildiradi.</p>
      <p>Book — Kitob</p>
      <p>Teacher — O‘qituvchi</p>
      <p>School — Maktab</p>
      <p>Cat — Mushuk</p>
      <p>House — Uy</p>

      <h3>A va An</h3>
      <p>A — undosh tovush bilan boshlanadigan birlikdagi sanaladigan otlar oldidan ishlatiladi.</p>
      <p>A book — Bitta kitob</p>
      <p>A car — Bitta mashina</p>
      <p>An — unli tovush bilan boshlanadigan birlikdagi sanaladigan otlar oldidan ishlatiladi.</p>
      <p>An apple — Bitta olma</p>
      <p>An egg — Bitta tuxum</p>

      <h3>The</h3>
      <p>The — aniq, ma'lum narsa haqida gapirganda ishlatiladi.</p>
      <p>The book is on the table. — Kitob stol ustida.</p>

      <h3>Examples</h3>
      <p>This is a pen. — Bu ruchka.</p>
      <p>It is an orange. — Bu apelsin.</p>
      <p>The door is open. — Eshik ochiq.</p>
    `,
    questions: [
      M('"Book" qanday so‘z turkumi?', ["Fe'l", "Ot", "Sifat"], 1),
      M("Qaysi biri to‘g‘ri?", ["A apple", "An apple", "The an apple"], 1),
      M('"A book" tarjimasi?', ["Bitta kitob", "Kitoblar", "Kitob o‘qimoq"], 0),
      M('"An" qachon ishlatiladi?', ["Har doim", "Unli tovush oldidan", "Faqat fe'l oldidan"], 1),
      M('"The" nimaga ishlatiladi?', ["Aniq narsaga", "Faqat odamlarga", "Faqat fe'llarga"], 0)
    ]
  },

  {
    id: 7,
    title: "This, That, These, Those",
    description: "Ko‘rsatish olmoshlari.",
    content: `
      <h2>Lesson 7 — This, That, These, Those</h2>

      <h3>This — Bu</h3>
      <p>Yaqindagi bitta narsa uchun.</p>
      <p>This is a book. — Bu kitob.</p>

      <h3>That — Ana u</h3>
      <p>Uzoqdagi bitta narsa uchun.</p>
      <p>That is a car. — Ana u mashina.</p>

      <h3>These — Bular</h3>
      <p>Yaqindagi bir nechta narsalar uchun.</p>
      <p>These are my books. — Bular mening kitoblarim.</p>

      <h3>Those — Ana ular</h3>
      <p>Uzoqdagi bir nechta narsalar uchun.</p>
      <p>Those are houses. — Ana ular uylar.</p>

      <h3>Remember</h3>
      <p>This — yaqin, birlik.</p>
      <p>That — uzoq, birlik.</p>
      <p>These — yaqin, ko‘plik.</p>
      <p>Those — uzoq, ko‘plik.</p>
    `,
    questions: [
      M("Yaqindagi bitta narsa uchun qaysi so‘z ishlatiladi?", ["That", "These", "This"], 2),
      M("Uzoqdagi bitta narsa uchun qaysi so‘z ishlatiladi?", ["That", "This", "These"], 0),
      M('"These" tarjimasi nima?', ["Ana u", "Bular", "Bu"], 1),
      M('"Those" tarjimasi nima?', ["Ana ular", "Bular", "Bu"], 0),
      M('"This is a book" tarjimasi?', ["Ana u kitob", "Bu kitob", "Bular kitoblar"], 1)
    ]
  },

  {
    id: 8,
    title: "Have and Has",
    description: "Egalikni ifodalash.",
    content: `
      <h2>Lesson 8 — Have and Has</h2>

      <h3>Have — Bor / Ega bo‘lmoq</h3>
      <p>I, You, We, They bilan have ishlatiladi.</p>
      <p>I have a book. — Menda kitob bor.</p>
      <p>You have a car. — Sizda mashina bor.</p>
      <p>We have a house. — Bizning uyimiz bor.</p>
      <p>They have a dog. — Ularning iti bor.</p>

      <h3>Has — Bor / Ega bo‘lmoq</h3>
      <p>He, She, It bilan has ishlatiladi.</p>
      <p>He has a brother. — Uning akasi bor.</p>
      <p>She has a sister. — Uning singlisi bor.</p>
      <p>It has a tail. — Uning dumi bor.</p>

      <h3>Negative Form — Inkor shakli</h3>
      <p>I do not have a car. — Menda mashina yo‘q.</p>
      <p>He does not have a car. — Unda mashina yo‘q.</p>

      <h3>Questions — Savollar</h3>
      <p>Do you have a book? — Sizda kitob bormi?</p>
      <p>Does she have a brother? — Uning akasi bormi?</p>
    `,
    questions: [
      M("I bilan have yoki has?", ["Have", "Has", "Is"], 0),
      M("He bilan qaysi biri ishlatiladi?", ["Have", "Has", "Are"], 1),
      M('"We have a house" tarjimasi?', ["Ularning uyi bor", "Bizning uyimiz bor", "Mening uyim bor"], 1),
      M("She ___ a sister.", ["have", "has", "are"], 1),
      M("They bilan qaysi biri ishlatiladi?", ["Has", "Is", "Have"], 2)
    ]
  },

  {
    id: 9,
    title: "There Is and There Are",
    description: "Mavjudlikni ifodalash.",
    content: `
      <h2>Lesson 9 — There Is and There Are</h2>

      <h3>There is — Bor</h3>
      <p>Bitta narsa haqida gapirganda ishlatiladi.</p>
      <p>There is a book on the table. — Stol ustida kitob bor.</p>
      <p>There is a cat in the room. — Xonada mushuk bor.</p>

      <h3>There are — Bor</h3>
      <p>Bir nechta narsalar haqida gapirganda ishlatiladi.</p>
      <p>There are two books. — Ikkita kitob bor.</p>
      <p>There are three students. — Uchta o‘quvchi bor.</p>

      <h3>Negative Form</h3>
      <p>There is not a pen. — Ruchka yo‘q.</p>
      <p>There are not any apples. — Olmalar yo‘q.</p>

      <h3>Questions</h3>
      <p>Is there a school here? — Bu yerda maktab bormi?</p>
      <p>Are there any books? — Kitoblar bormi?</p>
    `,
    questions: [
      M("Bitta narsa uchun qaysi shakl ishlatiladi?", ["There are", "There is", "They are"], 1),
      M("Ko‘plik uchun qaysi shakl ishlatiladi?", ["There is", "There am", "There are"], 2),
      M('"There is a book" tarjimasi?', ["Kitoblar bor", "Kitob bor", "Kitob yo‘q"], 1),
      M("There ___ two chairs.", ["is", "are", "am"], 1),
      M("There ___ a cat.", ["is", "are", "am"], 0)
    ]
  },

  {
    id: 10,
    title: "Present Simple",
    description: "Oddiy hozirgi zamon.",
    content: `
      <h2>Lesson 10 — Present Simple</h2>

      <h3>Present Simple nima?</h3>
      <p>Doimiy ishlar, odatlar va takrorlanadigan harakatlar uchun ishlatiladi.</p>

      <h3>Positive Form — Darak gap</h3>
      <p>I work every day. — Men har kuni ishlayman.</p>
      <p>You speak English. — Siz ingliz tilida gapirasiz.</p>
      <p>We live in Uzbekistan. — Biz O‘zbekistonda yashaymiz.</p>
      <p>They play football. — Ular futbol o‘ynashadi.</p>

      <h3>He, She, It</h3>
      <p>He, She, It bilan fe'lga odatda -s yoki -es qo‘shiladi.</p>
      <p>He works every day. — U har kuni ishlaydi.</p>
      <p>She reads a book. — U kitob o‘qiydi.</p>
      <p>He watches TV. — U televizor ko‘radi.</p>

      <h3>Negative Form — Inkor gap</h3>
      <p>I do not work. — Men ishlamayman.</p>
      <p>They do not play. — Ular o‘ynamaydilar.</p>
      <p>He does not work. — U ishlamaydi.</p>

      <h3>Questions — Savol gap</h3>
      <p>Do you speak English? — Siz ingliz tilida gapirasizmi?</p>
      <p>Does he work? — U ishlaydimi?</p>

      <h3>Time Expressions</h3>
      <p>Every day — Har kuni</p>
      <p>Always — Har doim</p>
      <p>Usually — Odatda</p>
      <p>Sometimes — Ba'zan</p>
      <p>Never — Hech qachon</p>
    `,
    questions: [
      M("Present Simple qachon ishlatiladi?", ["Odatlar va doimiy ishlar", "Faqat kecha bo‘lgan ishlar", "Faqat kelajak"], 0),
      M("He bilan fe'lga odatda nima qo‘shiladi?", ["-ing", "-s yoki -es", "-ed"], 1),
      M("I ___ every day.", ["works", "work", "working"], 1),
      M("She ___ English.", ["speak", "speaks", "speaking"], 1),
      M("Present Simple savolida I bilan nima ishlatiladi?", ["Does", "Do", "Is"], 1)
    ]
  }
];

/* =====================================
   QUESTION HELPER
===================================== */

function M(q, a, correct) {
  return { q, a, correct };
}

/* =====================================
   STORAGE
===================================== */

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed)
      ? parsed.filter(id => Number.isInteger(id) && id >= 1 && id <= 10)
      : [];
  } catch (error) {
    return [];
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
  } catch (error) {
    console.warn("Progress saqlanmadi:", error);
  }

  updateProgress();
}

function updateProgress() {
  const completed = completedLessons.length;
  const percentage = completed * 10;

  const homeBar = $("homeProgress");
  const beginnerBar = $("beginnerProgress");
  const progressBar = $("progressPageBar");

  if (homeBar) homeBar.style.width = percentage + "%";
  if (beginnerBar) beginnerBar.style.width = percentage + "%";
  if (progressBar) progressBar.style.width = percentage + "%";

  const text = `${completed} / 10 dars bajarildi`;

  if ($("homeProgressText")) $("homeProgressText").textContent = text;
  if ($("beginnerProgressText")) $("beginnerProgressText").textContent = text;
  if ($("progressPageText")) $("progressPageText").textContent = text;

  renderBeginnerLessons();
  renderProgressDetails();
}

/* =====================================
   PAGE NAVIGATION
===================================== */

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = $(pageId);

  if (page) {
    page.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  updateNavigation(pageId);
}

function updateNavigation(pageId) {
  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.remove("active");
  });

  const navButtons = document.querySelectorAll(".nav-btn");

  const pageIndexes = {
    homePage: 0,
    lessonsPage: 1,
    testsPage: 3,
    speakingPage: 4,
    progressPage: 5
  };

  const index = pageIndexes[pageId];

  if (index !== undefined && navButtons[index]) {
    navButtons[index].classList.add("active");
  }
}

function goHome() {
  showPage("homePage");
}

function openLessons() {
  showPage("lessonsPage");
}

function openBeginner() {
  renderBeginnerLessons();
  showPage("beginnerPage");
}

function openTests() {
  renderTestsPage();
  showPage("testsPage");
}

function openSpeaking() {
  showPage("speakingPage");
}

function openProgress() {
  updateProgress();
  showPage("progressPage");
}
/* =====================================
   BEGINNER LESSON LIST
===================================== */

function renderBeginnerLessons() {
  const container = $("beginnerLessonList");

  if (!container) return;

  container.innerHTML = lessons.map(lesson => {
    const completed = completedLessons.includes(lesson.id);

    return `
      <div class="lesson-card" onclick="openLesson(${lesson.id})">
        <div class="lesson-number">
          ${String(lesson.id).padStart(2, "0")}
        </div>
        <h3>${lesson.title}</h3>
        <p>${lesson.description}</p>
        <span>
          ${completed ? "✓ Dars bajarilgan" : "▶ Darsni boshlash"}
        </span>
      </div>
    `;
  }).join("");
}

/* =====================================
   OPEN LESSON
===================================== */

function openLesson(id) {
  const lesson = lessons.find(item => item.id === Number(id));

  if (!lesson) {
    showMessage("Dars topilmadi!");
    return;
  }

  currentLesson = lesson;

  const container = $("lessonContent");

  if (!container) return;

  container.innerHTML = `
    <div class="lesson-header">
      <h2>${lesson.title}</h2>
      <p>${lesson.description}</p>
      ${completedLessons.includes(lesson.id)
        ? '<span class="completed-label">✓ Bajarilgan</span>'
        : ""}
    </div>

    <div class="lesson-body">
      ${lesson.content}
    </div>

    <div class="lesson-actions">
      <button class="primary-btn" onclick="startLessonTest(${lesson.id})">
        📝 Dars testini boshlash
      </button>

      <button class="back-btn" onclick="openBeginner()">
        ← Darslar ro‘yxati
      </button>
    </div>
  `;

  showPage("lessonPage");
}

/* =====================================
   TESTS PAGE
===================================== */

function renderTestsPage() {
  const container = $("testsContent");

  if (!container) return;

  container.innerHTML = `
    <h2>Beginner Tests</h2>
    <p>O‘zingiz o‘rgangan darslar bo‘yicha testni tanlang.</p>

    <div class="lesson-list">
      ${lessons.map(lesson => `
        <div class="lesson-card" onclick="startLessonTest(${lesson.id})">
          <div class="lesson-number">
            ${String(lesson.id).padStart(2, "0")}
          </div>
          <h3>${lesson.title}</h3>
          <p>${lesson.questions.length} ta savol</p>
          <span>▶ Testni boshlash</span>
        </div>
      `).join("")}
    </div>

    <button class="primary-btn" onclick="startFinalTest()">
      🎓 Umumiy Beginner testi
    </button>
  `;
}

/* =====================================
   START TEST
===================================== */

function startLessonTest(id) {
  const lesson = lessons.find(item => item.id === Number(id));

  if (!lesson) return;

  currentLesson = lesson;
  currentQuiz = lesson.questions;
  currentQuestion = 0;
  quizScore = 0;

  showPage("lessonPage");
  renderQuestion();
}

function startFinalTest() {
  currentLesson = null;

  currentQuiz = lessons.flatMap(lesson =>
    lesson.questions.map(question => ({
      ...question,
      lessonTitle: lesson.title
    }))
  );

  currentQuestion = 0;
  quizScore = 0;

  showPage("lessonPage");
  renderQuestion();
}

/* =====================================
   SHOW QUESTION
===================================== */

function renderQuestion() {
  const container = $("lessonContent");

  if (!container) return;

  if (currentQuestion >= currentQuiz.length) {
    showQuizResult();
    return;
  }

  const question = currentQuiz[currentQuestion];

  container.innerHTML = `
    <div class="quiz-container">
      <h2>📝 Test</h2>

      <p>
        Savol ${currentQuestion + 1} / ${currentQuiz.length}
      </p>

      <div class="progress-track">
        <div class="progress-fill"
          style="width:${((currentQuestion + 1) / currentQuiz.length) * 100}%">
        </div>
      </div>

      <h3>${question.q}</h3>

      <div class="quiz-options">
        ${question.a.map((answer, index) => `
          <button
            class="quiz-option"
            onclick="answerQuestion(${index})">
            ${answer}
          </button>
        `).join("")}
      </div>

      <p id="quizFeedback"></p>
    </div>
  `;
}

/* =====================================
   ANSWER QUESTION
===================================== */

function answerQuestion(answerIndex) {
  const question = currentQuiz[currentQuestion];

  if (!question) return;

  const buttons = document.querySelectorAll(".quiz-option");

  buttons.forEach(button => {
    button.disabled = true;
  });

  const feedback = $("quizFeedback");

  if (answerIndex === question.correct) {
    quizScore++;

    if (feedback) {
      feedback.textContent = "✓ To‘g‘ri javob!";
      feedback.style.color = "green";
    }
  } else {
    if (feedback) {
      feedback.textContent =
        "✗ Noto‘g‘ri. To‘g‘ri javob: " +
        question.a[question.correct];

      feedback.style.color = "red";
    }
  }

  const nextButton = document.createElement("button");

  nextButton.className = "primary-btn";
  nextButton.textContent =
    currentQuestion + 1 === currentQuiz.length
      ? "Natijani ko‘rish"
      : "Keyingi savol →";

  nextButton.onclick = () => {
    currentQuestion++;
    renderQuestion();
  };

  if (feedback) {
    feedback.insertAdjacentElement("afterend", nextButton);
  }
}

/* =====================================
   TEST RESULT
===================================== */

function showQuizResult() {
  const container = $("lessonContent");

  if (!container) return;

  const total = currentQuiz.length;
  const percentage = Math.round((quizScore / total) * 100);
  const passed = percentage >= 80;

  if (passed && currentLesson) {
    if (!completedLessons.includes(currentLesson.id)) {
      completedLessons.push(currentLesson.id);
      saveProgress();
    }
  }

  container.innerHTML = `
    <div class="quiz-result">
      <h2>${passed ? "🎉 Tabriklaymiz!" : "📚 Yana mashq qiling!"}</h2>

      <h3>Test natijasi</h3>

      <div class="result-score">
        ${quizScore} / ${total}
      </div>

      <h2>${percentage}%</h2>

      <p>
        ${passed
          ? "Testdan muvaffaqiyatli o‘tdingiz!"
          : "Testdan o‘tish uchun kamida 80% natija kerak."}
      </p>

      <div class="lesson-actions">
        <button class="primary-btn" onclick="openBeginner()">
          Beginner darslariga qaytish
        </button>

        <button class="back-btn" onclick="openTests()">
          Boshqa testlar
        </button>

        <button class="back-btn" onclick="retryCurrentTest()">
          Qayta ishlash
        </button>
      </div>
    </div>
  `;
}

function retryCurrentTest() {
  if (currentLesson) {
    startLessonTest(currentLesson.id);
  } else {
    startFinalTest();
  }
}

/* =====================================
   PROGRESS DETAILS
===================================== */

function renderProgressDetails() {
  const container = $("progressDetails");

  if (!container) return;

  const completed = completedLessons.length;
  const remaining = 10 - completed;

  container.innerHTML = `
    <h3>📊 Sizning natijalaringiz</h3>

    <p>Bajarilgan darslar: <strong>${completed}</strong></p>
    <p>Qolgan darslar: <strong>${remaining}</strong></p>
    <p>Umumiy natija: <strong>${completed * 10}%</strong></p>

    <h3>Beginner darslari</h3>

    ${lessons.map(lesson => `
      <p>
        ${completedLessons.includes(lesson.id) ? "✓" : "○"}
        ${lesson.id}. ${lesson.title}
        ${completedLessons.includes(lesson.id) ? " — Bajarilgan" : " — Tugallanmagan"}
      </p>
    `).join("")}
  `;
}

/* =====================================
   MESSAGE
===================================== */

let messageTimeout = null;

function showMessage(message) {
  const box = $("message");

  if (!box) {
    alert(message);
    return;
  }

  box.textContent = message;
  box.classList.add("show");

  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }

  messageTimeout = setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}

/* =====================================
   INITIALIZATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderBeginnerLessons();
  updateProgress();

  const activePage = document.querySelector(".page.active");

  if (activePage) {
    updateNavigation(activePage.id);
  }
});
