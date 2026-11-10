// ==========================================
// 1. SO'ZLAR BAZASI (Hozircha 30 ta namuna)
// ==========================================
// KEYINCHALIK SHU YERGA O'ZINGIZDAGI 600 TA SO'ZNI QO'YASIZ
const allWords = [
    { en: "apple", uz: "olma", example: "I eat an apple.", exUz: "Men olma yeyman." },
    { en: "book", uz: "kitob", example: "This is a book.", exUz: "Bu kitob." },
    { en: "car", uz: "mashina", example: "My car is red.", exUz: "Mashinam qizil." },
    { en: "dog", uz: "it", example: "The dog is barking.", exUz: "It qichqirmoqda." },
    { en: "eye", uz: "ko'z", example: "Close your eyes.", exUz: "Ko'zlaringizni yuming." },
    { en: "family", uz: "oila", example: "I love my family.", exUz: "Men oilamni yaxshi ko'raman." },
    { en: "girl", uz: "qiz", example: "The girl is singing.", exUz: "Qiz qo'shiq aytmoqda." },
    { en: "house", uz: "uy", example: "My house is big.", exUz: "Mening uyim katta." },
    { en: "ice", uz: "muz", example: "The ice is cold.", exUz: "Muz sovuq." },
    { en: "jump", uz: "sakramoq", example: "I can jump high.", exUz: "Men baland sakray olaman." },
    { en: "key", uz: "kalit", example: "Where is the key?", exUz: "Kalit qayerda?" },
    { en: "light", uz: "yorug'lik", example: "Turn on the light.", exUz: "Yorug'likni yoqing." },
    { en: "milk", uz: "sut", example: "I drink milk.", exUz: "Men sut ichaman." },
    { en: "night", uz: "tun", example: "Good night!", exUz: "Xayrli tun!" },
    { en: "open", uz: "ochmoq", example: "Open the door.", exUz: "Eshikni oching." },
    { en: "pen", uz: "ruchka", example: "This is my pen.", exUz: "Bu mening ruchkam." },
    { en: "queen", uz: "qirolicha", example: "The queen is here.", exUz: "Qirolicha shu yerda." },
    { en: "red", uz: "qizil", example: "The rose is red.", exUz: "Atirgul qizil." },
    { en: "sun", uz: "quyosh", example: "The sun is bright.", exUz: "Quyosh yorqin." },
    { en: "tree", uz: "daraxt", example: "The tree is tall.", exUz: "Daraxt baland." },
    { en: "water", uz: "suv", example: "Drink some water.", exUz: "Biroz suv iching." },
    { en: "yellow", uz: "sariq", example: "The banana is yellow.", exUz: "Banan sariq." },
    { en: "zoo", uz: "hayvonot bog'i", example: "We go to the zoo.", exUz: "Biz hayvonot bog'iga boramiz." },
    { en: "cat", uz: "mushuk", example: "The cat is sleeping.", exUz: "Mushuk uxlayapti." },
    { en: "ball", uz: "koptok", example: "Play with the ball.", exUz: "Koptok bilan o'ynang." },
    { en: "day", uz: "kun", example: "Have a nice day.", exUz: "Yaxshi kun tilayman." },
    { en: "egg", uz: "tuxum", example: "I like eggs.", exUz: "Men tuxumni yaxshi ko'raman." },
    { en: "fish", uz: "baliq", example: "The fish is swimming.", exUz: "Baliq suzmoqda." },
    { en: "good", uz: "yaxshi", example: "You are a good person.", exUz: "Siz yaxshi odamsiz." },
    { en: "hand", uz: "qo'l", example: "Wash your hands.", exUz: "Qo'llaringizni yuving." }
];

const WORDS_PER_DAY = 30; // Har kuni 30 tadan
const TOTAL_DAYS = 40;    // 40 kunlik reja

// HTML elementlarini tanlash
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

// Foydalanuvchi progressini yuklash (xotiradan)
let userProgress = JSON.parse(localStorage.getItem('englishUpProgress')) || {
    unlockedDay: 1, // Hozircha faqat 1-kun ochiq
    completedDays: [] // Bajarilgan kunlar ro'yxati
};

// ==========================================
// 2. DARAJANI TANLASH VA 40 KUNNI CHIQARISH
// ==========================================
document.getElementById('levelList').innerHTML = `
    <button class="level-card" onclick="openPlan()">
        <h3>Beginner</h3>
        <p>Boshlang'ich daraja</p>
        <span>${TOTAL_DAYS} kun, 1200 so'z</span>
    </button>
`;

function openPlan() {
    levelSection.classList.add('hidden');
    planSection.classList.remove('hidden');
    renderDays();
}

document.getElementById('backToLevels').addEventListener('click', () => {
    planSection.classList.add('hidden');
    levelSection.classList.remove('hidden');
});

// 40 ta kun kartochkasini chizish
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
        
        if (isUnlocked) {
            dayCard.addEventListener('click', () => startDay(i));
        }
        daysGrid.appendChild(dayCard);
    }

    // Progress barni yangilash
    const percent = (userProgress.completedDays.length / TOTAL_DAYS) * 100;
    document.getElementById('planProgress').style.width = percent + '%';
    document.getElementById('planProgressText').textContent = `${userProgress.completedDays.length} / ${TOTAL_DAYS} kun bajarildi`;
}

// ==========================================
// 3. KUNNI BOSHLASH VA SO'ZLARNI KO'RSATISH
// ==========================================
function startDay(day) {
    currentDay = day;
    currentWordIndex = 0;
    
    // Qaysi so'zlar shu kunga tegishli ekanligini hisoblash
    const startIndex = (day - 1) * WORDS_PER_DAY;
    const endIndex = startIndex + WORDS_PER_DAY;
    dayWords = allWords.slice(startIndex, endIndex);

    if (dayWords.length === 0) {
        alert("Bu kun uchun so'zlar hali kiritilmagan!");
        return;
    }

    planSection.classList.add('hidden');
    learningSection.classList.remove('hidden');
    
    showWord();
}

document.getElementById('backToPlan').addEventListener('click', () => {
    learningSection.classList.add('hidden');
    planSection.classList.remove('hidden');
    renderDays(); // Orqaga qaytganda kunlarni yangilab ko'rsatish
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

    // Tugmalar holati
    document.getElementById('previousWord').disabled = currentWordIndex === 0;
    
    if (currentWordIndex === dayWords.length - 1) {
        document.getElementById('nextWord').textContent = "Start Test 🚀";
    } else {
        document.getElementById('nextWord').textContent = "Next →";
    }
}

// Ovoz chiqarish (Audio)
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
        startTest(); // So'zlar tugadi, testga o'tamiz
    }
});

document.getElementById('previousWord').addEventListener('click', () => {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        showWord();
    }
});

// ==========================================
// 4. TEST MANTIQI
// ==========================================
function startTest() {
    learningSection.classList.add('hidden');
    testSection.classList.remove('hidden');

    // Har bir so'z uchun test savolini tayyorlaymiz
    testQuestions = dayWords.map(word => {
        let options = [word.uz];
        // Noto'g'ri 3 ta variantni bazadan tasodifiy olamiz
        while (options.length < 4) {
            let randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!options.includes(randomWord.uz)) {
                options.push(randomWord.uz);
            }
        }
        // Variantlarni aralashtiramiz
        options.sort(() => Math.random() - 0.5);
        
        return {
            question: word.en,
            correctAnswer: word.uz,
            options: options
        };
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
    document.getElementById('testFeedback').textContent = '';
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
    // Barcha tugmalarni o'chirib qo'yamiz (boshqasini bosmasligi uchun)
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
        correctAnswersCount++;
        document.getElementById('testFeedback').textContent = "To'g'ri! ✅";
        document.getElementById('testFeedback').style.color = "green";
    } else {
        btn.classList.add('wrong');
        document.getElementById('testFeedback').textContent = `Xato! To'g'ri javob: ${correct} ❌`;
        document.getElementById('testFeedback').style.color = "red";
        // To'g'ri javobni yashil qilib ko'rsatamiz
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
// 5. NATIJA VA KEYINGI KUNNI OCHISH
// ==========================================
function finishTest() {
    testSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    const percent = Math.round((correctAnswersCount / testQuestions.length) * 100);
    
    document.getElementById('resultPercent').textContent = `${percent}%`;
    document.getElementById('resultDetails').textContent = `${correctAnswersCount} ta to'g'ri, ${testQuestions.length - correctAnswersCount} ta xato.`;

    const continueBtn = document.getElementById('continueLearning');
    const retryBtn = document.getElementById('retryTest');

    if (percent >= 80) { // 80% dan yuqori bo'lsa
        document.getElementById('resultMessage').textContent = "Ajoyib! Siz testdan o'tdingiz.";
        document.getElementById('resultMessage').style.color = "green";
        
        // Keyingi kunni ochish va progressni saqlash
        if (!userProgress.completedDays.includes(currentDay)) {
            userProgress.completedDays.push(currentDay);
            // Agar keyingi kun qulflangan bo'lsa, ochamiz
            if (userProgress.unlockedDay === currentDay) {
                userProgress.unlockedDay = currentDay + 1;
            }
            localStorage.setItem('englishUpProgress', JSON.stringify(userProgress));
        }
        
        continueBtn.classList.remove('hidden');
        retryBtn.classList.add('hidden');
        
        continueBtn.onclick = () => {
            resultSection.classList.add('hidden');
            learningSection.classList.add('hidden');
            planSection.classList.remove('hidden');
            renderDays(); // Yangilangan kunlarni ko'rsatish
        };

    } else {
        document.getElementById('resultMessage').textContent = "Afsuski, o'ta olmadingiz. Kamida 80% kerak.";
        document.getElementById('resultMessage').style.color = "red";
        
        continueBtn.classList.add('hidden');
        retryBtn.classList.remove('hidden');
        
        retryBtn.onclick = () => {
            resultSection.classList.add('hidden');
            startTest(); // Testni qaytadan boshlash
        };
    }
}
