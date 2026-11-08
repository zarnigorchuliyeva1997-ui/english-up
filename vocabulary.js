
const $ = (id) => document.getElementById(id);

const levels = [
  { id: "beginner", name: "Beginner", total: 1000, daily: 30 },
  { id: "elementary", name: "Elementary", total: 2000 },
  { id: "pre", name: "Pre-Intermediate", total: 2000 },
  { id: "intermediate", name: "Intermediate", total: 2000 },
  { id: "upper", name: "Upper-Intermediate", total: 2000 },
  { id: "ielts", name: "IELTS", total: 2000 }
];

// Hozircha namuna so'zlar.
// Keyingi bosqichlarda har bir darajaga alohida,
// takrorlanmaydigan katta lug'at bazasi qo'shiladi.
const vocabulary = {
  beginner: [
    ["apple", "Olma", "ˈæp.əl", "I eat an apple.", "Men olma yeyman.", "noun"],
    ["book", "Kitob", "bʊk", "This is my book.", "Bu mening kitobim.", "noun"],
    ["water", "Suv", "ˈwɔː.tər", "I drink water.", "Men suv ichaman.", "noun"],
    ["house", "Uy", "haʊs", "My house is big.", "Mening uyim katta.", "noun"],
    ["friend", "Do'st", "frend", "He is my friend.", "U mening do'stim.", "noun"],
    ["family", "Oila", "ˈfæm.əl.i", "I love my family.", "Men oilamni yaxshi ko'raman.", "noun"],
    ["school", "Maktab", "skuːl", "Children go to school.", "Bolalar maktabga boradi.", "noun"],
    ["food", "Ovqat", "fuːd", "The food is good.", "Ovqat yaxshi.", "noun"],
    ["mother", "Ona", "ˈmʌð.ər", "My mother is kind.", "Onam mehribon.", "noun"],
    ["father", "Ota", "ˈfɑː.ðər", "My father works.", "Otam ishlaydi.", "noun"],
    ["go", "Bormoq", "ɡəʊ", "I go to work.", "Men ishga boraman.", "verb"],
    ["come", "Kelmoq", "kʌm", "Come here, please.", "Iltimos, bu yerga kel.", "verb"],
    ["eat", "Yemoq", "iːt", "We eat dinner.", "Biz kechki ovqat yeymiz.", "verb"],
    ["drink", "Ichmoq", "drɪŋk", "Drink some water.", "Biroz suv ich.", "verb"],
    ["read", "O'qimoq", "riːd", "I read every day.", "Men har kuni o'qiyman.", "verb"],
    ["write", "Yozmoq", "raɪt", "Write your name.", "Ismingizni yozing.", "verb"],
    ["work", "Ishlamoq", "wɜːk", "They work together.", "Ular birga ishlaydi.", "verb"],
    ["learn", "O'rganmoq", "lɜːn", "I learn English.", "Men ingliz tilini o'rganaman.", "verb"],
    ["speak", "Gapirmoq", "spiːk", "Speak slowly, please.", "Iltimos, sekin gapiring.", "verb"],
    ["help", "Yordam bermoq", "help", "Can you help me?", "Menga yordam bera olasizmi?", "verb"]
  ],

  elementary: [
    ["advice", "Maslahat", "ədˈvaɪs", "She gave me good advice.", "U menga yaxshi maslahat berdi.", "noun"],
    ["journey", "Sayohat", "ˈdʒɜː.ni", "Our journey was long.", "Sayohatimiz uzoq bo'ldi.", "noun"],
    ["decision", "Qaror", "dɪˈsɪʒ.ən", "It was a difficult decision.", "Bu qiyin qaror edi.", "noun"],
    ["experience", "Tajriba", "ɪkˈspɪə.ri.əns", "I have work experience.", "Menda ish tajribasi bor.", "noun"],
    ["improve", "Yaxshilamoq", "ɪmˈpruːv", "I want to improve my English.", "Ingliz tilimni yaxshilamoqchiman.", "verb"],
    ["explain", "Tushuntirmoq", "ɪkˈspleɪn", "Please explain this rule.", "Iltimos, bu qoidani tushuntiring.", "verb"],
    ["prepare", "Tayyorlanmoq", "prɪˈpeər", "We prepare for the exam.", "Biz imtihonga tayyorlanamiz.", "verb"],
    ["suggest", "Taklif qilmoq", "səˈdʒest", "I suggest another idea.", "Men boshqa fikrni taklif qilaman.", "verb"]
  ],

  pre: [
    ["achievement", "Yutuq", "əˈtʃiːv.mənt", "This is a great achievement.", "Bu katta yutuq.", "noun"],
    ["responsibility", "Mas'uliyat", "rɪˌspɒn.səˈbɪl.ə.ti", "Responsibility is important.", "Mas'uliyat muhim.", "noun"],
    ["opportunity", "Imkoniyat", "ˌɒp.əˈtʃuː.nə.ti", "This is a good opportunity.", "Bu yaxshi imkoniyat.", "noun"],
    ["environment", "Atrof-muhit", "ɪnˈvaɪ.rən.mənt", "We must protect the environment.", "Biz atrof-muhitni himoya qilishimiz kerak.", "noun"],
    ["consider", "Ko'rib chiqmoq", "kənˈsɪd.ər", "Consider all the options.", "Barcha variantlarni ko'rib chiqing.", "verb"],
    ["encourage", "Ruhlantirmoq", "ɪnˈkʌr.ɪdʒ", "Teachers encourage students.", "O'qituvchilar o'quvchilarni ruhlantiradi.", "verb"]
  ],

  intermediate: [
    ["consequence", "Oqibat", "ˈkɒn.sɪ.kwəns", "Every choice has a consequence.", "Har bir tanlovning oqibati bor.", "noun"],
    ["perspective", "Nuqtayi nazar", "pəˈspek.tɪv", "Try to see another perspective.", "Boshqa nuqtayi nazardan qarashga harakat qiling.", "noun"],
    ["maintain", "Saqlab turmoq", "meɪnˈteɪn", "Maintain a healthy lifestyle.", "Sog'lom turmush tarzini saqlang.", "verb"],
    ["overcome", "Yengib o'tmoq", "ˌəʊ.vəˈkʌm", "We can overcome difficulties.", "Biz qiyinchiliklarni yengib o'ta olamiz.", "verb"]
  ],

  upper: [
    ["sustainability", "Barqarorlik", "səˌsteɪ.nəˈbɪl.ə.ti", "Sustainability matters worldwide.", "Barqarorlik butun dunyoda muhim.", "noun"],
    ["inequality", "Tengsizlik", "ˌɪn.ɪˈkwɒl.ə.ti", "Inequality affects society.", "Tengsizlik jamiyatga ta'sir qiladi.", "noun"],
    ["undermine", "Zaiflashtirmoq", "ˌʌn.dəˈmaɪn", "Poor planning can undermine progress.", "Yomon rejalashtirish taraqqiyotni zaiflashtirishi mumkin.", "verb"],
    ["allocate", "Taqsimlamoq", "ˈæl.ə.keɪt", "The school allocates more resources.", "Maktab ko'proq resurs ajratadi.", "verb"]
  ],

  ielts: [
    ["mitigate", "Salbiy ta'sirni kamaytirmoq", "ˈmɪt.ɪ.ɡeɪt", "Governments should mitigate pollution.", "Hukumatlar ifloslanishni kamaytirishi kerak.", "verb"],
    ["pervasive", "Keng tarqalgan", "pəˈveɪ.sɪv", "Technology has a pervasive influence.", "Texnologiya keng ta'sirga ega.", "adjective"],
    ["exacerbate", "Yanada og'irlashtirmoq", "ɪɡˈzæs.ə.beɪt", "Stress can exacerbate health problems.", "Stress sog'liq muammolarini kuchaytirishi mumkin.", "verb"],
    ["disparity", "Nomutanosiblik", "dɪˈspær.ə.ti", "There is a disparity in income.", "Daromadlarda nomutanosiblik bor.", "noun"]
  ]
};

const state = {
  level: null,
  type: null,
  goal: 30,
  day: 1,
  index: 0,
  words: [],
  questions: [],
  questionIndex: 0,
  score: 0,
  answered: false,
  favorites: JSON.parse(localStorage.getItem("euFavorites") || "[]"),
  progress: JSON.parse(localStorage.getItem("euVocabProgress") || "{}")
};

function saveData() {
  localStorage.setItem("euFavorites", JSON.stringify(state.favorites));
  localStorage.setItem("euVocabProgress", JSON.stringify(state.progress));
}

function showSection(id) {
  const sections = [
    "levelSection", "typeSection", "planSection",
    "learningSection", "generalSection", "testSection",
    "resultSection", "favoritesSection", "progressSection"
  ];

  sections.forEach(section => $(section).classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getWords(level) {
  return vocabulary[level] || [];
}

function renderLevels() {
  $("levelList").innerHTML = levels.map(level => `
    <button class="level-card" data-level="${level.id}">
      <h3>${level.name}</h3>
      <p>${level.total.toLocaleString()} planned words</p>
    </button>
  `).join("");

  document.querySelectorAll("[data-level]").forEach(button => {
    button.addEventListener("click", () => selectLevel(button.dataset.level));
  });
}

function selectLevel(id) {
  state.level = id;
  const level = levels.find(item => item.id === id);

  $("selectedLevelTitle").textContent = level.name;
  $("generalCount").textContent = `${level.total.toLocaleString()} planned words`;
  showSection("typeSection");
}

document.querySelectorAll("[data-type]").forEach(button => {
  button.addEventListener("click", () => {
    state.type = button.dataset.type;

    if (state.type === "general") {
      renderGeneral();
      showSection("generalSection");
    } else {
      state.goal = state.level === "beginner" ? 30 : 30;
      document.querySelectorAll(".goal-btn").forEach(btn => {
        btn.classList.toggle("active", Number(btn.dataset.goal) === state.goal);
      });
      updatePlanInfo();
      $("startPlan").disabled = false;
      showSection("planSection");
    }
  });
});

function updatePlanInfo() {
  const level = levels.find(item => item.id === state.level);
  const goal = state.goal;
  const days = Math.ceil(level.total / goal);

  $("planInfo").innerHTML =
    `📚 Jami: <strong>${level.total.toLocaleString()}</strong> ta so'z<br>` +
    `🎯 Kunlik maqsad: <strong>${goal}</strong> ta so'z<br>` +
    `📅 Taxminiy muddat: <strong>${days} kun</strong>`;
}

document.querySelectorAll(".goal-btn").forEach(button => {
  button.addEventListener("click", () => {
    state.goal = Number(button.dataset.goal);
    document.querySelectorAll(".goal-btn").forEach(btn => {
      btn.classList.toggle("active", btn === button);
    });
    updatePlanInfo();
  });
});

$("startPlan").addEventListener("click", () => {
  const key = `${state.level}_daily`;
  const saved = state.progress[key] || { day: 1, passed: [] };

  state.day = saved.day;
  state.index = 0;
  loadDailyWords();
});

function loadDailyWords() {
  const all = getWords(state.level);
  const start = (state.day - 1) * state.goal;

  state.words = all.slice(start, start + state.goal);

  if (!state.words.length) {
    alert("Bu daraja uchun hozircha yangi so'zlar qo'shilmagan.");
    showSection("typeSection");
    return;
  }

  $("dayLabel").textContent = `DAY ${state.day}`;
  renderWord();
  showSection("learningSection");
}

function renderWord() {
  const word = state.words[state.index];

  $("wordNumber").textContent = `WORD ${state.index + 1}`;
  $("wordCounter").textContent = `${state.index + 1} / ${state.words.length}`;
  $("englishWord").textContent = word[0];
  $("uzbekWord").textContent = word[1];
  $("wordExample").textContent = word[3];
  $("exampleTranslation").textContent = word[4];

  $("learningProgress").style.width =
    `${((state.index + 1) / state.words.length) * 100}%`;

  const isFavorite = state.favorites.some(item =>
    item[0] === word[0] && item[1] === state.level
  );

  $("favoriteBtn").textContent = isFavorite ? "★ Favorite" : "☆ Favorite";
  $("previousWord").disabled = state.index === 0;
  $("nextWord").textContent =
    state.index === state.words.length - 1 ? "Take Test" : "Next";
}

$("pronunciationBtn").addEventListener("click", () => {
  const word = state.words[state.index];
  if (!("speechSynthesis" in window)) {
    alert("Audio bu brauzerda ishlamaydi.");
    return;
  }

  const speech = new SpeechSynthesisUtterance(word[0]);
  speech.lang = "en-US";
  speech.rate = 0.8;
  speechSynthesis.cancel();
  speechSynthesis.speak(speech);
});

$("favoriteBtn").addEventListener("click", () => {
  const word = state.words[state.index];
  const index = state.favorites.findIndex(item =>
    item[0] === word[0] && item[1] === state.level
  );

  if (index >= 0) {
    state.favorites.splice(index, 1);
  } else {
    state.favorites.push([...word, state.level]);
  }

  saveData();
  renderWord();
});

$("previousWord").addEventListener("click", () => {
  if (state.index > 0) {
    state.index--;
    renderWord();
  }
});

$("nextWord").addEventListener("click", () => {
  if (state.index < state.words.length - 1) {
    state.index++;
    renderWord();
  } else {
    startTest();
  }
});

function renderGeneral() {
  const words = getWords(state.level);
  $("generalTitle").textContent =
    `${levels.find(item => item.id === state.level).name} — General Vocabulary`;

  $("wordSearch").value = "";
  displayGeneralWords(words);
}

function displayGeneralWords(words) {
  $("generalWordList").innerHTML = words.length
    ? words.map(word => `
      <div class="word-item">
        <strong>${word[0]}</strong>
        <p>${word[1]} · ${word[2]}</p>
        <p>${word[3]}</p>
        <p>${word[4]}</p>
      </div>
    `).join("")
    : "<p>Hozircha so'zlar qo'shilmagan.</p>";
}

$("wordSearch").addEventListener("input", event => {
  const query = event.target.value.toLowerCase().trim();

  const filtered = getWords(state.level).filter(word =>
    word[0].toLowerCase().includes(query) ||
    word[1].toLowerCase().includes(query)
  );

  displayGeneralWords(filtered);
});

function startTest() {
  state.questions = [...state.words].sort(() => Math.random() - 0.5);
  state.questionIndex = 0;
  state.score = 0;
  state.answered = false;
  renderQuestion();
  showSection("testSection");
}

function renderQuestion() {
  const word = state.questions[state.questionIndex];

  $("testProgress").textContent =
    `Question ${state.questionIndex + 1} / ${state.questions.length}`;

  $("testQuestion").textContent = word[0];
  $("testFeedback").textContent = "";
  $("nextQuestion").classList.add("hidden");
  state.answered = false;

  const otherWords = getWords(state.level)
    .filter(item => item[0] !== word[0])
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [...otherWords, word].sort(() => Math.random() - 0.5);

  $("testOptions").innerHTML = options.map(option => `
    <button class="test-option" data-answer="${option[0]}">
      ${option[1]}
    </button>
  `).join("");

  document.querySelectorAll(".test-option").forEach(button => {
    button.addEventListener("click", () => checkAnswer(button, word));
  });
}

function checkAnswer(button, correctWord) {
  if (state.answered) return;
  state.answered = true;

  const correct = button.dataset.answer === correctWord[0];

  if (correct) {
    state.score++;
    $("testFeedback").textContent = "✅ Correct!";
  } else {
    $("testFeedback").textContent =
      `❌ Correct answer: ${correctWord[1]}`;
  }

  document.querySelectorAll(".test-option").forEach(option => {
    option.disabled = true;

    if (option.dataset.answer === correctWord[0]) {
      option.classList.add("correct");
    } else if (option === button) {
      option.classList.add("wrong");
    }
  });

  $("nextQuestion").classList.remove("hidden");
  $("nextQuestion").textContent =
    state.questionIndex === state.questions.length - 1
      ? "See Result"
      : "Next Question";
}

$("nextQuestion").addEventListener("click", () => {
  state.questionIndex++;

  if (state.questionIndex < state.questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  const total = state.questions.length;
  const percent = Math.round((state.score / total) * 100);
  const passed = percent >= 80;

  $("resultPercent").textContent = `${percent}%`;
  $("resultMessage").textContent = passed
    ? "🎉 Excellent! You passed."
    : "📖 Keep practising. You can try again.";
  $("resultDetails").textContent =
    `${state.score} correct answers out of ${total}.`;

  const key = `${state.level}_daily`;

  if (!state.progress[key]) {
    state.progress[key] = { day: 1, passed: [] };
  }

  if (passed) {
    if (!state.progress[key].passed.includes(state.day)) {
      state.progress[key].passed.push(state.day);
    }

    state.progress[key].day = Math.max(
      state.progress[key].day,
      state.day + 1
    );
  }

  saveData();

  $("continueLearning").classList.toggle("hidden", !passed);
  showSection("resultSection");
}

$("retryTest").addEventListener("click", startTest);

$("continueLearning").addEventListener("click", () => {
  state.day++;
  state.index = 0;
  loadDailyWords();
});

function renderFavorites() {
  $("favoriteWordList").innerHTML = state.favorites.length
    ? state.favorites.map(word => `
      <div class="word-item">
        <strong>${word[0]}</strong>
        <p>${word[1]}</p>
        <p>${word[3]}</p>
      </div>
    `).join("")
    : "<p>Hozircha sevimli so'zlar yo'q.</p>";
}

function renderProgress() {
  let html = "";

  levels.forEach(level => {
    const data = state.progress[`${level.id}_daily`] || {
      day: 1,
      passed: []
    };

    html += `
      <div class="word-item">
        <strong>${level.name}</strong>
        <p>Ochilgan kun: ${data.day}</p>
        <p>O'tilgan kunlar: ${data.passed.length}</p>
      </div>
    `;
  });

  $("progressContent").innerHTML = html;
}

$("homeNav").addEventListener("click", () => showSection("levelSection"));

$("favoritesNav").addEventListener("click", () => {
  renderFavorites();
  showSection("favoritesSection");
});

$("progressNav").addEventListener("click", () => {
  renderProgress();
  showSection("progressSection");
});

$("backToLevels").addEventListener("click", () => showSection("levelSection"));
$("backToTypes").addEventListener("click", () => showSection("typeSection"));
$("backToPlan").addEventListener("click", () => showSection("planSection"));
$("backFromGeneral").addEventListener("click", () => showSection("typeSection"));
$("backFromFavorites").addEventListener("click", () => showSection("levelSection"));
$("backFromProgress").addEventListener("click", () => showSection("levelSection"));

$("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");
  $("themeToggle").textContent = dark ? "🌙" : "☀️";

  localStorage.setItem("euVocabTheme", dark ? "dark" : "light");
});

if (localStorage.getItem("euVocabTheme") === "dark") {
  document.body.classList.add("dark");
  $("themeToggle").textContent = "🌙";
}

renderLevels();
showSection("levelSection");

