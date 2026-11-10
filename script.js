"use strict";

/* =========================================
   ENGLISH UP — BEGINNER COURSE
   10 lessons | 150 words | Voice | Tests
========================================= */

const $ = id => document.getElementById(id);
const M = (q, a, correct) => ({ q, a, correct });

const lessons = [
{
 id:1, title:"English Alphabet", subtitle:"Ingliz alifbosi va harflarning talaffuzi",
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
 examples:["A — apple — olma","B — book — kitob","C — cat — mushuk","D — dog — it","E — egg — tuxum"],
 vocab:[["apple","epəl","olma"],["book","buk","kitob"],["cat","ket","mushuk"],["dog","dog","it"],["egg","eg","tuxum"],["fish","fish","baliq"],["girl","gyorl","qiz"],["house","haus","uy"],["ice","ays","muz"],["juice","juus","sharbat"],["king","king","qirol"],["lion","layən","sher"],["milk","milk","sut"],["nose","nouz","burun"],["orange","orinj","apelsin"]],
 rules:[M("Ingliz alifbosida nechta harf bor?",["24","26","28"],1),M("Qaysi harflar unli hisoblanadi?",["A, E, I, O, U","B, C, D, F, G","X, Y, Z"],0),M("H harfining nomi qaysi?",["eych","eich","hey"],0)]
},
{
 id:2, title:"Greetings and Introductions", subtitle:"Salomlashish va tanishish",
 explanation:`
 <h2>2. Greetings — Salomlashish</h2>
 <p>Ingliz tilida suhbat odatda salomlashishdan boshlanadi.</p>
 <h3>Asosiy salomlashuvlar</h3>
 <div class="lesson-example">
 Hello! — Salom!<br>Hi! — Salom! (norasmiy)<br>Good morning! — Xayrli tong!<br>Good afternoon! — Xayrli kun!<br>Good evening! — Xayrli kech!<br>Goodbye! — Xayr!
 </div>
 <h3>O‘zingizni tanishtirish</h3>
 <p><b>What is your name?</b> — Ismingiz nima?</p>
 <p><b>My name is Ali.</b> — Mening ismim Ali.</p>
 <p><b>How are you?</b> — Qalaysiz?</p>
 <p><b>I am fine, thank you.</b> — Yaxshiman, rahmat.</p>
 <h3>Kichik dialog</h3>
 <div class="lesson-example">
 A: Hello!<br>B: Hi!<br>A: What is your name?<br>B: My name is Ali.<br>A: How are you?<br>B: I am fine, thank you.
 </div>
 `,
 examples:["Hello! My name is Anna.","Good morning, teacher!","How are you today?","I am fine, thank you.","Nice to meet you."],
 vocab:[["hello","helou","salom"],["goodbye","gudbay","xayr"],["morning","morning","tong"],["afternoon","aftərnuun","tushdan keyingi vaqt"],["evening","iivning","kechqurun"],["name","neym","ism"],["friend","frend","do‘st"],["teacher","tiicher","o‘qituvchi"],["student","styudent","o‘quvchi"],["welcome","welkəm","xush kelibsiz"],["please","pliiz","iltimos"],["thanks","thenks","rahmat"],["sorry","sori","kechirasiz"],["fine","fayn","yaxshi"],["meet","miit","uchrashmoq"]],
 rules:[M("Hello so‘zining tarjimasi nima?",["Xayr","Salom","Rahmat"],1),M("What is your name? nimani anglatadi?",["Qalaysiz?","Ismingiz nima?","Qayerdansiz?"],1),M("Good morning qachon ishlatiladi?",["Ertalab","Kechqurun","Tunda"],0)]
},
{
 id:3, title:"Numbers and Colors", subtitle:"Sonlar va ranglar",
 explanation:`
 <h2>3. Numbers — Sonlar</h2>
 <p>Sonlar yosh, narx, vaqt va miqdorni ifodalashda ishlatiladi.</p>
 <div class="lesson-example">
 1 — one<br>2 — two<br>3 — three<br>4 — four<br>5 — five<br>6 — six<br>7 — seven<br>8 — eight<br>9 — nine<br>10 — ten
 </div>
 <h3>Colors — Ranglar</h3>
 <div class="lesson-example">
 Red — qizil<br>Blue — ko‘k<br>Green — yashil<br>Yellow — sariq<br>Black — qora<br>White — oq
 </div>
 <h3>Misollar</h3>
 <p>I have two books. — Menda ikkita kitob bor.</p>
 <p>The apple is red. — Olma qizil.</p>
 <p>My car is blue. — Mening mashinam ko‘k.</p>
 <p>Son va ranglarni kundalik hayotdagi buyumlar bilan birga mashq qiling.</p>
 `,
 examples:["I have three pens.","The sun is yellow.","My bag is black.","I see two dogs.","The sky is blue."],
 vocab:[["one","wan","bir"],["two","tuu","ikki"],["three","thrii","uch"],["four","for","to‘rt"],["five","fayv","besh"],["six","siks","olti"],["seven","sevən","yetti"],["eight","eyt","sakkiz"],["nine","nayn","to‘qqiz"],["ten","ten","o‘n"],["red","red","qizil"],["blue","bluu","ko‘k"],["green","griin","yashil"],["yellow","yelou","sariq"],["black","blek","qora"]],
 rules:[M("Five qaysi son?",["4","5","6"],1),M("Blue qaysi rang?",["Ko‘k","Qizil","Oq"],0),M("Seven qaysi son?",["6","8","7"],2)]
},
{
 id:4, title:"Personal Pronouns", subtitle:"Kishilik olmoshlari",
 explanation:`
 <h2>4. Personal Pronouns</h2>
 <p>Kishilik olmoshlari gapda shaxs yoki narsaning nomi o‘rnida ishlatiladi.</p>
 <div class="lesson-example">
 I — men<br>You — sen / siz<br>He — u (erkak)<br>She — u (ayol)<br>It — u (narsa yoki hayvon)<br>We — biz<br>They — ular
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
 examples:["I am happy.","She is my sister.","He is my father.","We are students.","They are friends."],
 vocab:[["I","ay","men"],["you","yuu","sen / siz"],["he","hii","u (erkak)"],["she","shii","u (ayol)"],["it","it","u (narsa)"],["we","wii","biz"],["they","they","ular"],["person","pərsən","inson"],["man","men","erkak"],["woman","wumən","ayol"],["child","chayld","bola"],["family","femili","oila"],["brother","bradhər","aka / uka"],["sister","sistər","opa / singil"],["people","piipəl","odamlar"]],
 rules:[M("Men so‘zi qaysi olmosh?",["I","He","They"],0),M("Ayol kishi uchun qaysi olmosh ishlatiladi?",["He","She","It"],1),M("Biz so‘zining inglizchasi?",["They","We","You"],1)]
},
{
 id:5, title:"Verb To Be", subtitle:"Am, is, are fe'llari",
 explanation:`
 <h2>5. Verb To Be — Am, Is, Are</h2>
 <p>To be fe'li hozirgi zamonda shaxs yoki narsaning kimligini, holatini va qayerdaligini ifodalaydi.</p>
 <h3>To be shakllari</h3>
 <div class="lesson-example">
 I am — Men ...man<br>He is — U ...<br>She is — U ...<br>It is — U ...<br>You are — Siz ...siz<br>We are — Biz ...miz<br>They are — Ular ...
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
 examples:["I am happy.","He is my brother.","She is a teacher.","We are ready.","Are they at home?"],
 vocab:[["happy","hepi","xursand"],["sad","sed","xafa"],["tired","tayərd","charchagan"],["ready","redi","tayyor"],["student","styudent","o‘quvchi"],["teacher","tiicher","o‘qituvchi"],["doctor","doktər","shifokor"],["worker","wərkər","ishchi"],["home","houm","uy"],["school","skuul","maktab"],["here","hir","bu yerda"],["there","dher","u yerda"],["hungry","hangri","och"],["busy","bizi","band"],["beautiful","byuutiful","chiroyli"]],
 rules:[M("I bilan qaysi shakl ishlatiladi?",["is","am","are"],1),M("She bilan qaysi shakl ishlatiladi?",["am","are","is"],2),M("They bilan qaysi shakl ishlatiladi?",["are","is","am"],0)]
},
{
 id:6, title:"Nouns and Articles", subtitle:"Otlar va a, an, the artikllari",
 explanation:`
 <h2>6. Nouns — Otlar</h2>
 <p>Ot shaxs, joy, narsa yoki tushuncha nomini bildiradi.</p>
 <p>Masalan: book — kitob, teacher — o‘qituvchi, school — maktab.</p>
 <h3>A va An</h3>
 <p>A va an birlikdagi sanaladigan otlardan oldin ishlatiladi.</p>
 <div class="lesson-example">
 a book — bitta kitob<br>a car — bitta mashina<br>an apple — bitta olma<br>an egg — bitta tuxum
 </div>
 <p><b>A</b> odatda undosh tovush bilan boshlanadigan so‘zlardan oldin keladi.</p>
 <p><b>An</b> odatda unli tovush bilan boshlanadigan so‘zlardan oldin keladi.</p>
 <h3>The</h3>
 <p>The aniq, suhbatdoshga ma'lum bo‘lgan narsa haqida gapirganda ishlatiladi.</p>
 <p>Open the door. — Eshikni oching.</p>
 <p>The sun is bright. — Quyosh yorqin.</p>
 `,
 examples:["This is a book.","I have an apple.","She has a pen.","Open the door.","The sun is hot."],
 vocab:[["book","buk","kitob"],["pen","pen","ruchka"],["pencil","pensəl","qalam"],["table","teybəl","stol"],["chair","cher","stul"],["door","dor","eshik"],["window","windou","deraza"],["apple","epəl","olma"],["egg","eg","tuxum"],["orange","orinj","apelsin"],["car","kaar","mashina"],["house","haus","uy"],["school","skuul","maktab"],["bag","beg","sumka"],["umbrella","ambrela","soyabon"]],
 rules:[M("___ apple",["a","an","the"],1),M("___ book",["a","an","are"],0),M("The artikli nimani bildiradi?",["Aniq narsani","Faqat ko‘plikni","O‘tgan zamonni"],0)]
},
{
 id:7, title:"This, That, These, Those", subtitle:"Ko‘rsatish olmoshlari",
 explanation:`
 <h2>7. Demonstratives</h2>
 <p>This, that, these va those narsalarni ko‘rsatish uchun ishlatiladi.</p>
 <div class="lesson-example">
 This — bu (yaqin, birlik)<br>That — ana u (uzoq, birlik)<br>These — bular (yaqin, ko‘plik)<br>Those — anavilar (uzoq, ko‘plik)
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
 examples:["This is a pen.","That is a house.","These are books.","Those are cars.","These apples are red."],
 vocab:[["this","dhis","bu"],["that","dhet","ana u"],["these","dhiiz","bular"],["those","dhouz","anavilar"],["near","nir","yaqin"],["far","faar","uzoq"],["object","objekt","buyum"],["phone","foun","telefon"],["computer","kompyuutər","kompyuter"],["bottle","botəl","shisha"],["cup","kap","piyola"],["box","boks","quti"],["flower","flauər","gul"],["picture","pikchər","rasm"],["key","kii","kalit"]],
 rules:[M("Yaqin va birlik uchun qaysi so‘z?",["This","Those","These"],0),M("Uzoq va ko‘plik uchun qaysi so‘z?",["That","Those","This"],1),M("These qaysi ma'noda?",["Bu","Bular","Ana u"],1)]
},
{
 id:8, title:"Have and Has", subtitle:"Egalikni ifodalash",
 explanation:`
 <h2>8. Have and Has</h2>
 <p>Have va has biror narsaga ega ekanlikni ifodalash uchun ishlatiladi.</p>
 <h3>Have</h3>
 <p>I, you, we, they bilan have ishlatiladi.</p>
 <div class="lesson-example">
 I have a book. — Menda kitob bor.<br>You have a car. — Sizda mashina bor.<br>We have a house. — Bizda uy bor.<br>They have a dog. — Ularda it bor.
 </div>
 <h3>Has</h3>
 <p>He, she, it bilan has ishlatiladi.</p>
 <div class="lesson-example">
 He has a brother. — Uning akasi bor.<br>She has a sister. — Uning singlisi bor.<br>
