const $ = id => document.getElementById(id);

// ==================== LEVELS ====================

const levels = [
  { id: "beginner", name: "Beginner", total: 600 },
  { id: "elementary", name: "Elementary", total: 2000 },
  { id: "pre", name: "Pre-Intermediate", total: 2000 },
  { id: "intermediate", name: "Intermediate", total: 2000 },
  { id: "upper", name: "Upper-Intermediate", total: 2000 },
  { id: "ielts", name: "IELTS", total: 2000 }
];

// ==================== BEGINNER: 600 WORDS ====================
// 20 kun x 30 ta so‘z.
// Takrorlangan so‘zlar yangi so‘zlar bilan almashtirildi.

const beginnerDays = [
`House|Uy;Home|Xonadon;Room|Xona;Door|Eshik;Window|Deraza;Wall|Devor;Floor|Pol;Roof|Tom;Table|Stol;Chair|Stul;Bed|Karavot;Kitchen|Oshxona;Bathroom|Hammom;Garden|Bog‘;Family|Oila;Mother|Ona;Father|Ota;Brother|Aka, uka;Sister|Opa, singil;Child|Bola;Baby|Chaqaloq;Son|O‘g‘il;Daughter|Qiz farzand;Friend|Do‘st;Man|Erkak;Woman|Ayol;Boy|O‘g‘il bola;Girl|Qiz bola;People|Odamlar;Name|Ism`,

`Book|Kitob;Pen|Ruchka;Pencil|Qalam;Paper|Qog‘oz;Notebook|Daftar;Bag|Sumka;School|Maktab;Teacher|O‘qituvchi;Student|O‘quvchi;Lesson|Dars;Class|Sinf;Desk|Parta;Board|Doska;Question|Savol;Answer|Javob;Word|So‘z;Sentence|Gap;Letter|Harf;Number|Raqam;Page|Sahifa;Story|Hikoya;Picture|Rasm;Map|Xarita;Test|Sinov;Homework|Uy vazifasi;English|Ingliz tili;Language|Til;Dictionary|Lug‘at;Reading|O‘qish;Writing|Yozish`,

`Water|Suv;Milk|Sut;Tea|Choy;Coffee|Qahva;Juice|Sharbat;Bread|Non;Rice|Guruch;Meat|Go‘sht;Fish|Baliq;Chicken|Tovuq;Egg|Tuxum;Cheese|Pishloq;Butter|Sariyog‘;Sugar|Shakar;Salt|Tuz;Soup|Sho‘rva;Salad|Salat;Apple|Olma;Banana|Banan;Orange|Apelsin;Grape|Uzum;Lemon|Limon;Potato|Kartoshka;Tomato|Pomidor;Onion|Piyoz;Carrot|Sabzi;Breakfast|Nonushta;Lunch|Tushlik;Dinner|Kechki ovqat;Food|Ovqat`,

`Head|Bosh;Hair|Soch;Face|Yuz;Eye|Ko‘z;Ear|Quloq;Nose|Burun;Mouth|Og‘iz;Tooth|Tish;Neck|Bo‘yin;Shoulder|Yelka;Arm|Qo‘l;Hand|Kaft, qo‘l;Finger|Barmoq;Leg|Oyoq;Foot|Oyoq panjasi;Knee|Tizza;Back|Orqa;Heart|Yurak;Body|Tana;Skin|Teri;Blood|Qon;Cheek|Yonoq;Health|Salomatlik;Pain|Og‘riq;Doctor|Shifokor;Nurse|Hamshira;Hospital|Kasalxona;Medicine|Dori;Sick|Kasal;Healthy|Sog‘lom`,

`Go|Bormoq;Come|Kelmoq;Eat|Yemoq;Drink|Ichmoq;Sleep|Uxlamoq;Wake|Uyg‘onmoq;Read|O‘qimoq;Write|Yozmoq;Speak|Gapirmoq;Listen|Tinglamoq;Learn|O‘rganmoq;Teach|O‘rgatmoq;Work|Ishlamoq;Play|O‘ynamoq;Walk|Yurmoq;Run|Yugurmoq;Sit|O‘tirmoq;Stand|Turmoq;Open|Ochmoq;Close|Yopmoq;Start|Boshlamoq;Finish|Tugatmoq;Make|Yasamoq;Do|Bajarmoq;Help|Yordam bermoq;Need|Kerak bo‘lmoq;Want|Xohlamoq;Like|Yoqtirmoq;Love|Sevmoq;Live|Yashamoq`,

`See|Ko‘rmoq;Look|Qaramoq;Watch|Tomosha qilmoq;Hear|Eshitmoq;Say|Aytmoq;Tell|Aytib bermoq;Ask|So‘ramoq;Reply|Javob bermoq;Call|Qo‘ng‘iroq qilmoq;Meet|Uchrashmoq;Know|Bilmoq;Think|O‘ylamoq;Understand|Tushunmoq;Remember|Eslamoq;Forget|Unutmoq;Find|Topmoq;Lose|Yo‘qotmoq;Give|Bermoq;Take|Olmoq;Bring|Olib kelmoq;Buy|Sotib olmoq;Sell|Sotmoq;Pay|To‘lamoq;Send|Yubormoq;Get|Olmoq;Keep|Saqlamoq;Put|Qo‘ymoq;Use|Foydalanmoq;Try|Harakat qilmoq;Wait|Kutmoq`,

`Big|Katta;Small|Kichik;Long|Uzun;Short|Qisqa;Tall|Baland bo‘yli;Low|Past;High|Yuqori;Wide|Keng;Narrow|Tor;Thick|Qalin;Thin|Yupqa;Heavy|Og‘ir;Light|Yengil;Strong|Kuchli;Weak|Kuchsiz;Fast|Tez;Slow|Sekin;Easy|Oson;Difficult|Qiyin;Good|Yaxshi;Bad|Yomon;Beautiful|Chiroyli;Ugly|Xunuk;Clean|Toza;Dirty|Kir;New|Yangi;Old|Eski;Young|Yosh;Rich|Boy;Poor|Kambag‘al`,

`Happy|Xursand;Sad|Xafa;Angry|Jahli chiqqan;Afraid|Qo‘rqqan;Tired|Charchagan;Busy|Band;Free|Bo‘sh;Hungry|Och;Thirsty|Chanqagan;Sleepy|Uyqusi kelgan;Bored|Zerikkan;Excited|Hayajonlangan;Worried|Xavotirlangan;Calm|Tinch;Kind|Mehribon;Nice|Yoqimli;Friendly|Do‘stona;Polite|Odobli;Rude|Qo‘pol;Clever|Aqlli;Stupid|Ahmoq;Funny|Kulgili;Serious|Jiddiy;Shy|Uyatchan;Brave|Jasur;Lazy|Dangasa;Active|Faol;Careful|Ehtiyotkor;Honest|Halol;Important|Muhim`,

`Sun|Quyosh;Moon|Oy;Star|Yulduz;Sky|Osmon;Cloud|Bulut;Rain|Yomg‘ir;Snow|Qor;Wind|Shamol;Storm|Bo‘ron;Weather|Ob-havo;Hot|Issiq;Cold|Sovuq;Warm|Iliq;Cool|Salqin;Spring|Bahor;Summer|Yoz;Autumn|Kuz;Winter|Qish;Season|Fasl;Tree|Daraxt;Flower|Gul;Grass|Maysa;Leaf|Barg;Forest|O‘rmon;River|Daryo;Lake|Ko‘l;Sea|Dengiz;Mountain|Tog‘;Earth|Yer;Nature|Tabiat`,

`Cat|Mushuk;Dog|It;Bird|Qush;Horse|Ot;Cow|Sigir;Sheep|Qo‘y;Goat|Echki;Pig|Cho‘chqa;Duck|O‘rdak;Hen|Tovuq;Rabbit|Quyon;Mouse|Sichqon;Lion|Sher;Tiger|Yo‘lbars;Elephant|Fil;Monkey|Maymun;Bear|Ayiq;Wolf|Bo‘ri;Fox|Tulki;Deer|Kiyik;Snake|Ilon;Frog|Qurbaqa;Turtle|Toshbaqa;Bee|Asalari;Butterfly|Kapalak;Ant|Chumoli;Fly|Pashsha;Spider|O‘rgimchak;Insect|Hasharot;Animal|Hayvon`,

`Red|Qizil;Blue|Ko‘k;Green|Yashil;Yellow|Sariq;Black|Qora;White|Oq;Brown|Jigarrang;Pink|Pushti;Purple|Binafsha;Turquoise|Feruza rang;Grey|Kulrang;Gold|Oltin rang;Silver|Kumush rang;Color|Rang;Shirt|Ko‘ylak;T-shirt|Futbolka;Trousers|Shim;Jeans|Jinsi shim;Dress|Ko‘ylak;Skirt|Yubka;Jacket|Kurtka;Coat|Palto;Shoes|Oyoq kiyim;Socks|Paypoq;Hat|Shlyapa;Cap|Kepka;Scarf|Sharf;Gloves|Qo‘lqop;Belt|Kamar;Clothes|Kiyimlar`,

`One|Bir;Two|Ikki;Three|Uch;Four|To‘rt;Five|Besh;Six|Olti;Seven|Yetti;Eight|Sakkiz;Nine|To‘qqiz;Ten|O‘n;Eleven|O‘n bir;Twelve|O‘n ikki;Thirteen|O‘n uch;Fourteen|O‘n to‘rt;Fifteen|O‘n besh;Sixteen|O‘n olti;Seventeen|O‘n yetti;Eighteen|O‘n sakkiz;Nineteen|O‘n to‘qqiz;Twenty|Yigirma;Thirty|O‘ttiz;Forty|Qirq;Fifty|Ellik;Sixty|Oltmish;Seventy|Yetmish;Eighty|Sakson;Ninety|To‘qson;Hundred|Yuz;Thousand|Ming;First|Birinchi`,

`Monday|Dushanba;Tuesday|Seshanba;Wednesday|Chorshanba;Thursday|Payshanba;Friday|Juma;Saturday|Shanba;Sunday|Yakshanba;Week|Hafta;Month|Oy;Year|Yil;Today|Bugun;Tomorrow|Ertaga;Yesterday|Kecha;Morning|Ertalab;Afternoon|Tushdan keyin;Evening|Kechqurun;Night|Tun;Hour|Soat;Minute|Daqiqa;Second|Soniya;Time|Vaqt;Early|Erta;Late|Kech;Now|Hozir;Soon|Tez orada;Always|Har doim;Usually|Odatda;Sometimes|Ba’zan;Never|Hech qachon;Often|Tez-tez`,

`Street|Ko‘cha;Road|Yo‘l;City|Shahar;Village|Qishloq;Country|Mamlakat;Town|Shaharcha;Shop|Do‘kon;Market|Bozor;Bank|Bank;Park|Bog‘;Station|Bekat;Airport|Aeroport;Hotel|Mehmonxona;Restaurant|Restoran;Cafe|Kafe;Hospital|Kasalxona;Pharmacy|Dorixona;Library|Kutubxona;Museum|Muzey;Cinema|Kinoteatr;Office|Ofis;Factory|Zavod;Farm|Ferma;Church|Cherkov;Mosque|Masjid;Bridge|Ko‘prik;Building|Bino;Address|Manzil;Place|Joy;Center|Markaz`,

`Car|Mashina;Bus|Avtobus;Train|Poyezd;Plane|Samolyot;Bicycle|Velosiped;Motorcycle|Mototsikl;Taxi|Taksi;Truck|Yuk mashinasi;Boat|Qayiq;Ship|Kema;Highway|Magistral yo‘l;Traffic|Yo‘l harakati;Driver|Haydovchi;Passenger|Yo‘lovchi;Ticket|Chipta;Travel|Sayohat;Trip|Safar;Journey|Sayohat;Backpack|Ryukzak;Suitcase|Chamadon;Passport|Pasport;Direction|Yo‘nalish;Arrival|Yetib kelish;Departure|Jo‘nab ketish;Left|Chap;Right|O‘ng;Straight|To‘g‘ri;Near|Yaqin;Far|Uzoq;Distance|Masofa`,

`Money|Pul;Price|Narx;Cost|Qiymat;Cheap|Arzon;Expensive|Qimmat;Shopkeeper|Do‘kondor;Customer|Xaridor;Seller|Sotuvchi;Buyer|Xaridor;Cash|Naqd pul;Card|Karta;Coin|Tanga;Note|Banknota;Wallet|Hamyon;Purse|Hamyoncha;Change|Qaytim;Bill|Hisob;Sale|Savdo;Supermarket|Supermarket;Store|Do‘kon;Product|Mahsulot;Item|Buyum;Size|O‘lcham;Weight|Og‘irlik;Kilo|Kilogramm;Gram|Gramm;Piece|Dona;Pair|Juft;Enough|Yetarli;Extra|Qo‘shimcha`,

`Phone|Telefon;Mobile|Mobil telefon;Computer|Kompyuter;Laptop|Noutbuk;Screen|Ekran;Keyboard|Klaviatura;Mouse|Sichqoncha;Internet|Internet;Website|Veb-sayt;Email|Elektron pochta;Message|Xabar;Photo|Surat;Video|Video;Camera|Kamera;Radio|Radio;Television|Televizor;News|Yangiliklar;Music|Musiqa;Song|Qo‘shiq;Movie|Film;Game|O‘yin;App|Ilova;Password|Parol;File|Fayl;Download|Yuklab olish;Upload|Yuklash;Search|Qidirmoq;Click|Bosmoq;Share|Ulashmoq;Online|Onlayn`,

`Quince|Behi;Pear|Nok;Peach|Shaftoli;Plum|Olxo‘ri;Cherry|Gilos;Strawberry|Qulupnay;Watermelon|Tarvuz;Melon|Qovun;Apricot|O‘rik;Pomegranate|Anor;Fig|Anjir;Date|Xurmo;Pineapple|Ananas;Mango|Mango;Coconut|Kokos;Cucumber|Bodring;Cabbage|Karam;Pepper|Qalampir;Garlic|Sarimsoq;Bean|Loviya;Pea|No‘xat;Corn|Makkajo‘xori;Pumpkin|Qovoq;Mushroom|Qo‘ziqorin;Lettuce|Salat bargi;Flour|Un;Honey|Asal;Jam|Murabbo;Cake|Tort;Biscuit|Pechenye`,

`Cook|Ovqat pishirmoq;Wash|Yuvmoq;Dust|Chang artmoq;Sweep|Supurmoq;Mop|Pol artmoq;Cut|Kesmoq;Break|Sindirmoq;Fix|Tuzatmoq;Build|Qurmoq;Draw|Chizmoq;Paint|Bo‘yamoq;Dance|Raqsga tushmoq;Sing|Qo‘shiq aytmoq;Smile|Tabassum qilmoq;Laugh|Kulmoq;Whisper|Pichirlamoq;Jump|Sakramoq;Swim|Suzmoq;Drive|Haydamoq;Ride|Minmoq;Glide|Sirpanib uchmoq;Climb|Chiqmoq;Fall|Yiqilmoq;Carry|Ko‘tarmoq;Push|Itarmoq;Pull|Tortmoq;Throw|Otmoq;Catch|Tutmoq;Touch|Tegmoq;Drop|Tushirib yubormoq`,

`Discover|Kashf qilmoq;Choose|Tanlamoq;Decide|Qaror qilmoq;Plan|Rejalashtirmoq;Adjust|Moslashtirmoq;Move|Harakatlanmoq;Turn|Burilmoq;Follow|Ergashmoq;Lead|Boshqarmoq;Stop|To‘xtamoq;Continue|Davom ettirmoq;Return|Qaytmoq;Leave|Ketmoq;Arrive|Yetib kelmoq;Enter|Kirmoq;Exit|Chiqmoq;Pass|O‘tmoq;Cross|Kesib o‘tmoq;Reach|Yetib bormoq;Explore|Kezmoq;Stay|Qolmoq;Visit|Tashrif buyurmoq;Invite|Taklif qilmoq;Join|Qo‘shilmoq;Accept|Qabul qilmoq;Refuse|Rad etmoq;Agree|Rozi bo‘lmoq;Promise|Va’da bermoq;Explain|Tushuntirmoq;Describe|Tasvirlamoq`
];

// Kunlik so‘zlarni mavjud dastur formatiga aylantiramiz.
const beginnerDaily = beginnerDays.flatMap(day =>
  day.split(";").map(item => {
    const [english, uzbek] = item.split("|");
    return [
      english,
      uzbek,
      "",
      `I can use "${english}" in English.`,
      `Men ingliz tilida "${uzbek}" so‘zini ishlata olaman.`,
      "noun"
    ];
  })
);

// ==================== OTHER VOCABULARY ====================

const vocabulary = {
  beginner: {
    general: [
      ["apple","Olma","ˈæp.əl","I eat an apple.","Men olma yeyman.","noun"],
      ["book","Kitob","bʊk","This is my book.","Bu mening kitobim.","noun"],
      ["water","Suv","ˈwɔː.tər","I drink water.","Men suv ichaman.","noun"],
      ["house","Uy","haʊs","My house is big.","Mening uyim katta.","noun"],
      ["friend","Do‘st","frend","He is my friend.","U mening do‘stim.","noun"],
      ["family","Oila","ˈfæm.əl.i","I love my family.","Men oilamni yaxshi ko‘raman.","noun"],
      ["school","Maktab","skuːl","I go to school.","Men maktabga boraman.","noun"],
      ["food","Ovqat","fuːd","The food is good.","Ovqat yaxshi.","noun"],
      ["mother","Ona","ˈmʌð.ər","My mother is kind.","Onam mehribon.","noun"],
      ["father","Ota","ˈfɑː.ðər","My father works.","Otam ishlaydi.","noun"],
      ["go","Bormoq","ɡəʊ","I go to work.","Men ishga boraman.","verb"],
      ["come","Kelmoq","kʌm","Come here, please.","Iltimos, bu yerga kel.","verb"],
      ["eat","Yemoq","iːt","We eat dinner.","Biz kechki ovqat yeymiz.","verb"],
      ["drink","Ichmoq","drɪŋk","Drink some water.","Biroz suv ich.","verb"],
      ["read","O‘qimoq","riːd","I read every day.","Men har kuni o‘qiyman.","verb"],
      ["write","Yozmoq","raɪt","Write your name.","Ismingizni yozing.","verb"],
      ["work","Ishlamoq","wɜːk","They work together.","Ular birga ishlaydi.","verb"],
      ["learn","O‘rganmoq","lɜːn","I learn English.","Men ingliz tilini o‘rganaman.","verb"],
      ["speak","Gapirmoq","spiːk","Speak slowly, please.","Iltimos, sekin gapiring.","verb"],
      ["help","Yordam bermoq","help","Can you help me?","Menga yordam bera olasizmi?","verb"]
    ],
    daily: beginnerDaily
  },

  elementary: {
    general: [
      ["advice","Maslahat","ədˈvaɪs","She gave me good advice.","U menga yaxshi maslahat berdi.","noun"],
      ["journey","Sayohat","ˈdʒɜː.ni","Our journey was long.","Sayohatimiz uzoq bo‘ldi.","noun"],
      ["decision","Qaror","dɪˈsɪʒ.ən","It was a difficult decision.","Bu qiyin qaror edi.","noun"],
      ["experience","Tajriba","ɪkˈspɪə.ri.əns","I have work experience.","Menda ish tajribasi bor.","noun"],
      ["improve","Yaxshilamoq","ɪmˈpruːv","I want to improve my English.","Ingliz tilimni yaxshilamoqchiman.","verb"],
      ["explain","Tushuntirmoq","ɪkˈspleɪn","Please explain this rule.","Iltimos, bu qoidani tushuntiring.","verb"],
      ["prepare","Tayyorlanmoq","prɪˈpeər","We prepare for the exam.","Biz imtihonga tayyorlanamiz.","verb"],
      ["suggest","Taklif qilmoq","səˈdʒest","I suggest another idea.","Men boshqa fikrni taklif qilaman.","verb"]
    ],
    daily: [
      ["neighbour","Qo‘shni","ˈneɪ.bər","Our neighbour is friendly.","Qo‘shnimiz do‘stona.","noun"],
      ["appointment","Uchrashuv","əˈpɔɪnt.mənt","I have an appointment.","Mening uchrashuvim bor.","noun"],
      ["invitation","Taklifnoma","ˌɪn.vɪˈteɪ.ʃən","Thank you for the invitation.","Taklif uchun rahmat.","noun"],
      ["departure","Jo‘nab ketish","dɪˈpɑː.tʃər","The departure is at noon.","Jo‘nab ketish tush payti.","noun"],
      ["arrive","Yetib kelmoq","əˈraɪv","We arrive at six.","Biz soat oltida yetib kelamiz.","verb"],
      ["borrow","Qarzga olmoq","ˈbɒr.əʊ","Can I borrow your pen?","Ruchkangizni olsam bo‘ladimi?","verb"],
      ["return","Qaytarmoq","rɪˈtɜːn","Please return the book.","Iltimos, kitobni qaytaring.","verb"],
      ["invite","Taklif qilmoq","ɪnˈvaɪt","I will invite my friends.","Do‘stlarimni taklif qilaman.","verb"]
    ]
  },

  pre: {
    general: [
      ["achievement","Yutuq","əˈtʃiːv.mənt","This is a great achievement.","Bu katta yutuq.","noun"],
      ["responsibility","Mas’uliyat","rɪˌspɒn.səˈbɪl.ə.ti","Responsibility is important.","Mas’uliyat muhim.","noun"],
      ["opportunity","Imkoniyat","ˌɒp.əˈtjuː.nə.ti","This is a good opportunity.","Bu yaxshi imkoniyat.","noun"],
      ["environment","Atrof-muhit","ɪnˈvaɪ.rən.mənt","We must protect the environment.","Biz atrof-muhitni himoya qilishimiz kerak.","noun"],
      ["consider","Ko‘rib chiqmoq","kənˈsɪd.ər","Consider all the options.","Barcha variantlarni ko‘rib chiqing.","verb"],
      ["encourage","Ruhlantirmoq","ɪnˈkʌr.ɪdʒ","Teachers encourage students.","O‘qituvchilar o‘quvchilarni ruhlantiradi.","verb"]
    ],
    daily: [
      ["influence","Ta’sir","ˈɪn.flu.əns","Friends can influence us.","Do‘stlar bizga ta’sir qilishi mumkin.","noun"],
      ["development","Rivojlanish","dɪˈvel.əp.mənt","Education supports development.","Ta’lim rivojlanishni qo‘llab-quvvatlaydi.","noun"],
      ["challenge","Qiyinchilik","ˈtʃæl.ɪndʒ","Every challenge teaches us.","Har bir qiyinchilik bizga saboq beradi.","noun"],
      ["achieve","Erishmoq","əˈtʃiːv","You can achieve your goals.","Maqsadlaringizga erisha olasiz.","verb"],
      ["prevent","Oldini olmoq","prɪˈvent","Exercise can prevent illness.","Mashq kasallikning oldini olishi mumkin.","verb"],
      ["require","Talab qilmoq","rɪˈkwaɪər","This job requires experience.","Bu ish tajriba talab qiladi.","verb"]
    ]
  },

  intermediate: {
    general: [
      ["consequence","Oqibat","ˈkɒn.sɪ.kwəns","Every choice has a consequence.","Har bir tanlovning oqibati bor.","noun"],
      ["perspective","Nuqtayi nazar","pəˈspek.tɪv","Try to see another perspective.","Boshqa nuqtayi nazardan qarashga harakat qiling.","noun"],
      ["maintain","Saqlab turmoq","meɪnˈteɪn","Maintain a healthy lifestyle.","Sog‘lom turmush tarzini saqlang.","verb"],
      ["overcome","Yengib o‘tmoq","ˌəʊ.vəˈkʌm","We can overcome difficulties.","Biz qiyinchiliklarni yengib o‘ta olamiz.","verb"]
    ],
    daily: [
      ["assumption","Taxmin","əˈsʌmp.ʃən","That assumption may be wrong.","Bu taxmin noto‘g‘ri bo‘lishi mumkin.","noun"],
      ["approach","Yondashuv","əˈprəʊtʃ","We need a new approach.","Bizga yangi yondashuv kerak.","noun"],
      ["establish","Tashkil etmoq","ɪˈstæb.lɪʃ","They established a new company.","Ular yangi kompaniya tashkil etishdi.","verb"],
      ["indicate","Ko‘rsatmoq","ˈɪn.dɪ.keɪt","The results indicate progress.","Natijalar rivojlanishni ko‘rsatadi.","verb"]
    ]
  },

  upper: {
    general: [
      ["sustainability","Barqarorlik","səˌsteɪ.nəˈbɪl.ə.ti","Sustainability matters worldwide.","Barqarorlik butun dunyoda muhim.","noun"],
      ["inequality","Tengsizlik","ˌɪn.ɪˈkwɒl.ə.ti","Inequality affects society.","Tengsizlik jamiyatga ta’sir qiladi.","noun"],
      ["undermine","Zaiflashtirmoq","ˌʌn.dəˈmaɪn","Poor planning can undermine progress.","Yomon rejalashtirish taraqqiyotni zaiflashtirishi mumkin.","verb"],
      ["allocate","Taqsimlamoq","ˈæl.ə.keɪt","The school allocates more resources.","Maktab ko‘proq resurs ajratadi.","verb"]
    ],
    daily: [
      ["legislation","Qonunchilik","ˌledʒ.ɪˈsleɪ.ʃən","New legislation was introduced.","Yangi qonunchilik joriy qilindi.","noun"],
      ["contemporary","Zamonaviy","kənˈtem.pər.ər.i","Contemporary art is popular.","Zamonaviy san’at mashhur.","adjective"],
      ["facilitate","Yengillashtirmoq","fəˈsɪl.ɪ.teɪt","Technology can facilitate learning.","Texnologiya o‘rganishni yengillashtirishi mumkin.","verb"],
      ["substantial","Salmoqli","səbˈstæn.ʃəl","There was substantial progress.","Salmoqli rivojlanish bo‘ldi.","adjective"]
    ]
  },

  ielts: {
    general: [
      ["mitigate","Salbiy ta’sirni kamaytirmoq","ˈmɪt.ɪ.ɡeɪt","Governments should mitigate pollution.","Hukumatlar ifloslanishni kamaytirishi kerak.","verb"],
      ["pervasive","Keng tarqalgan","pəˈveɪ.sɪv","Technology has a pervasive influence.","Texnologiya keng ta’sirga ega.","adjective"],
      ["exacerbate","Yanada og‘irlashtirmoq","ɪɡˈzæs.ə.beɪt","Stress can exacerbate problems.","Stress muammolarni kuchaytirishi mumkin.","verb"],
      ["disparity","Nomutanosiblik","dɪˈspær.ə.ti","There is a disparity in income.","Daromadlarda nomutanosiblik bor.","noun"]
    ],
    daily: [
      ["proliferation","Tez ko‘payish","prəˌlɪf.əˈreɪ.ʃən","The proliferation of devices is rapid.","Qurilmalar soni tez ko‘paymoqda.","noun"],
      ["alleviate","Yengillashtirmoq","əˈliː.vi.eɪt","The policy may alleviate poverty.","Bu siyosat kambag‘allikni kamaytirishi mumkin.","verb"],
      ["ambiguous","Noaniq","æmˈbɪɡ.ju.əs","The statement was ambiguous.","Bayonot noaniq edi.","adjective"],
      ["detrimental","Zararli","ˌdet.rɪˈmen.təl","Smoking is detrimental to health.","Chekish sog‘liq uchun zararli.","adjective"]
    ]
  }
};

// ==================== STATE ====================

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

function getWords(level, type = "general") {
  return vocabulary[level]?.[type] || [];
}

// ==================== LEVELS ====================

function renderLevels() {
  $("levelList").innerHTML = levels.map(level => `
    <button class="level-card" data-level="${level.id}">
      <h3>${level.name}</h3>
      <p>${getWords(level.id, "general").length + getWords(level.id, "daily").length} words available</p>
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
  $("generalCount").textContent =
    `${getWords(id, "general").length} words available`;

  showSection("typeSection");
}

// ==================== TYPE SELECTION ====================

document.querySelectorAll("[data-type]").forEach(button => {
  button.addEventListener("click", () => {
    state.type = button.dataset.type;

    if (state.type === "general") {
      renderGeneral();
      showSection("generalSection");
    } else {
      state.goal = 30;

      document.querySelectorAll(".goal-btn").forEach(btn => {
        btn.classList.toggle("active", Number(btn.dataset.goal) === 30);
        btn.disabled = Number(btn.dataset.goal) !== 30;
      });

      updatePlanInfo();
      $("startPlan").disabled = false;
      showSection("planSection");
    }
  });
});

// ==================== DAILY PLAN ====================

function updatePlanInfo() {
  const total = getWords(state.level, "daily").length;
  const days = Math.ceil(total / 30);

  $("planInfo").innerHTML =
    `📚 Jami: <strong>${total}</strong> ta so‘z<br>` +
    `🎯 Kunlik maqsad: <strong>30</strong> ta so‘z<br>` +
    `📅 Umumiy reja: <strong>${days}</strong> kun`;
}

$("startPlan").addEventListener("click", () => {
  state.goal = 30;

  const key = `${state.level}_daily`;
  const saved = state.progress[key] || { day: 1, passed: [] };

  state.day = saved.day || 1;
  state.index = 0;

  loadDailyWords();
});

function loadDailyWords() {
  const all = getWords(state.level, "daily");
  const start = (state.day - 1) * 30;

  state.words = all.slice(start, start + 30);

  if (!state.words.length) {
    alert("🎉 Siz barcha mavjud kunlarni tugatdingiz!");
    showSection("typeSection");
    return;
  }

  $("dayLabel").textContent = `DAY ${state.day}`;
  renderWord();
  showSection("learningSection");
}

// ==================== WORD LEARNING ====================

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
    item[0] === word[0] && item[item.length - 1] === state.level
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
    item[0] === word[0] && item[item.length - 1] === state.level
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

// ==================== GENERAL VOCABULARY ====================

function renderGeneral() {
  const words = getWords(state.level, "general");

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
    : "<p>Bu daraja uchun so‘zlar hali qo‘shilmagan.</p>";
}

$("wordSearch").addEventListener("input", event => {
  const query = event.target.value.toLowerCase().trim();

  const filtered = getWords(state.level, "general").filter(word =>
    word[0].toLowerCase().includes(query) ||
    word[1].toLowerCase().includes(query)
  );

  displayGeneralWords(filtered);
});

// ==================== TEST ====================

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

  const all = [
    ...getWords(state.level, "general"),
    ...getWords(state.level, "daily")
  ];

  const otherWords = all
    .filter(item => item[0] !== word[0])
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [...otherWords, word]
    .sort(() => Math.random() - 0.5);

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

// ==================== TEST RESULT ====================

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

// ==================== FAVORITES ====================

function renderFavorites() {
  $("favoriteWordList").innerHTML = state.favorites.length
    ? state.favorites.map(word => `
      <div class="word-item">
        <strong>${word[0]}</strong>
        <p>${word[1]}</p>
        <p>${word[3]}</p>
      </div>
    `).join("")
    : "<p>Hozircha sevimli so‘zlar yo‘q.</p>";
}

// ==================== PROGRESS ====================

function renderProgress() {
  let html = "";

  levels.forEach(level => {
    const data = state.progress[`${level.id}_daily`] || {
      day: 1,
      passed: []
    };

    const totalDays = level.id === "beginner" ? 20 : 0;

    html += `
      <div class="word-item">
        <strong>${level.name}</strong>
        <p>Ochilgan kun: ${data.day}</p>
        <p>O‘tilgan kunlar: ${data.passed.length}</p>
        ${totalDays ? `<p>Jami kunlar: ${totalDays}</p>` : ""}
      </div>
    `;
  });

  $("progressContent").innerHTML = html;
}

// ==================== BOTTOM NAVIGATION ====================

$("homeNav").addEventListener("click", () => {
  showSection("levelSection");
});

$("favoritesNav").addEventListener("click", () => {
  renderFavorites();
  showSection("favoritesSection");
});

$("progressNav").addEventListener("click", () => {
  renderProgress();
  showSection("progressSection");
});

// ==================== BACK BUTTONS ====================

$("backToLevels").addEventListener("click", () => {
  showSection("levelSection");
});

$("backToTypes").addEventListener("click", () => {
  showSection("typeSection");
});

$("backToPlan").addEventListener("click", () => {
  showSection("planSection");
});

$("backFromGeneral").addEventListener("click", () => {
  showSection("typeSection");
});

$("backFromFavorites").addEventListener("click", () => {
  showSection("levelSection");
});

$("backFromProgress").addEventListener("click", () => {
  showSection("levelSection");
});

// ==================== DARK MODE ====================

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

// ==================== START APP ====================

renderLevels();
showSection("levelSection");
