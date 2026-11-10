// ==========================================
// 1. DARAJALARNI BOSHQARISH TIZIMI
// ==========================================
let currentLevel = 'beginner';
let allWords = [];
let currentWordsPerDay = 30;

// Darajalar ro'yxati (Beginner: 30, qolganlar: 25)
const levelsConfig = [
    { 
        id: "beginner", 
        title: "Beginner", 
        desc: "Boshlang'ich daraja", 
        wordsPerDay: 30, 
        varName: "beginnerWords" 
    },
    { 
        id: "elementary", 
        title: "Elementary", 
        desc: "Boshlang'ichdan keyingi daraja", 
        wordsPerDay: 25, 
        varName: "elementaryWords" 
    },
    { 
        id: "pre-intermediate", 
        title: "Pre-Intermediate", 
        desc: "O'rta darajaga tayyorgarlik", 
        wordsPerDay: 25, 
        varName: "preIntermediateWords" 
    },
    { 
        id: "intermediate", 
        title: "Intermediate", 
        desc: "O'rta daraja", 
        wordsPerDay: 25, 
        varName: "intermediateWords" 
    },
    { 
        id: "upper-intermediate", 
        title: "Upper-Intermediate", 
        desc: "Yuqori o'rta daraja", 
        wordsPerDay: 25, 
        varName: "upperIntermediateWords" 
    },
    { 
        id: "ielts", 
        title: "IELTS", 
        desc: "IELTS akademik lug'ati", 
        wordsPerDay: 25, 
        varName: "ieltsWords" 
    }
];

// HTML Elementlar
const levelSection = document.getElementById('levelSection');
const planSection = document.getElementById('planSection');
const learningSection = document.getElementById('learningSection');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');

// O'zgaruvchilar
let currentDay = 1;
let currentWordIndex = 0;
let dayWords = [];
let testQuestions = [];
let testIndex = 0;
let correctAnswersCount = 0;
let userProgress = { unlockedDay: 1, completedDays: [] };

const TOTAL_DAYS = 40;

// ==========================================
// 2. SO'ZLARNI O'QISH VA FORMATLASH
// ==========================================
function getWordsArray(varName) {
    try {
        // Beginner fayli uchun maxsus format (word, uz, translation)
        if (varName === "beginnerWords" && typeof window.beginnerWords !== 'undefined') {
            return window.beginnerWords.map(w => ({
                en: w.word, 
                uz: w.uz, 
                example: w.example || "", 
                exUz: w.translation || w.uz
            }));
        }
        // Qolgan darajalar uchun standart format
        if (typeof window[varName] !== 'undefined') {
            return window[varName];
        }
        return [];
    } catch (e) {
        return [];
    }
}

// 40 kunlik rejaga so'zlarni taqsimlash va to'ldirish
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
// 3. DARAJALARNI EKRANGA CHIQARISH
// ==========================================
const levelListHTML = levelsConfig.map(lvl => {
    const words = getWordsArray(lvl.varName);
    return `
    <button class="level-card" onclick="selectLevel('${lvl.id}')">
        <h3>${lvl.title}</h3>
        <p>${lvl.desc}</p>
        <span>${words.length} ta so'z mavjud</span>
    </button>
    `;
}).join('');

document.getElementById('levelList').innerHTML = levelListHTML;

function selectLevel(levelId) {
    currentLevel = levelId;
    const levelData = levelsConfig.find(l => l.id === levelId);
    const baseWords = getWordsArray(levelData.varName);
    
    if (baseWords.length === 0) {
        alert("Bu daraja uchun so'zlar hali kiritilmagan. Iltimos, keyinroq qayta urinib ko'ring.");
        return;
    }

    currentWordsPerDay = levelData.wordsPerDay; 
    allWords = generatePlanWords(baseWords, currentWordsPerDay);
    
    let saved = localStorage.getItem(`englishUpProgress_${levelId}`);
    userProgress = saved ? JSON.parse(saved) : { unlockedDay: 1, completedDays: [] };
    
    levelSection.classList.add('hidden');
    planSection.classList.remove('hidden');
    
    const planTitle = document.getElementById('planLevelTitle');
    if (planTitle) planTitle.textContent = `${levelData.title} - 40 Kunlik Reja`;
    
    renderDays();
}

document.getElementById('backToLevels').addEventListener('click', () => {
    planSection.classList.add('hidden');
    levelSection.classList.remove('hidden');
});

// ==========================================
// 4. 40 KUNLIK REJANI CHIZISH
// ==========================================
function renderDays() {
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';

    for (let i = 1; i <= TOTAL_DAYS; i++) {
        const isUnlocked = i <= userProgress.unlockedDay;
        const isCompleted = userProgress.completedDays.includes(i);
        
        let statusClass = 'locked';
        if (isCompleted) statusClass = 'completed';
        else if (isUnlocked) statusClass = '';

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
// 5. KUNNI BOSHLASH VA SO'ZLAR
// ==========================================
function startDay(day) {
    currentDay = day;
    currentWordIndex = 0;
    
    const startIndex = (day - 1) * currentWordsPerDay;
    const endIndex = startIndex + currentWordsPerDay;
    dayWords = allWords.slice(startIndex, endIndex);

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
    
    if (currentWordIndex === dayWords.length - 1) {
        document.getElementById('nextWord').textContent = "Start Test 🚀";
    } else {
        document.getElementById('nextWord').textContent = "Next →";
    }
}

document.getElementById('pronunciationBtn').addEventListener('click', () => {
    const word = document.getElementById('englishWord').textContent;
    const utterance = new SpeechSynthesisUtterance(word);
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
// 6. TEST MANTIQI
// ==========================================
function startTest() {
    learningSection.classList.add('hidden');
    testSection.classList.remove('hidden');

    testQuestions = dayWords.map(word => {
        let options = [word.uz];
        while (options.length < 4) {
            let randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!options.includes(randomWord.uz)) options.push(randomWord.uz);
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
    if (feedback) { feedback.textContent = ''; feedback.style.color = ''; }
    
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
        if (feedback) { feedback.textContent = "To'g'ri! ✅"; feedback.style.color = "green"; }
    } else {
        btn.classList.add('wrong');
        if (feedback) { feedback.textContent = `Xato! To'g'ri javob: ${correct} ❌`; feedback.style.color = "red"; }
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
// 7. NATIJA VA KEYINGI KUNNI OCHISH
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
