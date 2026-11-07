
"use strict";

/* =========================================
   ENGLISH UP — BEGINNER COURSE
   10 lessons | 150 words | Voice | Tests
========================================= */

const $ = id => document.getElementById(id);

const M = (q, a, correct) => ({ q, a, correct });

const lessons = [

{
 id:1,
 title:"English Alphabet",
 subtitle:"Ingliz alifbosi va harflarning talaffuzi",
 explanation:`
 <h2>1. Ingliz alifbosi</h2>
 <p>Ingliz tilida 26 ta harf mavjud. Ular katta va kichik shaklda yoziladi.</p>
 <p><b>Vowels — Unli harflar:</b> A, E, I, O, U.</p>
 <p><b>Consonants — Undosh harflar:</b> qolgan 21 ta harf.</p>
 <p>Harflarning nomi bilan so‘z ichidagi tovushi bir xil bo‘lmasligi mumkin. Masalan, A harfining nomi /eɪ/, lekin apple so‘zida /æ/ tovushini beradi.</p>
 <h3>26 ta harf</h3>
 <div class="lesson-example">
 A a — ey<br>B b — bii<br>C c — sii<br>D d — dii<br>E e — ii<br>
 F f — ef<br>G g — jii<br>H h — eych<br>I i — ay<br>J j — jey<br>
 K k — key<br>L l — el<br>M m — em<br>N n — en<br>O o — ou<br>
 P p — pii<br>Q q — kyu<br>R r — aar<br>S s — es<br>T t — tii<br>
 U u — yu<br>V v — vii<br>W w — dablyu<br>X x — eks<br>Y y — way<br>Z z — zed / zii
 </div>
 <p><b>Eslatma:</b> Z harfi Britaniya inglizchasida ko‘pincha zed, Amerika inglizchasida zee deb aytiladi.</p>
 <h3>Unli va undosh tovushlar</h3>
 <p>Harf nomini yodlash bilan birga uning so‘z ichidagi tovushini ham mashq qiling.</p>
 `,
 examples:[
 "A — apple — olma",
 "B — book — kitob",
 "C — cat — mushuk",
 "D — dog — it",
 "E — egg — tuxum"
 ],
 vocab:[
 ["apple","epəl","olma"],
 ["book","buk","kitob"],
 ["cat","ket","mushuk"],
 ["dog","dog","it"],
 ["egg","eg","tuxum"],
 ["fish","fish","baliq"],
 ["girl","gyorl","qiz"],
 ["house","haus","uy"],
 ["ice","ays","muz"],
 ["juice","juus","sharbat"],
 ["king","king","qirol"],
 ["lion","layən","sher"],
 ["milk","milk","sut"],
 ["nose","nouz","burun"],
 ["orange","orinj","apelsin"]
 ],
 rules:[
 M("Ingliz alifbosida nechta harf bor?",["24","26","28"],1),
 M("Qaysi harflar unli hisoblanadi?",["A, E, I, O, U","B, C, D, F, G","X, Y, Z"],0),
 M("H harfining nomi qaysi?",["eych","eich","hey"],0)
 ]
},

{
 id:2,
 title:"Greetings and Introductions",
 subtitle:"Salomlashish va tanishish",
 explanation:`
 <h2>2. Greetings — Salomlashish</h2>
 <p>Ingliz tilida suhbat odatda salomlashishdan boshlanadi.</p>
 <h3>Asosiy salomlashuvlar</h3>
 <div class="lesson-example">
 Hello! — Salom!<br>
 Hi! — Salom! (norasmiy)<br>
 Good morning! — Xayrli tong!<br>
 Good afternoon! — Xayrli kun!<br>
 Good evening! — Xayrli kech!<br>
 Goodbye! — Xayr!
 </div>
 <h3>O‘zingizni tanishtirish</h3>
 <p><b>What is your name?</b> — Ismingiz nima?</p>
 <p><b>My name is Ali.</b> — Mening ismim Ali.</p>
 <p><b>How are you?</b> — Qalaysiz?</p>
 <p><b>I am fine, thank you.</b> — Yaxshiman, rahmat.</p>
 <h3>Kichik dialog</h3>
 <div class="lesson-example">
 A: Hello!<br>
 B: Hi!<br>
 A: What is your name?<br>
 B: My name is Ali.<br>
 A: How are you?<br>
 B: I am fine, thank you.
 </div>
 `,
 examples:[
 "Hello! My name is Anna.",
 "Good morning, teacher!",
 "How are you today?",
 "I am fine, thank you.",
 "Nice to meet you."
 ],
 vocab:[
 ["hello","helou","salom"],
 ["goodbye","gudbay","xayr"],
 ["morning","morning","tong"],
 ["afternoon","aftərnuun","tushdan keyingi vaqt"],
 ["evening","iivning","kechqurun"],
 ["name","neym","ism"],
 ["friend","frend","do‘st"],
 ["teacher","tiicher","o‘qituvchi"],
 ["student","styudent","o‘quvchi"],
 ["welcome","welkəm","xush kelibsiz"],
 ["please","pliiz","iltimos"],
 ["thanks","thenks","rahmat"],
 ["sorry","sori","kechirasiz"],
 ["fine","fayn","yaxshi"],
 ["meet","miit","uchrashmoq"]
 ],
 rules:[
 M("Hello so‘zining tarjimasi nima?",["Xayr","Salom","Rahmat"],1),
 M("What is your name? nimani anglatadi?",["Qalaysiz?","Ismingiz nima?","Qayerdansiz?"],1),
 M("Good morning qachon ishlatiladi?",["Ertalab","Kechqurun","Tunda"],0)
 ]
},

{
 id:3,
 title:"Numbers and Colors",
 subtitle:"Sonlar va ranglar",
 explanation:`
 <h2>3. Numbers — Sonlar</h2>
 <p>Sonlar yosh, narx, vaqt va miqdorni ifodalashda ishlatiladi.</p>
 <div class="lesson-example">
 1 — one<br>2 — two<br>3 — three<br>4 — four<br>5 — five<br>
 6 — six<br>7 — seven<br>8 — eight<br>9 — nine<br>10 — ten
 </div>
 <h3>Colors — Ranglar</h3>
 <div class="lesson-example">
 Red — qizil<br>Blue — ko‘k<br>Green — yashil<br>
 Yellow — sariq<br>Black — qora<br>White — oq
 </div>
 <h3>Misollar</h3>
 <p>I have two books. — Menda ikkita kitob bor.</p>
 <p>The apple is red. — Olma qizil.</p>
 <p>My car is blue. — Mening mashinam ko‘k.</p>
 <p>Son va ranglarni kundalik hayotdagi buyumlar bilan birga mashq qiling.</p>
 `,
 examples:[
 "I have three pens.",
 "The sun is yellow.",
 "My bag is black.",
 "I see two dogs.",
 "The sky is blue."
 ],
 vocab:[
 ["one","wan","bir"],
 ["two","tuu","ikki"],
 ["three","thrii","uch"],
 ["four","for","to‘rt"],
 ["five","fayv","besh"],
 ["six","siks","olti"],
 ["seven","sevən","yetti"],
 ["eight","eyt","sakkiz"],
 ["nine","nayn","to‘qqiz"],
 ["ten","ten","o‘n"],
 ["red","red","qizil"],
 ["blue","bluu","ko‘k"],
 ["green","griin","yashil"],
 ["yellow","yelou","sariq"],
 ["black","blek","qora"]
 ],
 rules:[
 M("Five qaysi son?",["4","5","6"],1),
 M("Blue qaysi rang?",["Ko‘k","Qizil","Oq"],0),
 M("Seven qaysi son?",["6","8","7"],2)
 ]
},

{
 id:4,
 title:"Personal Pronouns",
 subtitle:"Kishilik olmoshlari",
 explanation:`
 <h2>4. Personal Pronouns</h2>
 <p>Kishilik olmoshlari gapda shaxs yoki narsaning nomi o‘rnida ishlatiladi.</p>
 <div class="lesson-example">
 I — men<br>
 You — sen / siz<br>
 He — u (erkak)<br>
 She — u (ayol)<br>
 It — u (narsa yoki hayvon)<br>
 We — biz<br>
 They — ular
 </div>
 <h3>Qanday ishlatiladi?</h3>
 <p><b>I</b> am a student. — Men o‘quvchiman.</p>
 <p><b>He</b> is my brother. — U mening akam.</p>
 <p><b>She</b> is a teacher. — U o‘qituvchi.</p>
 <p><b>It</b> is a cat. — Bu mushuk.</p>
 <p><b>We</b> are friends. — Biz do‘stmiz.</p>
 <p><b>They</b> are students. — Ular o‘quvchilar.</p>
 <h3>Muhim qoida</h3>
 <p>He — erkak kishi, She — ayol kishi, It — narsa yoki hayvon uchun ishlatiladi. You birlik va ko‘plikda ishlatilishi mumkin.</p>
 `,
 examples:[
 "I am happy.",
 "She is my sister.",
 "He is my father.",
 "We are students.",
 "They are friends."
 ],
 vocab:[
 ["I","ay","men"],
 ["you","yuu","sen / siz"],
 ["he","hii","u (erkak)"],
 ["she","shii","u (ayol)"],
 ["it","it","u (narsa)"],
 ["we","wii","biz"],
 ["they","they","ular"],
 ["person","pर्सən","inson"],
 ["man","men","erkak"],
 ["woman","wumən","ayol"],
 ["child","chayld","bola"],
 ["family","femili","oila"],
 ["brother","bradhər","aka / uka"],
 ["sister","sistər","opa / singil"],
 ["people","piipəl","odamlar"]
 ],
 rules:[
 M("Men so‘zi qaysi olmosh?",["I","He","They"],0),
 M("Ayol kishi uchun qaysi olmosh ishlatiladi?",["He","She","It"],1),
 M("Biz so‘zining inglizchasi?",["They","We","You"],1)
 ]
},

{
 id:5,
 title:"Verb To Be",
 subtitle:"Am, is, are fe'llari",
 explanation:`
 <h2>5. Verb To Be — Am, Is, Are</h2>
 <p>To be fe'li hozirgi zamonda shaxs yoki narsaning kimligini, holatini va qayerdaligini ifodalaydi.</p>
 <h3>To be shakllari</h3>
 <div class="lesson-example">
 I am — Men ...man<br>
 He is — U ...<br>
 She is — U ...<br>
 It is — U ...<br>
 You are — Siz ...siz<br>
 We are — Biz ...miz<br>
 They are — Ular ...
 </div>
 <h3>Darajali misollar</h3>
 <p>I am a student. — Men o‘quvchiman.</p>
 <p>She is happy. — U xursand.</p>
 <p>They are at home. — Ular uyda.</p>
 <h3>Inkor shakli</h3>
 <p>I am not tired. — Men charchamaganman.</p>
 <p>He is not a teacher. — U o‘qituvchi emas.</p>
 <h3>So‘roq shakli</h3>
 <p>Are you ready? — Tayyormisiz?</p>
 <p>Is she a student? — U o‘quvchimi?</p>
 <p>Am, is, are fe'llarini ega bilan moslashtirish muhim.</p>
 `,
 examples:[
 "I am happy.",
 "He is my brother.",
 "She is a teacher.",
 "We are ready.",
 "Are they at home?"
 ],
 vocab:[
 ["happy","hepi","xursand"],
 ["sad","sed","xafa"],
 ["tired","tayərd","charchagan"],
 ["ready","redi","tayyor"],
 ["student","styudent","o‘quvchi"],
 ["teacher","tiicher","o‘qituvchi"],
 ["doctor","doktər","shifokor"],
 ["worker","wərkər","ishchi"],
 ["home","houm","uy"],
 ["school","skuul","maktab"],
 ["here","hir","bu yerda"],
 ["there","dher","u yerda"],
 ["hungry","hangri","och"],
 ["busy","bizi","band"],
 ["beautiful","byuutiful","chiroyli"]
 ],
 rules:[
 M("I bilan qaysi shakl ishlatiladi?",["is","am","are"],1),
 M("She bilan qaysi shakl ishlatiladi?",["am","are","is"],2),
 M("They bilan qaysi shakl ishlatiladi?",["are","is","am"],0)
 ]
},

{
 id:6,
 title:"Nouns and Articles",
 subtitle:"Otlar va a, an, the artikllari",
 explanation:`
 <h2>6. Nouns — Otlar</h2>
 <p>Ot shaxs, joy, narsa yoki tushuncha nomini bildiradi.</p>
 <p>Masalan: book — kitob, teacher — o‘qituvchi, school — maktab.</p>
 <h3>A va An</h3>
 <p>A va an birlikdagi sanaladigan otlardan oldin ishlatiladi.</p>
 <div class="lesson-example">
 a book — bitta kitob<br>
 a car — bitta mashina<br>
 an apple — bitta olma<br>
 an egg — bitta tuxum
 </div>
 <p><b>A</b> odatda undosh tovush bilan boshlanadigan so‘zlardan oldin keladi.</p>
 <p><b>An</b> odatda unli tovush bilan boshlanadigan so‘zlardan oldin keladi.</p>
 <h3>The</h3>
 <p>The aniq, suhbatdoshga ma'lum bo‘lgan narsa haqida gapirganda ishlatiladi.</p>
 <p>Open the door. — Eshikni oching.</p>
 <p>The sun is bright. — Quyosh yorqin.</p>
 `,
 examples:[
 "This is a book.",
 "I have an apple.",
 "She has a pen.",
 "Open the door.",
 "The sun is hot."
 ],
 vocab:[
 ["book","buk","kitob"],
 ["pen","pen","ruchka"],
 ["pencil","pensəl","qalam"],
 ["table","teybəl","stol"],
 ["chair","cher","stul"],
 ["door","dor","eshik"],
 ["window","windou","deraza"],
 ["apple","epəl","olma"],
 ["egg","eg","tuxum"],
 ["orange","orinj","apelsin"],
 ["car","kaar","mashina"],
 ["house","haus","uy"],
 ["school","skuul","maktab"],
 ["bag","beg","sumka"],
 ["umbrella","ambrela","soyabon"]
 ],
 rules:[
 M("___ apple",["a","an","the"],1),
 M("___ book",["a","an","are"],0),
 M("The artikli nimani bildiradi?",["Aniq narsani","Faqat ko‘plikni","O‘tgan zamonni"],0)
 ]
},

{
 id:7,
 title:"This, That, These, Those",
 subtitle:"Ko‘rsatish olmoshlari",
 explanation:`
 <h2>7. Demonstratives</h2>
 <p>This, that, these va those narsalarni ko‘rsatish uchun ishlatiladi.</p>
 <div class="lesson-example">
 This — bu (yaqin, birlik)<br>
 That — ana u (uzoq, birlik)<br>
 These — bular (yaqin, ko‘plik)<br>
 Those — anavilar (uzoq, ko‘plik)
 </div>
 <h3>Misollar</h3>
 <p>This is my book. — Bu mening kitobim.</p>
 <p>That is your car. — Ana u sizning mashinangiz.</p>
 <p>These are apples. — Bular olmalar.</p>
 <p>Those are houses. — Anavilar uylar.</p>
 <h3>Esda saqlang</h3>
 <p>This va that birlikdagi otlar bilan ishlatiladi.</p>
 <p>These va those ko‘plikdagi otlar bilan ishlatiladi.</p>
 <p>This/these — yaqin, that/those — uzoq narsalar uchun.</p>
 `,
 examples:[
 "This is a pen.",
 "That is a house.",
 "These are books.",
 "Those are cars.",
 "These apples are red."
 ],
 vocab:[
 ["this","dhis","bu"],
 ["that","dhet","ana u"],
 ["these","dhiiz","bular"],
 ["those","dhouz","anavilar"],
 ["near","nir","yaqin"],
 ["far","faar","uzoq"],
 ["object","objekt","buyum"],
 ["phone","foun","telefon"],
 ["computer","kompyuutər","kompyuter"],
 ["bottle","botəl","shisha"],
 ["cup","kap","piyola"],
 ["box","boks","quti"],
 ["flower","flauər","gul"],
 ["picture","pikchər","rasm"],
 ["key","kii","kalit"]
 ],
 rules:[
 M("Yaqin va birlik uchun qaysi so‘z?",["This","Those","These"],0),
 M("Uzoq va ko‘plik uchun qaysi so‘z?",["That","Those","This"],1),
 M("These qaysi ma'noda?",["Bu","Bular","Ana u"],1)
 ]
},

{
 id:8,
 title:"Have and Has",
 subtitle:"Egalikni ifodalash",
 explanation:`
 <h2>8. Have and Has</h2>
 <p>Have va has biror narsaga ega ekanlikni ifodalash uchun ishlatiladi.</p>
 <h3>Have</h3>
 <p>I, you, we, they bilan have ishlatiladi.</p>
 <div class="lesson-example">
 I have a book. — Menda kitob bor.<br>
 You have a car. — Sizda mashina bor.<br>
 We have a house. — Bizda uy bor.<br>
 They have a dog. — Ularda it bor.
 </div>
 <h3>Has</h3>
 <p>He, she, it bilan has ishlatiladi.</p>
 <div class="lesson-example">
 He has a brother. — Uning akasi bor.<br>
 She has a sister. — Uning singlisi bor.<br>
 It has a tail. — Uning dumi bor.
 </div>
 <h3>Inkor va so‘roq</h3>
 <p>I do not have a car. — Menda mashina yo‘q.</p>
 <p>She does not have a car. — Unda mashina yo‘q.</p>
 <p>Do you have a pen? — Sizda ruchka bormi?</p>
 <p>Does he have a dog? — Unda it bormi?</p>
 <p>Does bilan kelganda asosiy fe'l have shaklida qoladi.</p>
 `,
 examples:[
 "I have two brothers.",
 "She has a new bag.",
 "They have a big house.",
 "He does not have a car.",
 "Do you have a phone?"
 ],
 vocab:[
 ["have","hev","ega bo‘lmoq"],
 ["has","hez","ega (he/she/it)"],
 ["brother","bradhər","aka / uka"],
 ["sister","sistər","opa / singil"],
 ["mother","madhər","ona"],
 ["father","fadhər","ota"],
 ["son","san","o‘g‘il"],
 ["daughter","dotər","qiz farzand"],
 ["car","kaar","mashina"],
 ["bike","bayk","velosiped"],
 ["dog","dog","it"],
 ["cat","ket","mushuk"],
 ["bag","beg","sumka"],
 ["watch","woch","soat"],
 ["friend","frend","do‘st"]
 ],
 rules:[
 M("He ___ a car.",["have","has","having"],1),
 M("They ___ two children.",["has","have","is"],1),
 M("She does not ___ a pen.",["has","have","having"],1)
 ]
},

{
 id:9,
 title:"There Is and There Are",
 subtitle:"Mavjudlikni ifodalash",
 explanation:`
 <h2>9. There is / There are</h2>
 <p>Biror joyda nimadir borligini aytish uchun ishlatiladi.</p>
 <h3>There is</h3>
 <p>Birlikdagi narsa uchun ishlatiladi.</p>
 <div class="lesson-example">
 There is a book on the table.<br>
 Stol ustida kitob bor.
 </div>
 <h3>There are</h3>
 <p>Ko‘plikdagi narsalar uchun ishlatiladi.</p>
 <div class="lesson-example">
 There are three apples in the bag.<br>
 Sumkada uchta olma bor.
 </div>
 <h3>Inkor shakli</h3>
 <p>There is not a pen here. — Bu yerda ruchka yo‘q.</p>
 <p>There are not any books. — Hech qanday kitob yo‘q.</p>
 <h3>So‘roq shakli</h3>
 <p>Is there a school here? — Bu yerda maktab bormi?</p>
 <p>Are there any students? — O‘quvchilar bormi?</p>
 `,
 examples:[
 "There is a cat in the room.",
 "There are five books on the table.",
 "There is a car outside.",
 "There are two chairs here.",
 "Is there a shop near here?"
 ],
 vocab:[
 ["there","dher","u yerda"],
 ["room","ruum","xona"],
 ["kitchen","kichin","oshxona"],
 ["garden","gardən","bog‘"],
 ["shop","shop","do‘kon"],
 ["street","striit","ko‘cha"],
 ["city","siti","shahar"],
 ["village","vilij","qishloq"],
 ["park","park","park"],
 ["hospital","hospitəl","shifoxona"],
 ["market","markit","bozor"],
 ["library","laybreri","kutubxona"],
 ["bed","bed","karavot"],
 ["wall","wol","devor"],
 ["floor","flor","pol"]
 ],
 rules:[
 M("There ___ a book.",["is","are","am"],0),
 M("There ___ two cats.",["is","are","be"],1),
 M("Birlikdagi narsa uchun qaysi shakl?",["There are","There is","They are"],1)
 ]
},

{
 id:10,
 title:"Present Simple",
 subtitle:"Oddiy hozirgi zamon",
 explanation:`
 <h2>10. Present Simple</h2>
 <p>Present Simple odat, kundalik ish, takrorlanadigan harakat va umumiy haqiqatlar uchun ishlatiladi.</p>
 <h3>Darak gap</h3>
 <p>I, you, we, they bilan fe'lning oddiy shakli ishlatiladi.</p>
 <p>He, she, it bilan fe'lga odatda -s yoki -es qo‘shiladi.</p>
 <div class="lesson-example">
 I work every day. — Men har kuni ishlayman.<br>
 She works every day. — U har kuni ishlaydi.<br>
 They play football. — Ular futbol o‘ynashadi.<br>
 He watches TV. — U televizor ko‘radi.
 </div>
 <h3>Inkor gap</h3>
 <p>I do not work. — Men ishlamayman.</p>
 <p>She does not work. — U ishlamaydi.</p>
 <h3>So‘roq gap</h3>
 <p>Do you speak English? — Inglizcha gapirasizmi?</p>
 <p>Does he play football? — U futbol o‘ynaydimi?</p>
 <h3>Signal so‘zlar</h3>
 <p>Always — doimo; usually — odatda; often — tez-tez; sometimes — ba'zan; never — hech qachon.</p>
 `,
 examples:[
 "I study English every day.",
 "He works in a shop.",
 "She reads books.",
 "Do you like apples?",
 "They do not play tennis."
 ],
 vocab:[
 ["work","wərk","ishlamoq"],
 ["study","stadi","o‘qimoq"],
 ["read","riid","o‘qimoq"],
 ["write","rayt","yozmoq"],
 ["speak","spiik","gapirmoq"],
 ["listen","lisən","tinglamoq"],
 ["play","pley","o‘ynamoq"],
 ["watch","woch","tomosha qilmoq"],
 ["eat","iit","yemoq"],
 ["drink","drink","ichmoq"],
 ["go","gou","bormoq"],
 ["come","kam","kelmoq"],
 ["like","layk","yoqtirmoq"],
 ["always","olweyz","doimo"],
 ["usually","yujuali","odatda"]
 ],
 rules:[
 M("She ___ English every day.",["study","studies","studying"],1),
 M("I ___ football.",["plays","play","playing"],1),
 M("___ he work here?",["Do","Does","Is"],1)
 ]
}

];


/* =========================================
   PAGE NAVIGATION
========================================= */

function hideAllPages() {
 document.querySelectorAll(".page").forEach(page => {
  page.classList.remove("active");
 });
}

function showPage(id) {
 hideAllPages();
 const page = $(id);
 if (page) page.classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
}

function goHome() {
 showPage("homePage");
 updateProgress();
}

function openLessons() {
 showPage("lessonsPage");
}

function openBeginner() {
 showPage("beginnerPage");
 updateProgress();
}

function openVocabulary() {
 renderVocabulary();
 showPage("vocabularyPage");
}

function openTests() {
 renderAllTests();
 showPage("testsPage");
}

function openSpeaking() {
 renderSpeaking();
 showPage("speakingPage");
}

function openProgress() {
 renderProgress();
 showPage("progressPage");
}


/* =========================================
   VOICE / PRONUNCIATION
========================================= */

function speakEnglish(word) {
 if (!("speechSynthesis" in window)) {
  showMessage("Qurilmangiz ovozli o‘qishni qo‘llab-quvvatlamaydi.");
  return;
 }

 window.speechSynthesis.cancel();

 const utterance = new SpeechSynthesisUtterance(word);
 utterance.lang = "en-US";
 utterance.rate = 0.78;
 utterance.pitch = 1;

 window.speechSynthesis.speak(utterance);
}


/* =========================================
   LESSON RENDERING
========================================= */

let currentLesson = 1;

function openLesson(id) {
 const lesson = lessons.find(item => item.id === id);

 if (!lesson) {
  showMessage("Dars topilmadi.");
  return;
 }

 currentLesson = id;
 renderLesson(lesson);
 showPage("lessonPage");
}

function renderLesson(lesson) {
 const content = $("lessonContent");

 let html = `
 <div class="lesson-heading">
  <span class="badge">BEGINNER • LESSON ${lesson.id}</span>
  <h1>${lesson.title}</h1>
  <p>${lesson.subtitle}</p>
 </div>

 <div class="lesson-section">
  ${lesson.explanation}
 </div>

 <h2>📌 Misollar</h2>
 <div class="lesson-example">
 `;

 lesson.examples.forEach(example => {
  html += `<p>${example}</p>`;
 });

 html += `
 </div>

 <h2>📖 15 ta yangi so‘z</h2>
 <p>Har bir so‘zni tinglang, talaffuz qiling va tarjimasini yodlang.</p>

 <div class="vocabulary-table">
 `;

 lesson.vocab.forEach((word,index) => {
  html += `
   <div class="vocab-row">
    <span class="vocab-number">${index+1}.</span>
    <div class="vocab-info">
     <b>${word[0]}</b>
     <small>Talaffuzi: ${word[1]}</small>
     <small>Tarjimasi: ${word[2]}</small>
    </div>
    <button class="check-btn voice-btn" onclick="speakEnglish('${word[0]}')">🔊</button>
   </div>
  `;
 });

 html += `
 </div>

 <h2>🎧 Talaffuz mashqi</h2>
 <p>Quyidagi 10 ta so‘zni ovozli tinglang va o‘zingiz ham takrorlang.</p>

 <div class="task-card">
 `;

 lesson.vocab.slice(0,10).forEach((word,index) => {
  html += `
   <p>
    ${index+1}. <b>${word[0]}</b>
    <button class="check-btn voice-btn" onclick="speakEnglish('${word[0]}')">🔊 Tinglash</button>
   </p>
  `;
 });

 html += `
 </div>

 <h2>📝 Qo‘shimcha 10 ta mashq</h2>
 <p>To‘g‘ri javobni tanlang. Har bir savoldan keyin natijangiz ko‘rsatiladi.</p>
 <div id="practiceArea">
 `;

 const practice = makeVocabularyQuestions(lesson,10,"practice");

 practice.forEach((item,index) => {
  html += questionHTML(item,index,"practice");
 });

 html += `
 </div>
 <button class="check-btn" onclick="checkQuestionGroup('practice')">Mashqlarni tekshirish</button>
 <div id="practiceResult" class="result"></div>

 <h2>🧠 Mavzu bo‘yicha 10 ta test</h2>
 <p>Har bir savolda uchta variantdan birini tanlang.</p>

 <div id="testArea">
 `;

 const tests = makeTests(lesson);

 tests.forEach((item,index) => {
  html += questionHTML(item,index,"test");
 });

 html += `
 </div>
 <button class="check-btn" onclick="checkQuestionGroup('test')">Testni tekshirish</button>
 <div id="testResult" class="result"></div>

 <h2>✍️ Uyga vazifa — daftarda bajaring</h2>
 <p>Quyidagi topshiriqlarni daftaringizga yozib bajaring.</p>
 <div class="task-card">
  <ol>
 `;

 makeHomework(lesson).forEach(task => {
  html += `<li>${task}</li>`;
 });

 html += `
  </ol>
 </div>

 <button class="check-btn" onclick="markLessonComplete(${lesson.id})">
  ✓ Darsni tugatdim
 </button>

 <div class="lesson-navigation">
  <button class="back-btn" onclick="changeLesson(-1)">← Oldingi dars</button>
  <button class="check-btn" onclick="changeLesson(1)">Keyingi dars →</button>
 </div>
 `;

 content.innerHTML = html;
}


/* =========================================
   QUESTION GENERATION
========================================= */

function makeVocabularyQuestions(lesson,count,type) {
 const words = lesson.vocab;
 const questions = [];

 for (let i=0;i<count;i++) {
  const index = (i * 2) % words.length;
  const correct = words[index];

  const wrong1 = words[(index+3) % words.length];
  const wrong2 = words[(index+7) % words.length];

  const options = [
   correct[0],
   wrong1[0],
   wrong2[0]
  ];

  const shift = (i + lesson.id) % 3;
  const shuffled = options.slice(shift).concat(options.slice(0,shift));

  questions.push({
   q:`"${correct[2]}" so‘zining inglizchasi qaysi?`,
   a:shuffled,
   correct:shuffled.indexOf(correct[0])
  });
 }

 return questions;
}

function makeTests(lesson) {
 const vocabQuestions = makeVocabularyQuestions(lesson,7,"test");
 const ruleQuestions = lesson.rules.map(item => ({
  q:item.q,
  a:item.a,
  correct:item.correct
 }));

 return [...ruleQuestions,...vocabQuestions];
}

function questionHTML(item,index,type) {
 let html = `
 <div class="task-card question-card"
      data-type="${type}"
      data-answer="${item.correct}">
  <p><b>${index+1}. ${item.q}</b></p>
 `;

 item.a.forEach((option,i) => {
  html += `
   <label>
    <input type="radio"
      name="${type}_${index}"
      value="${i}">
    ${option}
   </label>
  `;
 });

 html += `</div>`;
 return html;
}


/* =========================================
   CHECK ANSWERS
========================================= */

function checkQuestionGroup(type) {
 const cards = document.querySelectorAll(
  `.question-card[data-type="${type}"]`
 );

 if (!cards.length) return;

 let score = 0;
 let answered = 0;

 cards.forEach(card => {
  const selected = card.querySelector("input:checked");
  const correct = Number(card.dataset.answer);

  card.querySelectorAll("label").forEach((label,index) => {
   label.style.border = "1px solid transparent";
   if (index === correct) {
    label.style.background = "#e4fff2";
   } else {
    label.style.background = "";
   }
  });

  if (selected) {
   answered++;
   if (Number(selected.value) === correct) {
    score++;
   } else {
    selected.parentElement.style.background = "#fff0f2";
   }
  }
 });

 const result = $(type + "Result");

 if (answered < cards.length) {
  result.innerHTML =
   `Siz ${answered}/${cards.length} ta savolga javob berdingiz. Barcha savollarni belgilang.`;
  result.className = "result incorrect";
  return;
 }

 const percent = Math.round(score/cards.length*100);

 result.innerHTML =
  `Natija: ${score}/${cards.length} (${percent}%). ` +
  (percent >= 80 ? "Ajoyib natija! 🎉" :
   percent >= 60 ? "Yaxshi! Yana mashq qiling. 👍" :
   "Mavzuni qayta o‘rganib, yana urinib ko‘ring. 💪");

 result.className = percent >= 60 ?
  "result correct" : "result incorrect";

 if (type === "test") {
  saveTestResult(currentLesson,score,cards.length);
 }
}


/* =========================================
   HOMEWORK
========================================= */

function makeHomework(lesson) {
 const words = lesson.vocab;

 return [
  `Mavzuni daftaringizga qisqacha tushuntirib yozing.`,
  `Yangi 15 ta so‘zni inglizcha va o‘zbekcha yozing.`,
  `15 ta so‘zning talaffuzini ovoz chiqarib mashq qiling.`,
  `"${words[0][0]}" so‘zi bilan bitta gap tuzing.`,
  `"${words[3][0]}" so‘zi bilan bitta gap tuzing.`,
  `O‘rgangan mavzu bo‘yicha 5 ta inglizcha gap yozing.`,
  `5 ta o‘zbekcha gapni ingliz tiliga tarjima qiling.`,
  `Mavzuga oid 5 ta savol tuzing.`,
  `Bugungi darsdagi qoidalarni misollar bilan takrorlang.`,
  `Ertangi darsdan oldin barcha yangi so‘zlarni qayta yodlang.`
 ];
}


/* =========================================
   LESSON COMPLETION AND PROGRESS
========================================= */

function getCompleted() {
 try {
  return JSON.parse(localStorage.getItem("englishUpCompleted")) || [];
 } catch(e) {
  return [];
 }
}

function markLessonComplete(id) {
 let completed = getCompleted();

 if (!completed.includes(id)) {
  completed.push(id);
  localStorage.setItem(
   "englishUpCompleted",
   JSON.stringify(completed)
  );
 }

 showMessage("Dars bajarildi! Barakalla! 🎉");
 updateProgress();
}

function saveTestResult(id,score,total) {
 let results = {};

 try {
  results = JSON.parse(localStorage.getItem("englishUpTests")) || {};
 } catch(e) {}

 results[id] = {
  score,
  total,
  date:new Date().toISOString()
 };

 localStorage.setItem("englishUpTests",JSON.stringify(results));
}

function updateProgress() {
 const completed = getCompleted();
 const percent = Math.round(completed.length/10*100);

 const ids = [
  "homeProgress",
  "beginnerProgress",
  "progressPageBar"
 ];

 ids.forEach(id => {
  if ($(id)) $(id).style.width = percent + "%";
 });

 const texts = [
  "homeProgressText",
  "beginnerProgressText",
  "progressPageText"
 ];

 texts.forEach(id => {
  if ($(id)) {
   $(id).textContent =
    `${completed.length} / 10 dars bajarildi`;
  }
 });
}

function renderProgress() {
 updateProgress();

 const completed = getCompleted();
 const details = $("progressDetails");

 if (!details) return;

 let html = "<h3>📚 Darslar holati</h3>";

 lessons.forEach(lesson => {
  const done = completed.includes(lesson.id);

  html += `
   <p>
    ${done ? "✅" : "⭕"}
    ${lesson.id}. ${lesson.title}
    — ${done ? "Bajarilgan" : "Bajarilmagan"}
   </p>
  `;
 });

 let results = {};

 try {
  results = JSON.parse(localStorage.getItem("englishUpTests")) || {};
 } catch(e) {}

 html += "<h3>📝 Test natijalari</h3>";

 lessons.forEach(lesson => {
  const result = results[lesson.id];

  if (result) {
   html += `
    <p>${lesson.title}: ${result.score}/${result.total}</p>
   `;
  }
 });

 details.innerHTML = html;
}


/* =========================================
   VOCABULARY PAGE
========================================= */

function renderVocabulary() {
 const area = $("vocabularyContent");
 if (!area) return;

 let html = "<h2>📖 Beginner Vocabulary</h2>";

 lessons.forEach(lesson => {
  html += `<h3>${lesson.id}. ${lesson.title}</h3>`;

  lesson.vocab.forEach(word => {
   html += `
    <div class="vocab-row">
     <div class="vocab-info">
      <b>${word[0]}</b>
      <small>Talaffuzi: ${word[1]}</small>
      <small>Tarjimasi: ${word[2]}</small>
     </div>
     <button class="check-btn" onclick="speakEnglish('${word[0]}')">🔊</button>
    </div>
   `;
  });
 });

 area.innerHTML = html;
}


/* =========================================
   ALL TESTS PAGE
========================================= */

function renderAllTests() {
 const area = $("testsContent");
 if (!area) return;

 let html = `
 <h2>📝 Beginner testlari</h2>
 <p>Kerakli darsni tanlang.</p>
 `;

 lessons.forEach(lesson => {
  html += `
   <div class="lesson-card">
    <h3>${lesson.id}. ${lesson.title}</h3>
    <p>Mavzu bo‘yicha testlarni ishlash.</p>
    <button class="check-btn"
     onclick="openLesson(${lesson.id})">
     Testni boshlash →
    </button>
   </div>
  `;
 });

 area.innerHTML = html;
}


/* =========================================
   SPEAKING PAGE
========================================= */

function renderSpeaking() {
 const area = $("speakingContent");
 if (!area) return;

 let html = `
 <h2>🎧 Speaking & Listening</h2>
 <p>So‘zlarni tinglang va ovoz chiqarib takrorlang.</p>
 `;

 lessons.forEach(lesson => {
  html += `<h3>${lesson.title}</h3>`;

  lesson.vocab.slice(0,5).forEach(word => {
   html += `
    <div class="vocab-row">
     <div class="vocab-info">
      <b>${word[0]}</b>
      <small>${word[2]}</small>
     </div>
     <button class="check-btn"
      onclick="speakEnglish('${word[0]}')">
      🔊 Tinglash
     </button>
    </div>
   `;
  });
 });

 area.innerHTML = html;
}


/* =========================================
   LESSON NAVIGATION
========================================= */

function changeLesson(direction) {
 const next = currentLesson + direction;

 if (next < 1) {
  showMessage("Bu birinchi dars.");
  return;
 }

 if (next > lessons.length) {
  showMessage("Beginner kursining barcha darslari tugadi! 🎉");
  openBeginner();
  return;
 }

 openLesson(next);
}


/* =========================================
   MESSAGE
========================================= */

function showMessage(text) {
 const message = $("message");
 if (!message) return;

 message.textContent = text;
 message.style.display = "block";

 clearTimeout(window.englishUpMessageTimer);

 window.englishUpMessageTimer = setTimeout(() => {
  message.style.display = "none";
 },3000);
}


/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded",() => {
 updateProgress();
 goHome();
});

/* HTML onclick functions */
window.goHome = goHome;
window.openLessons = openLessons;
window.openBeginner = openBeginner;
window.openLesson = openLesson;
window.openVocabulary = openVocabulary;
window.openTests = openTests;
window.openSpeaking = openSpeaking;
window.openProgress = openProgress;
window.speakEnglish = speakEnglish;
window.checkQuestionGroup = checkQuestionGroup;
window.markLessonComplete = markLessonComplete;
window.changeLesson = changeLesson;
window.showMessage = showMessage;
