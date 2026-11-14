// ==========================================
// DARAJALARNI BOSHQARISH TIZIMI (TOZA KOD)
// ==========================================
let currentLevel = 'beginner';
let allWords = [];
let currentWordsPerDay = 30;
let currentTotalDays = 50; // Beginner uchun 50 kun qilib belgilandi

const levelsConfig = [
    { id: "beginner", title: "Beginner", desc: "Boshlang'ich daraja", wordsPerDay: 30, totalDays: 50, varName: "beginnerWords" },
    { id: "elementary", title: "Elementary", desc: "Keyingi daraja", wordsPerDay: 25, totalDays: 40, varName: "elementaryWords" },
    { id: "pre-intermediate", title: "Pre-Intermediate", desc: "O'rta daraja", wordsPerDay: 25, totalDays: 40, varName: "preIntermediateWords" },
    { id: "intermediate", title: "Intermediate", desc: "O'rta daraja", wordsPerDay: 25, totalDays: 40, varName: "intermediateWords" },
    { id: "upper-intermediate", title: "Upper-Intermediate", desc: "Yuqori daraja", wordsPerDay: 25, totalDays: 40, varName: "upperIntermediateWords" },
    { id: "ielts", title: "IELTS", desc: "IELTS lug'ati", wordsPerDay: 25, totalDays: 80, varName: "ieltsWords" }
];

const levelSection = document.getElementById('levelSection');
const planSection = document.getElementById('planSection');
const learningSection = document.getElementById('learningSection');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');

// Sinonim bo'limi uchun yangi oynalar
const synonymPlanSection = document.getElementById('synonymPlanSection');
const synonymLearningSection = document.getElementById('synonymLearningSection');
const synonymTestSection = document.getElementById('synonymTestSection');
const synonymResultSection = document.getElementById('synonymResultSection');

let currentDay = 1;
let currentWordIndex = 0;
let dayWords = [];
let testQuestions = [];
let testIndex = 0;
let correctAnswersCount = 0;
let userProgress = { unlockedDay: 1, completedDays: [] };

// Sinonim uchun o'zgaruvchilar
let synCurrentDay = 1;
let synCurrentWordIndex = 0;
let synDayWords = [];
let synTestQuestions = [];
let synTestIndex = 0;
let synCorrectAnswersCount = 0;
let synUserProgress = { unlockedDay: 1, completedDays: [] };

const SYN_WORDS_PER_DAY = 20;
const SYN_TOTAL_DAYS = 100; // 100 kunlik reja

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

function generatePlanWords(baseWords, wordsPerDay, totalDays) {
    if (!baseWords || baseWords.length === 0) return [];
    let finalWords = [...baseWords];
    let targetCount = totalDays * wordsPerDay; 
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

// Sinonim tugmasini qo'shish
const levelListContainer = document.getElementById('levelList');
const synonymBtnHTML = `
    <button class="level-card" onclick="openSynonymPlan()" style="border: 2px solid #1456a0;">
        <h3 style="color: #1456a0;">Sinonim va Antonim</h3>
        <p>So'z boyligini mustahkamlash</p>
        <span>100 kunlik reja</span>
    </button>
`;
if (levelListContainer) {
    levelListContainer.insertAdjacentHTML('beforeend', synonymBtnHTML);
}

function selectLevel(levelId) {
    currentLevel = levelId;
    const levelData = levelsConfig.find(l => l.id === levelId);
    const baseWords = getWordsArray(levelData.varName);
    
    if (baseWords.length === 0) { 
        alert("Bu daraja uchun so'zlar hali kiritilmagan."); 
        return; 
    }

    currentWordsPerDay = levelData.wordsPerDay; 
    currentTotalDays = levelData.totalDays; 
    allWords = generatePlanWords(baseWords, currentWordsPerDay, currentTotalDays);
    
    let saved = localStorage.getItem(`englishUpProgress_${levelId}`);
    userProgress = saved ? JSON.parse(saved) : { unlockedDay: 1, completedDays: [] };
    
    levelSection.classList.add('hidden');
    planSection.classList.remove('hidden');
    
    document.getElementById('planLevelTitle').textContent = `${levelData.title} - ${currentTotalDays} Kunlik Reja`;
    renderDays();
}

document.getElementById('backToLevels').addEventListener('click', () => {
    planSection.classList.add('hidden'); 
    levelSection.classList.remove('hidden');
});

// ==========================================
// REJA KUNLARINI CHIQARISH
// ==========================================
function renderDays() {
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';
    
    for (let i = 1; i <= currentTotalDays; i++) {
        const isUnlocked = i <= userProgress.unlockedDay;
        const isCompleted = userProgress.completedDays.includes(i);
        let statusClass = isCompleted ? 'completed' : (isUnlocked ? '' : 'locked');
        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${statusClass}`;
        dayCard.innerHTML = `<span>${i}-kun</span>`;
        if (isUnlocked) dayCard.addEventListener('click', () => startDay(i));
        daysGrid.appendChild(dayCard);
    }
    
    const percent = (userProgress.completedDays.length / currentTotalDays) * 100;
    document.getElementById('planProgress').style.width = percent + '%';
    document.getElementById('planProgressText').textContent = `${userProgress.completedDays.length} / ${currentTotalDays} kun bajarildi`;
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
// SINONIM VA ANTONIM BO'LIMI (100 KUNLIK REJA)
// ==========================================

function openSynonymPlan() {
    if (levelSection) levelSection.classList.add('hidden');
    if (synonymPlanSection) synonymPlanSection.classList.remove('hidden');
    
    let saved = localStorage.getItem('englishUpSynonymProgress');
    synUserProgress = saved ? JSON.parse(saved) : { unlockedDay: 1, completedDays: [] };
    
    renderSynDays();
}

function renderSynDays() {
    const daysGrid = document.getElementById('synDaysGrid');
    if (!daysGrid) return;
    
    daysGrid.innerHTML = '';
    
    for (let i = 1; i <= SYN_TOTAL_DAYS; i++) {
        const isUnlocked = i <= synUserProgress.unlockedDay;
        const isCompleted = synUserProgress.completedDays.includes(i);
        let statusClass = isCompleted ? 'completed' : (isUnlocked ? '' : 'locked');
        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${statusClass}`;
        dayCard.innerHTML = `<span>${i}-kun</span>`;
        if (isUnlocked) dayCard.addEventListener('click', () => startSynDay(i));
        daysGrid.appendChild(dayCard);
    }
    
    const percent = (synUserProgress.completedDays.length / SYN_TOTAL_DAYS) * 100;
    const planProgress = document.getElementById('synPlanProgress');
    const planProgressText = document.getElementById('synPlanProgressText');
    
    if (planProgress) planProgress.style.width = percent + '%';
    if (planProgressText) planProgressText.textContent = `${synUserProgress.completedDays.length} / ${SYN_TOTAL_DAYS} kun bajarildi`;
}

const backSynPlanBtn = document.getElementById('backToLevelsFromSynPlan');
if (backSynPlanBtn) {
    backSynPlanBtn.addEventListener('click', () => {
        if (synonymPlanSection) synonymPlanSection.classList.add('hidden');
        if (levelSection) levelSection.classList.remove('hidden');
    });
}

function startSynDay(day) {
    synCurrentDay = day;
    synCurrentWordIndex = 0;
    
    if (typeof synonymWords === 'undefined' || synonymWords.length === 0) {
        alert("Sinonimlar bazasi topilmadi yoki bo'sh!");
        return;
    }
    
    const startIndex = (day - 1) * SYN_WORDS_PER_DAY;
    synDayWords = synonymWords.slice(startIndex, startIndex + SYN_WORDS_PER_DAY);
    
    if (synDayWords.length === 0) {
        alert("Bu kun uchun so'zlar topilmadi. Iltimos, bazani to'ldiring.");
        return;
    }
    
    synonymPlanSection.classList.add('hidden');
    synonymLearningSection.classList.remove('hidden');
    showSynWord();
}

const backSynLearnBtn = document.getElementById('backToSynPlan');
if (backSynLearnBtn) {
    backSynLearnBtn.addEventListener('click', () => {
        synonymLearningSection.classList.add('hidden');
        synonymPlanSection.classList.remove('hidden');
        renderSynDays();
    });
}

function showSynWord() {
    const word = synDayWords[synCurrentWordIndex];
    
    document.getElementById('synDayLabel').textContent = `DAY ${synCurrentDay}`;
    document.getElementById('synWordNumber').textContent = `WORD ${synCurrentWordIndex + 1}`;
    document.getElementById('synEnglishWord').textContent = word.word;
    document.getElementById('synUzbekWord').textContent = word.translation;
    document.getElementById('synSynonyms').textContent = word.synonyms ? word.synonyms.join(", ") : "";
    document.getElementById('synAntonyms').textContent = word.antonyms ? word.antonyms.join(", ") : "";
    
    document.getElementById('synWordCounter').textContent = `${synCurrentWordIndex + 1} / ${synDayWords.length}`;
    document.getElementById('synLearningProgress').style.width = ((synCurrentWordIndex + 1) / synDayWords.length) * 100 + '%';
    document.getElementById('synPreviousWord').disabled = synCurrentWordIndex === 0;
    document.getElementById('synNextWord').textContent = (synCurrentWordIndex === synDayWords.length - 1) ? "Start Test 🚀" : "Next →";
}

const synNextWordBtn = document.getElementById('synNextWord');
if (synNextWordBtn) {
    synNextWordBtn.addEventListener('click', () => {
        if (synCurrentWordIndex < synDayWords.length - 1) {
            synCurrentWordIndex++;
            showSynWord();
        } else {
            startSynTest();
        }
    });
}

const synPrevWordBtn = document.getElementById('synPreviousWord');
if (synPrevWordBtn) {
    synPrevWordBtn.addEventListener('click', () => {
        if (synCurrentWordIndex > 0) {
            synCurrentWordIndex--;
            showSynWord();
        }
    });
}

function startSynTest() {
    synonymLearningSection.classList.add('hidden');
    synonymTestSection.classList.remove('hidden');
    
    synTestQuestions = [];
    synTestIndex = 0;
    synCorrectAnswersCount = 0;
    
    synDayWords.forEach(item => {
        const isSynonym = Math.random() > 0.5;
        const correctAnswers = isSynonym ? item.synonyms : item.antonyms;
        
        if (correctAnswers && correctAnswers.length > 0) {
            synTestQuestions.push({
                word: item.word,
                type: isSynonym ? "Sinonim" : "Antonim",
                correct: correctAnswers[0]
            });
        }
    });
    
    if (synTestQuestions.length === 0) {
        alert("Test uchun yetarli ma'lumot yo'q!");
        synonymTestSection.classList.add('hidden');
        synonymPlanSection.classList.remove('hidden');
        return;
    }
    
    showSynTestQuestion();
}

function showSynTestQuestion() {
    if (synTestIndex >= synTestQuestions.length) {
        finishSynTest();
        return;
    }
    
    const q = synTestQuestions[synTestIndex];
    
    document.getElementById('synTestProgress').textContent = `Savol ${synTestIndex + 1} / ${synTestQuestions.length}`;
    document.getElementById('synTypeLabel').textContent = `${q.type}ini toping:`;
    document.getElementById('synTestQuestion').textContent = q.word;
    
    const feedback = document.getElementById('synTestFeedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.style.color = '';
    }
    
    document.getElementById('synNextQuestion').classList.add('hidden');
    
    const optionsDiv = document.getElementById('synTestOptions');
    optionsDiv.innerHTML = '';
    
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
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkSynTestAnswer(btn, opt, q.correct, optionsDiv);
        optionsDiv.appendChild(btn);
    });
}

function checkSynTestAnswer(btn, selected, correct, container) {
    Array.from(container.children).forEach(b => b.disabled = true);
    
    const feedback = document.getElementById('synTestFeedback');
    
    if (selected === correct) {
        btn.classList.add('correct');
        synCorrectAnswersCount++;
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
        Array.from(container.children).forEach(b => {
            if (b.textContent === correct) {
                b.classList.add('correct');
            }
        });
    }
    
    document.getElementById('synNextQuestion').classList.remove('hidden');
}

const synNextQBtn = document.getElementById('synNextQuestion');
if (synNextQBtn) {
    synNextQBtn.addEventListener('click', () => {
        synTestIndex++;
        showSynTestQuestion();
    });
}

function finishSynTest() {
    synonymTestSection.classList.add('hidden');
    synonymResultSection.classList.remove('hidden');
    
    const percent = Math.round((synCorrectAnswersCount / synTestQuestions.length) * 100);
    document.getElementById('synResultPercent').textContent = `${percent}%`;
    document.getElementById('synResultDetails').textContent = `${synCorrectAnswersCount} ta to'g'ri, ${synTestQuestions.length - synCorrectAnswersCount} ta xato.`;
    
    const continueBtn = document.getElementById('synContinueLearning');
    const retryBtn = document.getElementById('synRetryTest');
    
    if (percent >= 80) {
        document.getElementById('synResultMessage').textContent = "Ajoyib! Siz testdan o'tdingiz.";
        document.getElementById('synResultMessage').style.color = "green";
        
        if (!synUserProgress.completedDays.includes(synCurrentDay)) {
            synUserProgress.completedDays.push(synCurrentDay);
            if (synUserProgress.unlockedDay === synCurrentDay) {
                synUserProgress.unlockedDay = synCurrentDay + 1;
            }
            localStorage.setItem('englishUpSynonymProgress', JSON.stringify(synUserProgress));
        }
        
        continueBtn.classList.remove('hidden');
        retryBtn.classList.add('hidden');
        continueBtn.onclick = () => {
            synonymResultSection.classList.add('hidden');
            synonymLearningSection.classList.add('hidden');
            synonymPlanSection.classList.remove('hidden');
            renderSynDays();
        };
    } else {
        document.getElementById('synResultMessage').textContent = "Afsuski, o'ta olmadingiz. Kamida 80% kerak.";
        document.getElementById('synResultMessage').style.color = "red";
        continueBtn.classList.add('hidden');
        retryBtn.classList.remove('hidden');
        retryBtn.onclick = () => {
            synonymResultSection.classList.add('hidden');
            startSynTest();
        };
    }
}
