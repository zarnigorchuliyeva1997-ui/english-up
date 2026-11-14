// ==========================================
// DARAJALARNI BOSHQARISH TIZIMI (TOZA KOD)
// ==========================================
let currentLevel = 'beginner';
let allWords = [];
let currentWordsPerDay = 30;

const levelsConfig = [
    { id: "beginner", title: "Beginner", desc: "Boshlang'ich daraja", wordsPerDay: 30, varName: "beginnerWords" },
    { id: "elementary", title: "Elementary", desc: "Keyingi daraja", wordsPerDay: 25, varName: "elementaryWords" },
    { id: "pre-intermediate", title: "Pre-Intermediate", desc: "O'rta daraja", wordsPerDay: 25, varName: "preIntermediateWords" },
    { id: "intermediate", title: "Intermediate", desc: "O'rta daraja", wordsPerDay: 25, varName: "intermediateWords" },
    { id: "upper-intermediate", title: "Upper-Intermediate", desc: "Yuqori daraja", wordsPerDay: 25, varName: "upperIntermediateWords" },
    { id: "ielts", title: "IELTS", desc: "IELTS lug'ati", wordsPerDay: 25, varName: "ieltsWords" }
];

const levelSection = document.getElementById('levelSection');
const planSection = document.getElementById('planSection');
const learningSection = document.getElementById('learningSection');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');
const synonymSection = document.getElementById('synonymSection'); // YANGI

let currentDay = 1;
let currentWordIndex = 0;
let dayWords = [];
let testQuestions = [];
let testIndex = 0;
let correctAnswersCount = 0;
let userProgress = { unlockedDay: 1, completedDays: [] };
const TOTAL_DAYS = 40;

// ==========================================
// SO'ZLARNI O'QISH
// ==========================================
function getWordsArray(varName) {
    try {
        if (varName === "beginnerWords" && typeof window.beginnerWords !== 'undefined') {
            return window.beginnerWords.map(w => ({
                en: w.en || w.word, 
                uz: w.uz, 
                example: w.example || "", 
                exUz: w.exUz || w.translation || w.uz
            }));
        }
        if (typeof window[varName] !== 'undefined') return window[varName];
        return [];
    } catch (e) { 
        return []; 
    }
}

function generatePlanWords(baseWords, wordsPerDay) {
    if (!baseWords || baseWords.length === 0) return [];
    let finalWords = [...baseWords];
    let targetCount = 40 * wordsPerDay; 
    while (finalWords.length < targetCount) {
        let randomIndex = Math.floor(Math.random() * baseWords.length);
        let bWord = baseWords[randomIndex];
        finalWords.push({
            en: bWord.en + " (" + finalWords.length + ")", 
            uz: bWord.uz + " (qo'shimcha)", 
            example: bWord.example, 
            exUz: bWord.exUz
        });
    }
    return finalWords.slice(0, targetCount);
}

// ==========================================
// DARAJALARNI EKRANGA CHIQARISH
// ==========================================
document.getElementById('levelList').innerHTML = levelsConfig.map(lvl => {
    const words = getWordsArray(lvl.varName);
    return `<button class="level-card" onclick="selectLevel('${lvl.id}')">
        <h3>${lvl.title}</h3><p>${lvl.desc}</p><span>${words.length} ta so'z mavjud</span>
    </button>`;
}).join('');

function selectLevel(levelId) {
    currentLevel = levelId;
    const levelData = levelsConfig.find(l => l.id === levelId);
    const baseWords = getWordsArray(levelData.varName);
    
    if (baseWords.length === 0) { 
        alert("Bu daraja uchun so'zlar hali kiritilmagan."); 
        return; 
    }

    currentWordsPerDay = levelData.wordsPerDay; 
    allWords = generatePlanWords(baseWords, currentWordsPerDay);
    
    let saved = localStorage.getItem(`englishUpProgress_${levelId}`);
    userProgress = saved ? JSON.parse(saved) : { unlockedDay: 1, completedDays: [] };
    
    levelSection.classList.add('hidden');
    planSection.classList.remove('hidden');
    document.getElementById('planLevelTitle').textContent = `${levelData.title} - 40 Kunlik Reja`;
    renderDays();
}

document.getElementById('backToLevels').addEventListener('click', () => {
    planSection.classList.add('hidden'); 
    levelSection.classList.remove('hidden');
});

// ==========================================
// 40 KUNLIK REJA
// ==========================================
function renderDays() {
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';
    for (let i = 1; i <= TOTAL_DAYS; i++) {
        const isUnlocked = i <= userProgress.unlockedDay;
        const isCompleted = userProgress.completedDays.includes(i);
        let statusClass = isCompleted ? 'completed' : (isUnlocked ? '' : 'locked');
        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${statusClass}`;
        dayCard.innerHTML = `<span>${i}-kun</span>`;
        if (isUnlocked) dayCard.addEventListener('click', () => startDay(i));
        daysGrid.appendChild(dayCard);
    }
    const percent = (userProgress.completedDays.length / TOTAL_DAYS) * 100;
    document.getElementById('planProgress').style.width = percent + '%';
    document.getElementById('planProgressText').textContent = `${userProgress.completedDays.length} / ${TOTAL_DAYS} kun bajarildi`;
}

// ==========================================
// KUNNI BOSHLASH VA SO'ZLAR
// ==========================================
function startDay(day) {
    currentDay = day; 
    currentWordIndex = 0;
    const startIndex = (day - 1) * currentWordsPerDay;
    dayWords = allWords.slice(startIndex, startIndex + currentWordsPerDay);
    planSection.classList.add('hidden'); 
    learningSection.classList.remove('hidden');
    showWord();
}

document.getElementById('backToPlan').addEventListener('click', () => {
    learningSection.classList.add('hidden'); 
    planSection.classList.remove('hidden'); 
    renderDays(); 
});

function showWord() {
    const word = dayWords[currentWordIndex];
    document.getElementById('dayLabel').textContent = `DAY ${currentDay}`;
    document.getElementById('wordNumber').textContent = `WORD ${currentWordIndex + 1}`;
    document.getElementById('englishWord').textContent = word.en;
    document.getElementById('uzbekWord').textContent = word.uz;
    document.getElementById('wordExample').textContent = word.example;
    document.getElementById('exampleTranslation').textContent = word.exUz;
    document.getElementById('wordCounter').textContent = `${currentWordIndex + 1} / ${dayWords.length}`;
    document.getElementById('learningProgress').style.width = ((currentWordIndex + 1) / dayWords.length) * 100 + '%';
    document.getElementById('previousWord').disabled = currentWordIndex === 0;
    document.getElementById('nextWord').textContent = (currentWordIndex === dayWords.length - 1) ? "Start Test 🚀" : "Next →";
}

document.getElementById('pronunciationBtn').addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(document.getElementById('englishWord').textContent);
    utterance.lang = 'en-US'; 
    speechSynthesis.speak(utterance);
});

document.getElementById('nextWord').addEventListener('click', () => {
    if (currentWordIndex < dayWords.length - 1) { 
        currentWordIndex++; 
        showWord(); 
    } else { 
        startTest(); 
    }
});

document.getElementById('previousWord').addEventListener('click', () => {
    if (currentWordIndex > 0) { 
        currentWordIndex--; 
        showWord(); 
    }
});

// ==========================================
// TEST MANTIQI
// ==========================================
function startTest() {
    learningSection.classList.add('hidden'); 
    testSection.classList.remove('hidden');
    testQuestions = dayWords.map(word => {
        let options = [word.uz];
        while (options.length < 4) {
            let rWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!options.includes(rWord.uz)) options.push(rWord.uz);
        }
        options.sort(() => Math.random() - 0.5);
        return { question: word.en, correctAnswer: word.uz, options: options };
    });
    testIndex = 0; 
    correctAnswersCount = 0; 
    showTestQuestion();
}

function showTestQuestion() {
    if (testIndex >= testQuestions.length) { 
        finishTest(); 
        return; 
    }
    const q = testQuestions[testIndex];
    document.getElementById('testProgress').textContent = `Savol ${testIndex + 1} / ${testQuestions.length}`;
    document.getElementById('testQuestion').textContent = q.question;
    const feedback = document.getElementById('testFeedback');
    if (feedback) { 
        feedback.textContent = ''; 
        feedback.style.color = ''; 
    }
    document.getElementById('nextQuestion').classList.add('hidden');
    const optionsDiv = document.getElementById('testOptions'); 
    optionsDiv.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; 
        btn.textContent = opt;
        btn.onclick = () => checkTestAnswer(btn, opt, q.correctAnswer);
        optionsDiv.appendChild(btn);
    });
}

function checkTestAnswer(btn, selected, correct) {
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    const feedback = document.getElementById('testFeedback');
    if (selected === correct) {
        btn.classList.add('correct'); 
        correctAnswersCount++;
        if (feedback) { 
            feedback.textContent = "To'g'ri! ✅"; 
            feedback.style.color = "green"; 
        }
    } else {
        btn.classList.add('wrong');
        if (feedback) { 
            feedback.textContent = `Xato! To'g'ri javob: ${correct} ❌`; 
            feedback.style.color = "red"; 
        }
        document.querySelectorAll('.option-btn').forEach(b => { 
            if (b.textContent === correct) b.classList.add('correct'); 
        });
    }
    document.getElementById('nextQuestion').classList.remove('hidden');
}

document.getElementById('nextQuestion').addEventListener('click', () => { 
    testIndex++; 
    showTestQuestion(); 
});

// ==========================================
// NATIJA VA KEYINGI KUN
// ==========================================
function finishTest() {
    testSection.classList.add('hidden'); 
    resultSection.classList.remove('hidden');
    const percent = Math.round((correctAnswersCount / testQuestions.length) * 100);
    document.getElementById('resultPercent').textContent = `${percent}%`;
    document.getElementById('resultDetails').textContent = `${correctAnswersCount} ta to'g'ri, ${testQuestions.length - correctAnswersCount} ta xato.`;
    const continueBtn = document.getElementById('continueLearning');
    const retryBtn = document.getElementById('retryTest');
    
    if (percent >= 80) {
        document.getElementById('resultMessage').textContent = "Ajoyib! Siz testdan o'tdingiz.";
        document.getElementById('resultMessage').style.color = "green";
        if (!userProgress.completedDays.includes(currentDay)) {
            userProgress.completedDays.push(currentDay);
            if (userProgress.unlockedDay === currentDay) userProgress.unlockedDay = currentDay + 1;
            localStorage.setItem(`englishUpProgress_${currentLevel}`, JSON.stringify(userProgress));
        }
        continueBtn.classList.remove('hidden'); 
        retryBtn.classList.add('hidden');
        continueBtn.onclick = () => {
            resultSection.classList.add('hidden'); 
            learningSection.classList.add('hidden');
            planSection.classList.remove('hidden'); 
            renderDays();
        };
    } else {
        document.getElementById('resultMessage').textContent = "Afsuski, o'ta olmadingiz. Kamida 80% kerak.";
        document.getElementById('resultMessage').style.color = "red";
        continueBtn.classList.add('hidden'); 
        retryBtn.classList.remove('hidden');
        retryBtn.onclick = () => { 
            resultSection.classList.add('hidden'); 
            startTest(); 
        };
    }
}

// ==========================================
// YANGI: SINONIM VA ANTONIM BO'LIMI
// ==========================================

// 1. Darajalar ro'yxatiga "Sinonim va Antonim" kartochkasini qo'shish
const levelListContainer = document.getElementById('levelList');
const synonymBtnHTML = `
    <button class="level-card" onclick="openSynonymSection()" style="border: 2px solid #1456a0;">
        <h3 style="color: #1456a0;">Sinonim va Antonim</h3>
        <p>So'z boyligini mustahkamlash</p>
        <span>Barcha darajalar uchun test</span>
    </button>
`;
if (levelListContainer) {
    levelListContainer.insertAdjacentHTML('beforeend', synonymBtnHTML);
}

// 2. Sinonim testi uchun o'zgaruvchilar
let synonymQuestions = [];
let currentSynonymIndex = 0;
let synonymScore = 0;

// 3. Bo'limga kirish funksiyasi
function openSynonymSection() {
    if (levelSection) levelSection.classList.add('hidden');
    if (synonymSection) synonymSection.classList.remove('hidden');
    startSynonymTest();
}

// 4. Testni boshlash
function startSynonymTest() {
    synonymQuestions = [];
    currentSynonymIndex = 0;
    synonymScore = 0;

    // DIQQAT: synonym-words.js faylingizdagi o'zgaruvchi nomi shu yerda "synonymWords" deb olindi.
    // Agar u boshqacha bo'lsa (masalan synonymData), shu joyni o'zgartiring.
    if (typeof synonymWords === 'undefined' || synonymWords.length === 0) {
        alert("Sinonimlar bazasi topilmadi yoki bo'sh!");
        return;
    }

    const shuffledData = [...synonymWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledData.slice(0, 10);

    selectedWords.forEach(item => {
        const isSynonym = Math.random() > 0.5; 
        const correctAnswers = isSynonym ? item.synonyms : item.antonyms;
        
        if (correctAnswers && correctAnswers.length > 0) {
            synonymQuestions.push({
                word: item.word,
                type: isSynonym ? "Sinonim" : "Antonim",
                correct: correctAnswers[0]
            });
        }
    });

    if (synonymQuestions.length === 0) {
        alert("Test uchun yetarli ma'lumot yo'q!");
        return;
    }

    showSynonymQuestion();
}

// 5. Savolni ekranga chiqarish
function showSynonymQuestion() {
    if (currentSynonymIndex >= synonymQuestions.length) {
        alert(`Test tugadi! Natijangiz: ${synonymScore} / ${synonymQuestions.length}`);
        if (synonymSection) synonymSection.classList.add('hidden');
        if (levelSection) levelSection.classList.remove('hidden');
        return;
    }

    const q = synonymQuestions[currentSynonymIndex];
    
    document.getElementById("synonymProgressText").textContent = `Savol ${currentSynonymIndex + 1} / ${synonymQuestions.length}`;
    document.getElementById("synonymTypeLabel").textContent = `${q.type}ini toping:`;
    document.getElementById("synonymQuestionWord").textContent = q.word;
    
    const optionsContainer = document.getElementById("synonymOptions");
    optionsContainer.innerHTML = "";
    document.getElementById("synonymFeedback").textContent = "";
    document.getElementById("nextSynonymQuestion").classList.add("hidden");

    let options = [q.correct];
    
    while (options.length < 4) {
        const randomWord = synonymWords[Math.floor(Math.random() * synonymWords.length)];
        const wrongList = q.type === "Sinonim" ? randomWord.antonyms : randomWord.synonyms;
        if (wrongList && wrongList.length > 0) {
            const wrongOption = wrongList[Math.floor(Math.random() * wrongList.length)];
            if (!options.includes(wrongOption)) {
                options.push(wrongOption);
            }
        }
    }

    options.sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn"; 
        btn.textContent = opt;
        btn.onclick = () => checkSynonymAnswer(btn, opt, q.correct, optionsContainer);
        optionsContainer.appendChild(btn);
    });
}

// 6. Javobni tekshirish
function checkSynonymAnswer(btn, chosen, correct, container) {
    Array.from(container.children).forEach(b => b.disabled = true);

    if (chosen === correct) {
        btn.classList.add('correct');
        synonymScore++;
        document.getElementById("synonymFeedback").textContent = "To'g'ri! ✅";
        document.getElementById("synonymFeedback").style.color = "green";
    } else {
        btn.classList.add('wrong');
        document.getElementById("synonymFeedback").textContent = `Xato! To'g'ri javob: ${correct} ❌`;
        document.getElementById("synonymFeedback").style.color = "red";
        
        Array.from(container.children).forEach(b => {
            if (b.textContent === correct) {
                b.classList.add('correct');
            }
        });
    }

    document.getElementById("nextSynonymQuestion").classList.remove("hidden");
}

// 7. Keyingi savolga o'tish
const nextSynBtn = document.getElementById("nextSynonymQuestion");
if (nextSynBtn) {
    nextSynBtn.addEventListener("click", () => {
        currentSynonymIndex++;
        showSynonymQuestion();
    });
}

// 8. Orqaga qaytish
const backSynBtn = document.getElementById("backToLevelsFromSynonym");
if (backSynBtn) {
    backSynBtn.addEventListener("click", () => {
        if (synonymSection) synonymSection.classList.add("hidden");
        if (levelSection) levelSection.classList.remove("hidden");
    });
}
