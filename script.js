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
 ["person","pərsən","inson"],
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
   4-QISM — NAVIGATION, VOICE, LESSONS
========================================= */

// SAHIFALARNI BOSHQARISH

function hideAllPages() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });
}

function showPage(pageId) {
  hideAllPages();
  const page = $(pageId);
  if (page) page.style.display = "block";
  window.scrollTo(0, 0);
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


// OVOZ CHIQARISH

function speakEnglish(word) {
  if (!("speechSynthesis" in window)) {
    showMessage("Brauzeringiz ovoz funksiyasini qo‘llab-quvvatlamaydi.");
    return;
  }

  speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = "en-US";
  speech.rate = 0.78;
  speech.pitch = 1;

  speechSynthesis.speak(speech);
}


// DARSNI OCHISH

let currentLesson = 1;

function openLesson(id) {
  const lesson = lessons.find(item => item.id === Number(id));

  if (!lesson) {
    showMessage("Dars topilmadi.");
    return;
  }

  currentLesson = lesson.id;
  renderLesson(lesson);
  showPage("lessonPage");
}


// DARSNI EKRANGA CHIQARISH

function renderLesson(lesson) {
  const container = $("lessonContent");
  if (!container) return;

  container.innerHTML = `
    <div class="lesson-card">

      <h1>${lesson.title}</h1>
      <p>${lesson.subtitle}</p>

      <div class="lesson-explanation">
        ${lesson.explanation}
      </div>

      <h2>📚 Misollar</h2>

      <div class="lesson-examples">
        ${lesson.examples.map((example, index) => `
          <div class="example-item">
            <span>${index + 1}. ${example}</span>
            <button onclick="speakEnglish('${example.replace(/'/g, "\\'")}')">
              🔊
            </button>
          </div>
        `).join("")}
      </div>

      <h2>🗣 Vocabulary</h2>

      <div class="lesson-vocabulary">
        ${lesson.vocab.map((word, index) => `
          <div class="vocab-item">
            <div>
              <strong>${index + 1}. ${word[0]}</strong>
              <small>${word[1]}</small>
              <span>${word[2]}</span>
            </div>
            <button onclick="speakEnglish('${word[0]}')">🔊</button>
          </div>
        `).join("")}
      </div>

      <h2>✍️ Mashqlar</h2>

      <div id="practiceQuestions">
        ${makeVocabularyQuestions(lesson, 10, "practice")}
      </div>

      <button onclick="checkQuestionGroup('practice')">
        Javoblarni tekshirish
      </button>

      <div id="practiceResult"></div>

      <h2>📝 Mavzu testi</h2>

      <div id="testQuestions">
        ${makeTests(lesson)}
      </div>

      <button onclick="checkQuestionGroup('test')">
        Testni yakunlash
      </button>

      <div id="testResult"></div>

      <h2>🏠 Uyga vazifa</h2>

      <div class="homework">
        ${makeHomework(lesson)}
      </div>

      <button onclick="markLessonComplete(${lesson.id})">
        ✅ Darsni tugatdim
      </button>

      <div class="lesson-navigation">
        <button onclick="changeLesson(-1)">⬅️ Oldingi dars</button>
        <button onclick="changeLesson(1)">Keyingi dars ➡️</button>
      </div>

    </div>
  `;
}


// LUG‘AT MASHQLARINI YARATISH

function makeVocabularyQuestions(lesson, count, type) {
  return Array.from({ length: count }, (_, index) => {
    const wordIndex = (index * 2) % lesson.vocab.length;
    const word = lesson.vocab[wordIndex];

    const wrong1 = lesson.vocab[(wordIndex + 3) % lesson.vocab.length];
    const wrong2 = lesson.vocab[(wordIndex + 7) % lesson.vocab.length];

    const options = [
      { text: word[2], correct: true },
      { text: wrong1[2], correct: false },
      { text: wrong2[2], correct: false }
    ];

    const shift = index % 3;
    const rotated = [
      ...options.slice(shift),
      ...options.slice(0, shift)
    ];

    return questionHTML({
      q: `"${word[0]}" so‘zining tarjimasi nima?`,
      a: rotated.map(option => option.text),
      correct: rotated.findIndex(option => option.correct)
    }, index, type);
  }).join("");
}


// TESTLARNI YARATISH

function makeTests(lesson) {
  const questions = [...lesson.rules];

  lesson.vocab.slice(0, 7).forEach((word, index) => {
    questions.push(
      M(
        `"${word[2]}" ingliz tilida qanday bo‘ladi?`,
        [
          word[0],
          lesson.vocab[(index + 3) % lesson.vocab.length][0],
          lesson.vocab[(index + 7) % lesson.vocab.length][0]
        ],
        0
      )
    );
  });

  return questions.map((question, index) =>
    questionHTML(question, index, "test")
  ).join("");
}


// SAVOL HTML

function questionHTML(item, index, type) {
  return `
    <div class="question-card"
         data-type="${type}"
         data-correct="${item.correct}">

      <p><strong>${index + 1}. ${item.q}</strong></p>

      <div class="question-options">
        ${item.a.map((option, optionIndex) => `
          <label class="question-option">
            <input
              type="radio"
              name="${type}_${index}"
              value="${optionIndex}"
            >
            ${option}
          </label>
        `).join("")}
      </div>

    </div>
  `;
}
/* =========================================
   5-QISM — TEST, HOMEWORK, PROGRESS
========================================= */

// TEST JAVOBLARINI TEKSHIRISH

function checkQuestionGroup(type) {
  const containerId = type === "test"
    ? "testQuestions"
    : "practiceQuestions";

  const resultId = type === "test"
    ? "testResult"
    : "practiceResult";

  const container = $(containerId);
  const result = $(resultId);

  if (!container || !result) return;

  const questions = container.querySelectorAll(".question-card");

  let correctCount = 0;
  let answeredCount = 0;

  questions.forEach(question => {
    const correct = Number(question.dataset.correct);
    const selected = question.querySelector("input:checked");
    const labels = question.querySelectorAll(".question-option");

    labels.forEach(label => {
      label.style.background = "";
      label.style.borderColor = "";
    });

    if (selected) {
      answeredCount++;

      const answer = Number(selected.value);

      if (answer === correct) {
        correctCount++;
        selected.parentElement.style.background = "#dcfce7";
        selected.parentElement.style.borderColor = "#16a34a";
      } else {
        selected.parentElement.style.background = "#fee2e2";
        selected.parentElement.style.borderColor = "#dc2626";
      }
    }

    if (labels[correct]) {
      labels[correct].style.borderColor = "#16a34a";
    }
  });

  const total = questions.length;
  const percent = Math.round((correctCount / total) * 100);

  result.innerHTML = `
    <div class="result-card">
      <h3>Natija: ${correctCount}/${total}</h3>
      <p>Javob berilgan: ${answeredCount}/${total}</p>
      <h2>${percent}%</h2>
      <p>
        ${percent >= 80
          ? "Ajoyib! Juda yaxshi natija! 🎉"
          : percent >= 50
          ? "Yaxshi! Yana bir bor mashq qiling. 👍"
          : "Ko‘proq takrorlang. Siz uddalaysiz! 💪"}
      </p>
    </div>
  `;

  if (type === "test") {
    saveTestResult(currentLesson, correctCount, total);
  }
}


// UYGA VAZIFA

function makeHomework(lesson) {
  return `
    <div class="homework-card">

      <p><strong>1-topshiriq.</strong> Quyidagi so‘zlardan foydalanib 5 ta gap tuzing.</p>

      <p>
        ${lesson.vocab.slice(0, 5).map(word => word[0]).join(", ")}
      </p>

      <p><strong>2-topshiriq.</strong> Darsdagi 5 ta misolni ovoz chiqarib o‘qing.</p>

      <p><strong>3-topshiriq.</strong> Yangi 15 ta so‘zni yodlang.</p>

      <p><strong>4-topshiriq.</strong> Mavzu bo‘yicha 5 ta savol yozing.</p>

      <p><strong>5-topshiriq.</strong> O‘zingiz haqingizda 5 ta gap yozing.</p>

    </div>
  `;
}


// TUGATILGAN DARSLARNI SAQLASH

function getCompleted() {
  try {
    return JSON.parse(
      localStorage.getItem("englishUpCompleted")
    ) || [];
  } catch (error) {
    return [];
  }
}


function markLessonComplete(id) {
  const completed = getCompleted();

  if (!completed.includes(Number(id))) {
    completed.push(Number(id));

    localStorage.setItem(
      "englishUpCompleted",
      JSON.stringify(completed)
    );
  }

  updateProgress();
  showMessage("Dars muvaffaqiyatli tugatildi! 🎉");
}


// TEST NATIJASINI SAQLASH

function saveTestResult(id, score, total) {
  let results = {};

  try {
    results = JSON.parse(
      localStorage.getItem("englishUpTestResults")
    ) || {};
  } catch (error) {
    results = {};
  }

  results[id] = {
    score: score,
    total: total,
    percent: Math.round((score / total) * 100),
    date: new Date().toLocaleDateString()
  };

  localStorage.setItem(
    "englishUpTestResults",
    JSON.stringify(results)
  );

  updateProgress();
}


// UMUMIY PROGRESS

function updateProgress() {
  const completed = getCompleted();
  const percent = Math.round(
    (completed.length / lessons.length) * 100
  );

  const homeProgress = $("homeProgress");
  const beginnerProgress = $("beginnerProgress");
  const progressPageBar = $("progressPageBar");

  if (homeProgress) {
    homeProgress.style.width = percent + "%";
  }

  if (beginnerProgress) {
    beginnerProgress.style.width = percent + "%";
  }

  if (progressPageBar) {
    progressPageBar.style.width = percent + "%";
  }

  const ids = [
    "homeProgressText",
    "beginnerProgressText",
    "progressText"
  ];

  ids.forEach(id => {
    const element = $(id);
    if (element) {
      element.textContent =
        `${completed.length}/${lessons.length} dars (${percent}%)`;
    }
  });
}


// PROGRESS SAHIFASI

function renderProgress() {
  const container = $("progressContent");
  if (!container) return;

  const completed = getCompleted();

  let results = {};

  try {
    results = JSON.parse(
      localStorage.getItem("englishUpTestResults")
    ) || {};
  } catch (error) {
    results = {};
  }

  const percent = Math.round(
    (completed.length / lessons.length) * 100
  );

  container.innerHTML = `
    <div class="progress-card">

      <h2>📊 Mening natijalarim</h2>

      <h3>${completed.length}/${lessons.length} ta dars tugatildi</h3>

      <div class="progress-bar">
        <div style="
          width:${percent}%;
          height:100%;
          background:#16a34a;
          border-radius:20px;
        "></div>
      </div>

      <h3>${percent}% bajarildi</h3>

      <h2>📝 Test natijalari</h2>

      ${lessons.map(lesson => {
        const result = results[lesson.id];

        return `
          <div class="progress-item">
            <strong>${lesson.title}</strong>
            <p>
              ${result
                ? `${result.score}/${result.total} — ${result.percent}%`
                : "Hali test ishlanmagan"}
            </p>
          </div>
        `;
      }).join("")}

    </div>
  `;
}
/* =========================================
   6-QISM — ENGLISH UP VOCABULARY SYSTEM
========================================= */

// VOCABULARY DARAJALARI

let currentVocabularyLevel = "beginner";

const vocabularyLevels = [
  {
    id: "beginner",
    name: "Beginner",
    uzbek: "Boshlang‘ich daraja",
    target: 1000,
    description: "Ingliz tilini noldan boshlayotganlar uchun."
  },
  {
    id: "elementary",
    name: "Elementary",
    uzbek: "Boshlang‘ichdan keyingi daraja",
    target: 1000,
    description: "Oddiy kundalik muloqot uchun."
  },
  {
    id: "pre-intermediate",
    name: "Pre-Intermediate",
    uzbek: "O‘rta darajaga tayyorgarlik",
    target: 1000,
    description: "Fikrlarni kengroq ifodalash uchun."
  },
  {
    id: "intermediate",
    name: "Intermediate",
    uzbek: "O‘rta daraja",
    target: 1000,
    description: "Erkinroq muloqot va tushunish uchun."
  },
  {
    id: "upper-intermediate",
    name: "Upper-Intermediate",
    uzbek: "Yuqori o‘rta daraja",
    target: 1000,
    description: "Murakkab mavzular va ravon nutq uchun."
  },
  {
    id: "ielts",
    name: "IELTS",
    uzbek: "IELTS akademik lug‘ati",
    target: 1000,
    description: "Academic English va IELTS uchun."
  }
];


// SO‘Z TURINI ANIQLASH

const vocabularyTypes = {
  pronoun: [
    "i", "you", "he", "she", "it", "we", "they",
    "this", "that", "these", "those"
  ],

  verb: [
    "meet", "have", "has", "work", "study", "read",
    "write", "speak", "listen", "play", "watch",
    "eat", "drink", "go", "come", "like"
  ],

  adjective: [
    "happy", "sad", "tired", "ready", "hungry",
    "busy", "beautiful", "fine", "red", "blue",
    "green", "yellow", "black", "near", "far"
  ],

  adverb: [
    "always", "usually"
  ],

  number: [
    "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten"
  ]
};

function getVocabularyType(word) {
  const value = word.toLowerCase();

  for (const type in vocabularyTypes) {
    if (vocabularyTypes[type].includes(value)) {
      return type;
    }
  }

  if (["there"].includes(value)) return "other";

  return "noun";
}

const vocabularyTypeNames = {
  all: "Barcha so‘zlar",
  noun: "Ot (Noun)",
  verb: "Fe'l (Verb)",
  adjective: "Sifat (Adjective)",
  adverb: "Ravish (Adverb)",
  pronoun: "Olmosh (Pronoun)",
  number: "Son (Number)",
  other: "Boshqa"
};


// BEGINNER SO‘ZLARINI DARS LUG‘ATLARIDAN OLISH

const beginnerVocabulary = lessons.flatMap(lesson =>
  lesson.vocab.map(word => ({
    word: word[0],
    pronunciation: word[1],
    translation: word[2],
    type: getVocabularyType(word[0]),
    topic: lesson.title,
    lessonId: lesson.id
  }))
);


// BARCHA DARAJALAR UCHUN LUG‘AT MA'LUMOTLARI

const vocabularyData = {
  beginner: beginnerVocabulary,
  elementary: [],
  "pre-intermediate": [],
  intermediate: [],
  "upper-intermediate": [],
  ielts: []
};


// YODLANGAN SO‘ZLARNI SAQLASH

function getLearnedVocabulary() {
  try {
    return JSON.parse(
      localStorage.getItem("englishUpVocabularyLearned")
    ) || [];
  } catch (error) {
    return [];
  }
}


function saveLearnedVocabulary(words) {
  localStorage.setItem(
    "englishUpVocabularyLearned",
    JSON.stringify(words)
  );
}


// SO‘ZNING UNIKAL KALITI

function getVocabularyKey(level, word) {
  return level + ":" + word.toLowerCase();
}


// SO‘Z YODLANGANINI BELGILASH

function toggleVocabularyLearned(level, word) {
  const learned = getLearnedVocabulary();
  const key = getVocabularyKey(level, word);

  const index = learned.indexOf(key);

  if (index === -1) {
    learned.push(key);
    showMessage("So‘z yodlanganlar ro‘yxatiga qo‘shildi! ✅");
  } else {
    learned.splice(index, 1);
    showMessage("So‘z ro‘yxatdan olib tashlandi.");
  }

  saveLearnedVocabulary(learned);

  renderVocabulary();
}


// DARAJANI TANLASH

function selectVocabularyLevel(level) {
  currentVocabularyLevel = level;
  renderVocabulary();
}


// VOCABULARY SAHIFASI

function renderVocabulary() {
  const container = $("vocabularyContent");
  if (!container) return;

  const learned = getLearnedVocabulary();

  const level = vocabularyLevels.find(
    item => item.id === currentVocabularyLevel
  );

  const words = vocabularyData[currentVocabularyLevel] || [];

  const learnedCount = words.filter(word =>
    learned.includes(
      getVocabularyKey(currentVocabularyLevel, word.word)
    )
  ).length;

  container.innerHTML = `

    <div class="vocabulary-main">

      <h1>📚 English Up Vocabulary</h1>

      <p>So‘zlarni bosqichma-bosqich o‘rganing!</p>

      <h2>🎯 Darajani tanlang</h2>

      <div class="vocabulary-levels">

        ${vocabularyLevels.map(item => `
          <button
            class="vocabulary-level-button"
            style="
              background:${item.id === currentVocabularyLevel
                ? "#1456a0"
                : "#eef3fa"};
              color:${item.id === currentVocabularyLevel
                ? "white"
                : "#17365d"};
            "
            onclick="selectVocabularyLevel('${item.id}')"
          >
            <strong>${item.name}</strong>
            <small>${item.uzbek}</small>
          </button>
        `).join("")}

      </div>

      <div class="vocabulary-information">

        <h2>${level.name}</h2>

        <p>${level.description}</p>

        <div class="vocabulary-statistics">
          <div>
            <strong>${words.length}</strong>
            <span>Mavjud so‘zlar</span>
          </div>

          <div>
            <strong>${learnedCount}</strong>
            <span>Yodlangan</span>
          </div>

          <div>
            <strong>${level.target}</strong>
            <span>Maqsad</span>
          </div>
        </div>

        <div class="vocabulary-progress">
          <div style="
            width:${words.length
              ? (learnedCount / words.length) * 100
              : 0}%;
            height:100%;
            background:#16a34a;
            border-radius:20px;
          "></div>
        </div>

        <p>${learnedCount} / ${words.length} ta so‘z yodlangan</p>

      </div>

      ${
        words.length === 0
        ? `
          <div class="vocabulary-empty">
            <h3>🚧 Bu daraja tayyorlanmoqda</h3>
            <p>
              ${level.name} lug‘ati bosqichma-bosqich
              yangi so‘zlar bilan to‘ldiriladi.
            </p>
            <p>Hozircha boshqa tayyor darajalarni o‘rganishingiz mumkin.</p>
          </div>
        `
        : `

          <h2>🔎 So‘zlarni qidirish</h2>

          <input
            id="vocabSearch"
            type="search"
            placeholder="Inglizcha yoki o‘zbekcha so‘z..."
            oninput="filterVocabulary()"
          >

          <div class="vocabulary-filters">

            <select
              id="vocabTypeFilter"
              onchange="filterVocabulary()"
            >
              ${Object.entries(vocabularyTypeNames).map(([key, name]) => `
                <option value="${key}">${name}</option>
              `).join("")}
            </select>

            <select
              id="vocabTopicFilter"
              onchange="filterVocabulary()"
            >
              <option value="all">Barcha mavzular</option>

              ${[...new Set(words.map(word => word.topic))].map(topic => `
                <option value="${topic}">${topic}</option>
              `).join("")}
            </select>

          </div>

          <div id="vocabularyList"></div>

        `
      }

    </div>
  `;

  if (words.length > 0) {
    filterVocabulary();
  }
}


// QIDIRISH VA SARALASH

function filterVocabulary() {
  const searchInput = $("vocabSearch");
  const typeFilter = $("vocabTypeFilter");
  const topicFilter = $("vocabTopicFilter");
  const list = $("vocabularyList");

  if (!searchInput || !typeFilter || !topicFilter || !list) return;

  const search = searchInput.value.toLowerCase().trim();
  const selectedType = typeFilter.value;
  const selectedTopic = topicFilter.value;

  const words = vocabularyData[currentVocabularyLevel] || [];
  const learned = getLearnedVocabulary();

  const filteredWords = words.filter(item => {
    const matchesSearch =
      item.word.toLowerCase().includes(search) ||
      item.translation.toLowerCase().includes(search) ||
      item.pronunciation.toLowerCase().includes(search);

    const matchesType =
      selectedType === "all" || item.type === selectedType;

    const matchesTopic =
      selectedTopic === "all" || item.topic === selectedTopic;

    return matchesSearch && matchesType && matchesTopic;
  });

  if (filteredWords.length === 0) {
    list.innerHTML = `
      <div class="vocabulary-empty">
        <p>😕 Bu qidiruv bo‘yicha so‘z topilmadi.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filteredWords.map((item, index) => {
    const isLearned = learned.includes(
      getVocabularyKey(currentVocabularyLevel, item.word)
    );

    return `
      <div class="vocabulary-word-card">

        <div class="vocabulary-word-top">

          <div>
            <h3>${index + 1}. ${item.word}</h3>
            <p>🔊 ${item.pronunciation}</p>
            <strong>${item.translation}</strong>
          </div>

          <button
            onclick="speakEnglish('${item.word}')"
            aria-label="Talaffuzni eshitish"
          >
            🔊
          </button>

        </div>

        <div class="vocabulary-word-info">
          <span>${vocabularyTypeNames[item.type]}</span>
          <span>${item.topic}</span>
        </div>

        <button
          class="vocabulary-learn-button"
          style="
            background:${isLearned ? "#16a34a" : "#1456a0"};
            color:white;
          "
          onclick="toggleVocabularyLearned(
            '${currentVocabularyLevel}',
            '${item.word}'
          )"
        >
          ${isLearned ? "✅ Yodlandi" : "➕ Yodladim"}
        </button>

      </div>
    `;
  }).join("");
}
/* =========================================
   7-QISM — TESTS, SPEAKING, START
========================================= */

// BARCHA DARSLAR TESTLARI

function renderAllTests() {
  const container = $("testsContent");
  if (!container) return;

  container.innerHTML = `
    <h1>📝 Barcha testlar</h1>
    <p>O‘zingiz bilimingizni sinab ko‘ring.</p>

    <div class="all-tests-list">
      ${lessons.map(lesson => `
        <div class="test-lesson-card">
          <h3>${lesson.id}. ${lesson.title}</h3>
          <p>${lesson.subtitle}</p>

          <button onclick="openLesson(${lesson.id})">
            Testni boshlash
          </button>
        </div>
      `).join("")}
    </div>
  `;
}


// SPEAKING VA TALAFFUZ

function renderSpeaking() {
  const container = $("speakingContent");
  if (!container) return;

  const words = vocabularyData[currentVocabularyLevel] || [];

  container.innerHTML = `
    <h1>🗣 Speaking & Listening</h1>

    <p>So‘zlarni tinglang va ovoz chiqarib takrorlang.</p>

    <div class="speaking-word-list">

      ${words.slice(0, 30).map((item, index) => `
        <div class="speaking-word-card">
          <div>
            <strong>${index + 1}. ${item.word}</strong>
            <p>${item.translation}</p>
          </div>

          <button onclick="speakEnglish('${item.word}')">
            🔊 Eshitish
          </button>
        </div>
      `).join("")}

      ${
        words.length === 0
        ? "<p>Bu daraja uchun speaking so‘zlari tayyorlanmoqda.</p>"
        : ""
      }

    </div>
  `;
}


// OLDINGI VA KEYINGI DARSGA O‘TISH

function changeLesson(direction) {
  const nextLesson = currentLesson + direction;

  if (nextLesson < 1) {
    showMessage("Bu birinchi dars.");
    return;
  }

  if (nextLesson > lessons.length) {
    showMessage("🎉 Beginner kursini tugatdingiz!");
    goHome();
    return;
  }

  openLesson(nextLesson);
}


// XABAR KO‘RSATISH

function showMessage(text) {
  let message = $("message");

  if (!message) {
    message = document.createElement("div");
    message.id = "message";

    message.style.position = "fixed";
    message.style.bottom = "20px";
    message.style.left = "50%";
    message.style.transform = "translateX(-50%)";
    message.style.background = "#17365d";
    message.style.color = "white";
    message.style.padding = "12px 20px";
    message.style.borderRadius = "12px";
    message.style.zIndex = "9999";

    document.body.appendChild(message);
  }

  message.textContent = text;
  message.style.display = "block";

  clearTimeout(window.englishUpMessageTimer);

  window.englishUpMessageTimer = setTimeout(() => {
    message.style.display = "none";
  }, 3000);
}


// DARAJALAR O‘ZGARGANDA SPEAKINGNI YANGILASH

function openSpeaking() {
  renderSpeaking();
  showPage("speakingPage");
}


// SAYT ISHGA TUSHISHI

document.addEventListener("DOMContentLoaded", () => {
  updateProgress();
  goHome();
});


// GLOBAL FUNKSIYALAR

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

window.renderVocabulary = renderVocabulary;
window.filterVocabulary = filterVocabulary;
window.selectVocabularyLevel = selectVocabularyLevel;
window.toggleVocabularyLearned = toggleVocabularyLearned;

window.renderAllTests = renderAllTests;
window.renderSpeaking = renderSpeaking;
window.renderProgress = renderProgress;
