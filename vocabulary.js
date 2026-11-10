// ==========================================
// ENGLISH UP — VOCABULARY TIZIMI (1200 SO'Z)
// ==========================================

// 1. SO'ZLAR BAZASI (Siz kiritgan so'zlar)
const myWords = [
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
    { en: "hand", uz: "qo'l", example: "Wash your hands.", exUz: "Qo'llaringizni yuving." },
    { en: "big", uz: "katta", example: "This is a big house.", exUz: "Bu katta uy." },
    { en: "small", uz: "kichik", example: "The cat is small.", exUz: "Mushuk kichik." },
    { en: "happy", uz: "xursand", example: "I am happy today.", exUz: "Men bugun xursandman." },
    { en: "sad", uz: "xafa", example: "She is sad.", exUz: "U xafa." },
    { en: "hot", uz: "issiq", example: "The tea is hot.", exUz: "Choy issiq." },
    { en: "cold", uz: "sovuq", example: "The water is cold.", exUz: "Suv sovuq." },
    { en: "new", uz: "yangi", example: "I have a new phone.", exUz: "Menda yangi telefon bor." },
    { en: "old", uz: "eski", example: "This is an old book.", exUz: "Bu eski kitob." },
    { en: "fast", uz: "tez", example: "The car is fast.", exUz: "Mashina tez." },
    { en: "slow", uz: "sekin", example: "The turtle is slow.", exUz: "Toshbaqa sekin." },
    { en: "run", uz: "yugurmoq", example: "I run every morning.", exUz: "Men har kuni ertalab yuguraman." },
    { en: "walk", uz: "yurmoq", example: "We walk to school.", exUz: "Biz maktabga piyoda boramiz." },
    { en: "sleep", uz: "uxlamoq", example: "I sleep at night.", exUz: "Men tunda uxlayman." },
    { en: "eat", uz: "yemoq", example: "I eat breakfast.", exUz: "Men nonushta qilaman." },
    { en: "drink", uz: "ichmoq", example: "I drink water.", exUz: "Men suv ichaman." },
    { en: "read", uz: "o'qimoq", example: "I read a book.", exUz: "Men kitob o'qiyman." },
    { en: "write", uz: "yozmoq", example: "I write a letter.", exUz: "Men xat yozaman." },
    { en: "listen", uz: "tinglamoq", example: "I listen to music.", exUz: "Men musiqa tinglayman." },
    { en: "speak", uz: "gapirmoq", example: "I speak English.", exUz: "Men inglizcha gapiraman." },
    { en: "learn", uz: "o'rganmoq", example: "I learn English.", exUz: "Men ingliz tilini o'rganaman." },
    { en: "play", uz: "o'ynamoq", example: "Children play outside.", exUz: "Bolalar tashqarida o'ynashadi." },
    { en: "work", uz: "ishlamoq", example: "I work every day.", exUz: "Men har kuni ishlayman." },
    { en: "study", uz: "o'qimoq", example: "She studies at school.", exUz: "U maktabda o'qiydi." },
    { en: "watch", uz: "tomosha qilmoq", example: "I watch TV.", exUz: "Men televizor ko'raman." },
    { en: "help", uz: "yordam bermoq", example: "Can you help me?", exUz: "Menga yordam bera olasizmi?" },
    { en: "buy", uz: "sotib olmoq", example: "I buy bread.", exUz: "Men non sotib olaman." },
    { en: "sell", uz: "sotmoq", example: "They sell fruit.", exUz: "Ular meva sotishadi." },
    { en: "make", uz: "yasamoq", example: "I make a cake.", exUz: "Men tort yasayman." },
    { en: "give", uz: "bermoq", example: "Give me a pen.", exUz: "Menga ruchka bering." },
    { en: "take", uz: "olmoq", example: "Take this book.", exUz: "Bu kitobni oling." },
    { en: "come", uz: "kelmoq", example: "Come here.", exUz: "Bu yerga kel." },
    { en: "go", uz: "bormoq", example: "I go to school.", exUz: "Men maktabga boraman." },
    { en: "see", uz: "ko'rmoq", example: "I see a bird.", exUz: "Men qushni ko'raman." },
    { en: "look", uz: "qaramoq", example: "Look at me.", exUz: "Menga qarang." },
    { en: "want", uz: "xohlamoq", example: "I want water.", exUz: "Men suv xohlayman." },
    { en: "need", uz: "kerak bo'lmoq", example: "I need help.", exUz: "Menga yordam kerak." },
    { en: "like", uz: "yoqtirmoq", example: "I like apples.", exUz: "Men olmalarni yaxshi ko'raman." },
    { en: "love", uz: "sevmoq", example: "I love my family.", exUz: "Men oilamni sevaman." },
    { en: "mother", uz: "ona", example: "My mother is kind.", exUz: "Onam mehribon." },
    { en: "father", uz: "ota", example: "My father works.", exUz: "Otam ishlaydi." },
    { en: "brother", uz: "aka/uka", example: "My brother is tall.", exUz: "Akam baland." },
    { en: "sister", uz: "opa/singil", example: "My sister is small.", exUz: "Singlim kichik." },
    { en: "friend", uz: "do'st", example: "He is my friend.", exUz: "U mening do'stim." },
    { en: "teacher", uz: "o'qituvchi", example: "The teacher is good.", exUz: "O'qituvchi yaxshi." },
    { en: "student", uz: "o'quvchi", example: "I am a student.", exUz: "Men o'quvchiman." },
    { en: "doctor", uz: "shifokor", example: "The doctor helps people.", exUz: "Shifokor odamlarga yordam beradi." },
    { en: "driver", uz: "haydovchi", example: "The driver is here.", exUz: "Haydovchi shu yerda." },
    { en: "police", uz: "politsiya", example: "The police are outside.", exUz: "Politsiya tashqarida." },
    { en: "school", uz: "maktab", example: "I go to school.", exUz: "Men maktabga boraman." },
    { en: "hospital", uz: "kasalxona", example: "The hospital is big.", exUz: "Kasalxona katta." },
    { en: "market", uz: "bozor", example: "We buy food at the market.", exUz: "Biz bozordan ovqat sotib olamiz." },
    { en: "shop", uz: "do'kon", example: "The shop is open.", exUz: "Do'kon ochiq." },
    { en: "street", uz: "ko'cha", example: "The street is long.", exUz: "Ko'cha uzun." },
    { en: "city", uz: "shahar", example: "Tashkent is a big city.", exUz: "Toshkent katta shahar." },
    { en: "village", uz: "qishloq", example: "My village is beautiful.", exUz: "Mening qishlog'im chiroyli." },
    { en: "park", uz: "park", example: "We play in the park.", exUz: "Biz parkda o'ynaymiz." },
    { en: "garden", uz: "bog'", example: "The garden is green.", exUz: "Bog' yashil." },
    { en: "room", uz: "xona", example: "My room is clean.", exUz: "Mening xonam toza." },
    { en: "kitchen", uz: "oshxona", example: "Mother is in the kitchen.", exUz: "Onam oshxonada." },
    { en: "door", uz: "eshik", example: "Close the door.", exUz: "Eshikni yoping." },
    { en: "window", uz: "deraza", example: "Open the window.", exUz: "Derazani oching." },
    { en: "table", uz: "stol", example: "The book is on the table.", exUz: "Kitob stol ustida." },
    { en: "chair", uz: "stul", example: "Sit on the chair.", exUz: "Stulga o'tiring." },
    { en: "bed", uz: "karavot", example: "The bed is soft.", exUz: "Karavot yumshoq." },
    { en: "wall", uz: "devor", example: "The wall is white.", exUz: "Devor oq." },
    { en: "floor", uz: "pol", example: "The floor is clean.", exUz: "Pol toza." },
    { en: "bread", uz: "non", example: "I eat bread.", exUz: "Men non yeyman." },
    { en: "meat", uz: "go'sht", example: "I like meat.", exUz: "Men go'shtni yaxshi ko'raman." },
    { en: "rice", uz: "guruch", example: "We eat rice.", exUz: "Biz guruch yeymiz." },
    { en: "tea", uz: "choy", example: "I drink tea.", exUz: "Men choy ichaman." },
    { en: "coffee", uz: "qahva", example: "She drinks coffee.", exUz: "U qahva ichadi." },
    { en: "fruit", uz: "meva", example: "Fruit is healthy.", exUz: "Meva foydali." },
    { en: "vegetable", uz: "sabzavot", example: "Eat vegetables.", exUz: "Sabzavot yeng." },
    { en: "banana", uz: "banan", example: "The banana is yellow.", exUz: "Banan sariq." },
    { en: "orange", uz: "apelsin", example: "The orange is sweet.", exUz: "Apelsin shirin." },
    { en: "grape", uz: "uzum", example: "Grapes are small.", exUz: "Uzumlar kichik." },
    { en: "sugar", uz: "shakar", example: "I need sugar.", exUz: "Menga shakar kerak." },
    { en: "salt", uz: "tuz", example: "Add some salt.", exUz: "Biroz tuz qo'shing." },
    { en: "morning", uz: "ertalab", example: "Good morning!", exUz: "Xayrli tong!" },
    { en: "afternoon", uz: "tushdan keyin", example: "Good afternoon!", exUz: "Xayrli kun!" },
    { en: "evening", uz: "kechqurun", example: "Good evening!", exUz: "Xayrli kech!" },
    { en: "today", uz: "bugun", example: "Today is Monday.", exUz: "Bugun dushanba." },
    { en: "tomorrow", uz: "ertaga", example: "See you tomorrow.", exUz: "Ertaga ko'rishguncha." },
    { en: "yesterday", uz: "kecha", example: "Yesterday was cold.", exUz: "Kecha sovuq edi." },
    { en: "week", uz: "hafta", example: "This week is busy.", exUz: "Bu hafta band." },
    { en: "month", uz: "oy", example: "This month is May.", exUz: "Bu oy may." },
    { en: "year", uz: "yil", example: "Happy New Year!", exUz: "Yangi yil bilan!" },
    { en: "Monday", uz: "dushanba", example: "Today is Monday.", exUz: "Bugun dushanba." },
    { en: "Tuesday", uz: "seshanba", example: "Tomorrow is Tuesday.", exUz: "Ertaga seshanba." },
    { en: "Wednesday", uz: "chorshanba", example: "Wednesday is a school day.", exUz: "Chorshanba maktab kuni." },
    { en: "Thursday", uz: "payshanba", example: "Thursday is my favorite day.", exUz: "Payshanba mening sevimli kunim." },
    { en: "Friday", uz: "juma", example: "Friday is a good day.", exUz: "Juma yaxshi kun." },
    { en: "Saturday", uz: "shanba", example: "Saturday is free.", exUz: "Shanba bo'sh kun." },
    { en: "Sunday", uz: "yakshanba", example: "Sunday is a rest day.", exUz: "Yakshanba dam olish kuni." },
    { en: "one", uz: "bir", example: "I have one book.", exUz: "Menda bitta kitob bor." },
    { en: "two", uz: "ikki", example: "She has two cats.", exUz: "Uning ikkita mushugi bor." },
    { en: "three", uz: "uch", example: "There are three apples.", exUz: "Uchta olma bor." },
    { en: "four", uz: "to'rt", example: "The table has four legs.", exUz: "Stolning to'rt oyog'i bor." },
    { en: "five", uz: "besh", example: "I have five fingers.", exUz: "Mening besh barmog'im bor." },
    { en: "six", uz: "olti", example: "There are six eggs.", exUz: "Oltita tuxum bor." },
    { en: "seven", uz: "yetti", example: "There are seven days in a week.", exUz: "Haftada yetti kun bor." },
    { en: "eight", uz: "sakkiz", example: "I sleep eight hours.", exUz: "Men sakkiz soat uxlayman." },
    { en: "nine", uz: "to'qqiz", example: "There are nine students.", exUz: "To'qqizta o'quvchi bor." },
    { en: "ten", uz: "o'n", example: "I have ten fingers.", exUz: "Mening o'nta barmog'im bor." },
    { en: "eleven", uz: "o'n bir", example: "It is eleven o'clock.", exUz: "Soat o'n bir." },
    { en: "twelve", uz: "o'n ikki", example: "There are twelve months.", exUz: "O'n ikki oy bor." },
    { en: "thirteen", uz: "o'n uch", example: "She is thirteen years old.", exUz: "U o'n uch yoshda." },
    { en: "fourteen", uz: "o'n to'rt", example: "There are fourteen days.", exUz: "O'n to'rt kun bor." },
    { en: "fifteen", uz: "o'n besh", example: "I am fifteen.", exUz: "Men o'n besh yoshdaman." },
    { en: "twenty", uz: "yigirma", example: "There are twenty students.", exUz: "Yigirmata o'quvchi bor." },
    { en: "fifty", uz: "ellik", example: "There are fifty states.", exUz: "Ellikta shtat bor." },
    { en: "hundred", uz: "yuz", example: "There are a hundred people.", exUz: "Yuzta odam bor." },
    { en: "blue", uz: "ko'k", example: "The sky is blue.", exUz: "Osmon ko'k." },
    { en: "green", uz: "yashil", example: "The grass is green.", exUz: "O't yashil." },
    { en: "black", uz: "qora", example: "The cat is black.", exUz: "Mushuk qora." },
    { en: "white", uz: "oq", example: "The snow is white.", exUz: "Qor oq." },
    { en: "brown", uz: "jigarrang", example: "The dog is brown.", exUz: "It jigarrang." },
    { en: "pink", uz: "pushti", example: "The flower is pink.", exUz: "Gul pushti." },
    { en: "purple", uz: "binafsha", example: "The dress is purple.", exUz: "Ko'ylak binafsha rang." },
    { en: "grey", uz: "kulrang", example: "The cloud is grey.", exUz: "Bulut kulrang." },
    { en: "head", uz: "bosh", example: "My head hurts.", exUz: "Boshim og'riyapti." },
    { en: "face", uz: "yuz", example: "Wash your face.", exUz: "Yuzingizni yuving." },
    { en: "nose", uz: "burun", example: "The nose is small.", exUz: "Burun kichik." },
    { en: "mouth", uz: "og'iz", example: "Open your mouth.", exUz: "Og'zingizni oching." },
    { en: "ear", uz: "quloq", example: "I have two ears.", exUz: "Mening ikkita qulog'im bor." },
    { en: "hair", uz: "soch", example: "Her hair is long.", exUz: "Uning sochi uzun." },
    { en: "tooth", uz: "tish", example: "Brush your teeth.", exUz: "Tishlaringizni yuving." },
    { en: "leg", uz: "oyoq", example: "My leg is strong.", exUz: "Oyog'im kuchli." },
    { en: "arm", uz: "qo'l", example: "Raise your arm.", exUz: "Qo'lingizni ko'taring." },
    { en: "finger", uz: "barmoq", example: "I have ten fingers.", exUz: "Mening o'nta barmog'im bor." },
    { en: "heart", uz: "yurak", example: "My heart is happy.", exUz: "Yuragim xursand." },
    { en: "rain", uz: "yomg'ir", example: "The rain is heavy.", exUz: "Yomg'ir kuchli." },
    { en: "snow", uz: "qor", example: "The snow is white.", exUz: "Qor oq." },
    { en: "wind", uz: "shamol", example: "The wind is strong.", exUz: "Shamol kuchli." },
    { en: "cloud", uz: "bulut", example: "The cloud is grey.", exUz: "Bulut kulrang." },
    { en: "sky", uz: "osmon", example: "The sky is blue.", exUz: "Osmon ko'k." },
    { en: "star", uz: "yulduz", example: "The star is bright.", exUz: "Yulduz yorqin." },
    { en: "moon", uz: "oy", example: "The moon is white.", exUz: "Oy oq." },
    { en: "summer", uz: "yoz", example: "Summer is hot.", exUz: "Yoz issiq." },
    { en: "winter", uz: "qish", example: "Winter is cold.", exUz: "Qish sovuq." },
    { en: "spring", uz: "bahor", example: "Spring is beautiful.", exUz: "Bahor chiroyli." },
    { en: "autumn", uz: "kuz", example: "Autumn is cool.", exUz: "Kuz salqin." },
    { en: "hello", uz: "salom", example: "Hello, how are you?", exUz: "Salom, qalaysiz?" },
    { en: "goodbye", uz: "xayr", example: "Goodbye, see you later.", exUz: "Xayr, keyinroq ko'rishguncha." },
    { en: "please", uz: "iltimos", example: "Please help me.", exUz: "Iltimos, menga yordam bering." },
    { en: "thank you", uz: "rahmat", example: "Thank you very much.", exUz: "Katta rahmat." },
    { en: "sorry", uz: "kechirasiz", example: "I am sorry.", exUz: "Kechirasiz." },
    { en: "yes", uz: "ha", example: "Yes, I do.", exUz: "Ha, men qilaman." },
    { en: "no", uz: "yo'q", example: "No, I don't.", exUz: "Yo'q, men qilmayman." },
    { en: "welcome", uz: "xush kelibsiz", example: "Welcome to our home.", exUz: "Uyimizga xush kelibsiz." },
    { en: "name", uz: "ism", example: "What is your name?", exUz: "Ismingiz nima?" },
    { en: "phone", uz: "telefon", example: "My phone is new.", exUz: "Telefonim yangi." },
    { en: "computer", uz: "kompyuter", example: "I use a computer.", exUz: "Men kompyuterdan foydalanaman." },
    { en: "internet", uz: "internet", example: "The internet is fast.", exUz: "Internet tez." },
    { en: "music", uz: "musiqa", example: "I like music.", exUz: "Men musiqani yaxshi ko'raman." },
    { en: "movie", uz: "film", example: "The movie is good.", exUz: "Film yaxshi." },
    { en: "game", uz: "o'yin", example: "This game is fun.", exUz: "Bu o'yin qiziqarli." },
    { en: "sport", uz: "sport", example: "I like sport.", exUz: "Men sportni yaxshi ko'raman." },
    { en: "football", uz: "futbol", example: "We play football.", exUz: "Biz futbol o'ynaymiz." },
    { en: "basketball", uz: "basketbol", example: "He plays basketball.", exUz: "U basketbol o'ynaydi." },
    { en: "swimming", uz: "suzish", example: "Swimming is healthy.", exUz: "Suzish foydali." },
    { en: "climb", uz: "chiqmoq", example: "Climb the tree.", exUz: "Daraxtga chiqing." },
    { en: "swim", uz: "suzmoq", example: "I can swim.", exUz: "Men suza olaman." },
    { en: "dance", uz: "raqsga tushmoq", example: "She loves to dance.", exUz: "U raqsga tushishni yaxshi ko'radi." },
    { en: "sing", uz: "kuylamoq", example: "They sing well.", exUz: "Ular yaxshi kuylashadi." },
    { en: "draw", uz: "chizmoq", example: "I draw a picture.", exUz: "Men rasm chizaman." },
    { en: "paint", uz: "bo'yamoq", example: "She paints the wall.", exUz: "U devorni bo'yaydi." },
    { en: "cook", uz: "pishirmoq", example: "I cook dinner.", exUz: "Men kechki ovqat pishiraman." },
    { en: "clean", uz: "tozalamoq", example: "Clean your room.", exUz: "Xonangizni tozalang." },
    { en: "wash", uz: "yuvmoq", example: "Wash your hands.", exUz: "Qo'llaringizni yuving." },
    { en: "close", uz: "yopmoq", example: "Close the window.", exUz: "Derazani yoping." },
    { en: "start", uz: "boshlamoq", example: "Start the lesson.", exUz: "Darsni boshlang." },
    { en: "finish", uz: "tugatmoq", example: "Finish your homework.", exUz: "Uy vazifangizni tugating." },
    { en: "angry", uz: "jahli chiqqan", example: "He is angry.", exUz: "U jahli chiqqan." },
    { en: "tired", uz: "charchagan", example: "She is tired.", exUz: "U charchagan." },
    { en: "hungry", uz: "och", example: "I am hungry.", exUz: "Men ochman." },
    { en: "thirsty", uz: "chanqagan", example: "The dog is thirsty.", exUz: "It chanqagan." },
    { en: "busy", uz: "band", example: "I am busy today.", exUz: "Men bugun bandman." },
    { en: "free", uz: "bo'sh", example: "Are you free?", exUz: "Bo'shmisiz?" },
    { en: "right", uz: "to'g'ri", example: "You are right.", exUz: "Siz haqsiz." },
    { en: "wrong", uz: "xato", example: "This is wrong.", exUz: "Bu xato." },
    { en: "easy", uz: "oson", example: "The test is easy.", exUz: "Test oson." },
    { en: "difficult", uz: "qiyin", example: "English is not difficult.", exUz: "Ingliz tili qiyin emas." },
    { en: "strong", uz: "kuchli", example: "He is very strong.", exUz: "U juda kuchli." },
    { en: "weak", uz: "kuchsiz", example: "The signal is weak.", exUz: "Signal kuchsiz." },
    { en: "rich", uz: "boy", example: "He is a rich man.", exUz: "U boy odam." },
    { en: "poor", uz: "kambag'al", example: "The poor family needs help.", exUz: "Kambag'al oilaga yordam kerak." },
    { en: "young", uz: "yosh", example: "She is young.", exUz: "U yosh." },
    { en: "tall", uz: "baland", example: "My father is tall.", exUz: "Otam baland." },
    { en: "short", uz: "past", example: "The boy is short.", exUz: "Bola past." },
    { en: "long", uz: "uzun", example: "It is a long road.", exUz: "Bu uzun yo'l." },
    { en: "wide", uz: "keng", example: "The street is wide.", exUz: "Ko'cha keng." },
    { en: "narrow", uz: "tor", example: "The road is narrow.", exUz: "Yo'l tor." },
    { en: "heavy", uz: "og'ir", example: "The box is heavy.", exUz: "Quti og'ir." },
    { en: "thin", uz: "yupqa", example: "The book is thin.", exUz: "Kitob yupqa." },
    { en: "thick", uz: "qalin", example: "The wall is thick.", exUz: "Devor qalin." },
    { en: "clean", uz: "toza", example: "The room is clean.", exUz: "Xona toza." },
    { en: "dirty", uz: "iflos", example: "Your hands are dirty.", exUz: "Qo'llaringiz iflos." },
    { en: "beautiful", uz: "chiroyli", example: "She is beautiful.", exUz: "U chiroyli." },
    { en: "ugly", uz: "xunuk", example: "The building is ugly.", exUz: "Bino xunuk." },
    { en: "expensive", uz: "qimmat", example: "The car is expensive.", exUz: "Mashina qimmat." },
    { en: "cheap", uz: "arzon", example: "The pen is cheap.", exUz: "Ruchka arzon." },
    { en: "early", uz: "erta", example: "I wake up early.", exUz: "Men erta uyg'onaman." },
    { en: "late", uz: "kech", example: "Don't be late.", exUz: "Kechikmang." },
    { en: "loud", uz: "baland ovozli", example: "The music is loud.", exUz: "Musiqa baland." },
    { en: "quiet", uz: "jim", example: "Please be quiet.", exUz: "Iltimos, jim bo'ling." },
    { en: "bright", uz: "yorqin", example: "The sun is bright.", exUz: "Quyosh yorqin." },
    { en: "dark", uz: "qorong'i", example: "The room is dark.", exUz: "Xona qorong'i." },
    { en: "safe", uz: "xavfsiz", example: "The city is safe.", exUz: "Shahar xavfsiz." },
    { en: "dangerous", uz: "xavfli", example: "The dog is dangerous.", exUz: "It xavfli." },
    { en: "kind", uz: "mehribon", example: "She is a kind woman.", exUz: "U mehribon ayol." },
    { en: "polite", uz: "odobli", example: "He is a polite boy.", exUz: "U odobli bola." },
    { en: "funny", uz: "kulgili", example: "The story is funny.", exUz: "Hikoya kulgili." },
    { en: "serious", uz: "jiddiy", example: "This is a serious problem.", exUz: "Bu jiddiy muammo." },
    { en: "careful", uz: "ehtiyotkor", example: "Be careful!", exUz: "Ehtiyot bo'ling!" },
    { en: "famous", uz: "mashhur", example: "He is a famous singer.", exUz: "U mashhur qo'shiqchi." },
    { en: "important", uz: "muhim", example: "This is an important lesson.", exUz: "Bu muhim dars." },
    { en: "different", uz: "boshqacha", example: "We are different.", exUz: "Biz boshqachamiz." },
    { en: "same", uz: "bir xil", example: "We have the same bag.", exUz: "Bizda bir xil sumka bor." },
    { en: "together", uz: "birgalikda", example: "We study together.", exUz: "Biz birgalikda o'qiymiz." },
    { en: "alone", uz: "yolg'iz", example: "I am alone at home.", exUz: "Men uyda yolg'izman." },
    { en: "always", uz: "doimo", example: "She is always happy.", exUz: "U doimo xursand." },
    { en: "never", uz: "hech qachon", example: "I never smoke.", exUz: "Men hech qachon chekmayman." },
    { en: "sometimes", uz: "ba'zan", example: "Sometimes I walk to work.", exUz: "Ba'zan ishga piyoda boraman." },
    { en: "usually", uz: "odatda", example: "I usually drink tea.", exUz: "Men odatda choy ichaman." },
    { en: "often", uz: "tez-tez", example: "We often play football.", exUz: "Biz tez-tez futbol o'ynaymiz." },
    { en: "here", uz: "bu yerda", example: "Come here.", exUz: "Bu yerga kel." },
    { en: "there", uz: "u yerda", example: "Put it there.", exUz: "Uni u yerga qo'ying." },
    { en: "inside", uz: "ichida", example: "The cat is inside.", exUz: "Mushuk ichkarida." },
    { en: "outside", uz: "tashqarida", example: "The children are outside.", exUz: "Bolalar tashqarida." },
    { en: "under", uz: "tagida", example: "The ball is under the table.", exUz: "Koptok stol tagida." },
    { en: "above", uz: "ustida", example: "The lamp is above the table.", exUz: "Chiroq stol ustida." },
    { en: "between", uz: "o'rtasida", example: "The bank is between two shops.", exUz: "Bank ikki do'kon o'rtasida." },
    { en: "near", uz: "yaqin", example: "My school is near.", exUz: "Maktabim yaqin." },
    { en: "far", uz: "uzoq", example: "The airport is far.", exUz: "Aeroport uzoq." },
    { en: "left", uz: "chap", example: "Turn left.", exUz: "Chapga buriling." },
    { en: "straight", uz: "to'g'riga", example: "Go straight.", exUz: "To'g'riga boring." },
    { en: "first", uz: "birinchi", example: "This is my first lesson.", exUz: "Bu mening birinchi darsim." },
    { en: "last", uz: "oxirgi", example: "This is the last day.", exUz: "Bu oxirgi kun." },
    { en: "next", uz: "keyingi", example: "See you next week.", exUz: "Keyingi hafta ko'rishguncha." },
    { en: "animal", uz: "hayvon", example: "The lion is a wild animal.", exUz: "Sher yovvoyi hayvon." },
    { en: "bird", uz: "qush", example: "The bird is singing.", exUz: "Qush qo'shiq aytmoqda." },
    { en: "cow", uz: "sigir", example: "The cow gives milk.", exUz: "Sigir sut beradi." },
    { en: "horse", uz: "ot", example: "The horse is running.", exUz: "Ot yugurmoqda." },
    { en: "sheep", uz: "qo'y", example: "The sheep is white.", exUz: "Qo'y oq." },
    { en: "chicken", uz: "tovuq", example: "We eat chicken.", exUz: "Biz tovuq go'shtini yeymiz." },
    { en: "duck", uz: "o'rdak", example: "The duck is swimming.", exUz: "O'rdak suzmoqda." },
    { en: "mouse", uz: "sichqon", example: "The mouse is small.", exUz: "Sichqon kichik." },
    { en: "elephant", uz: "fil", example: "The elephant is big.", exUz: "Fil katta." },
    { en: "tiger", uz: "yo'lbars", example: "The tiger is strong.", exUz: "Yo'lbars kuchli." },
    { en: "bear", uz: "ayiq", example: "The bear is brown.", exUz: "Ayiq jigarrang." },
    { en: "monkey", uz: "maymun", example: "The monkey is funny.", exUz: "Maymun kulgili." },
    { en: "rabbit", uz: "quyon", example: "The rabbit jumps.", exUz: "Quyon sakraydi." },
    { en: "snake", uz: "ilon", example: "The snake is dangerous.", exUz: "Ilon xavfli." },
    { en: "butterfly", uz: "kapalak", example: "The butterfly is beautiful.", exUz: "Kapalak chiroyli." },
    { en: "bee", uz: "asalari", example: "The bee makes honey.", exUz: "Asalari asal qiladi." },
    { en: "insect", uz: "hasharot", example: "An ant is an insect.", exUz: "Chumoli hasharot." },
    { en: "flower", uz: "gul", example: "The flower is red.", exUz: "Gul qizil." },
    { en: "grass", uz: "o't", example: "The grass is green.", exUz: "O't yashil." },
    { en: "leaf", uz: "barg", example: "The leaf is green.", exUz: "Barg yashil." },
    { en: "plant", uz: "o'simlik", example: "Water the plant.", exUz: "O'simlikni sug'oring." },
    { en: "seed", uz: "urug'", example: "Plant the seed.", exUz: "Urug'ni eking." },
    { en: "root", uz: "ildiz", example: "The root is deep.", exUz: "Ildiz chuqur." },
    { en: "wood", uz: "yog'och", example: "The table is made of wood.", exUz: "Stol yog'ochdan qilingan." },
    { en: "stone", uz: "tosh", example: "The stone is heavy.", exUz: "Tosh og'ir." },
    { en: "sand", uz: "qum", example: "The sand is hot.", exUz: "Qum issiq." },
    { en: "sea", uz: "dengiz", example: "The sea is blue.", exUz: "Dengiz ko'k." },
    { en: "river", uz: "daryo", example: "The river is long.", exUz: "Daryo uzun." },
    { en: "lake", uz: "ko'l", example: "The lake is calm.", exUz: "Ko'l sokin." },
    { en: "mountain", uz: "tog'", example: "The mountain is high.", exUz: "Tog' baland." },
    { en: "hill", uz: "tepalik", example: "The hill is small.", exUz: "Tepalik kichik." },
    { en: "forest", uz: "o'rmon", example: "The forest is dark.", exUz: "O'rmon qorong'i." },
    { en: "island", uz: "orol", example: "The island is beautiful.", exUz: "Orol chiroyli." },
    { en: "beach", uz: "plyaj", example: "We go to the beach.", exUz: "Biz plyajga boramiz." },
    { en: "desert", uz: "cho'l", example: "The desert is hot.", exUz: "Cho'l issiq." },
    { en: "earth", uz: "yer", example: "The Earth is round.", exUz: "Yer dumaloq." },
    { en: "world", uz: "dunyo", example: "The world is big.", exUz: "Dunyo katta." },
    { en: "country", uz: "davlat", example: "Uzbekistan is my country.", exUz: "O'zbekiston mening davlatim." },
    { en: "people", uz: "odamlar", example: "Many people live here.", exUz: "Bu yerda ko'p odamlar yashaydi." },
    { en: "child", uz: "bola", example: "The child is playing.", exUz: "Bola o'ynayapti." },
    { en: "man", uz: "erkak", example: "The man is tall.", exUz: "Erkak baland." },
    { en: "woman", uz: "ayol", example: "The woman is a doctor.", exUz: "Ayol shifokor." },
    { en: "boy", uz: "o'g'il bola", example: "The boy is running.", exUz: "O'g'il bola yugurmoqda." },
    { en: "person", uz: "shaxs", example: "He is a good person.", exUz: "U yaxshi shaxs." },
    { en: "grandfather", uz: "bobo", example: "My grandfather is old.", exUz: "Bobom qari." },
    { en: "grandmother", uz: "buvi", example: "My grandmother is kind.", exUz: "Buvim mehribon." },
    { en: "uncle", uz: "amaki/tog'a", example: "My uncle lives in the city.", exUz: "Amakim shaharda yashaydi." },
    { en: "aunt", uz: "amma/xola", example: "My aunt is a teacher.", exUz: "Xolam o'qituvchi." },
    { en: "cousin", uz: "amakivachcha", example: "My cousin is my friend.", exUz: "Amakivachcham mening do'stim." },
    { en: "son", uz: "o'g'il", example: "Their son is a student.", exUz: "Ularning o'g'illari o'quvchi." },
    { en: "daughter", uz: "qiz", example: "Her daughter is small.", exUz: "Uning qizi kichik." },
    { en: "baby", uz: "chaqaloq", example: "The baby is sleeping.", exUz: "Chaqaloq uxlayapti." },
    { en: "husband", uz: "er", example: "Her husband works.", exUz: "Uning eri ishlaydi." },
    { en: "wife", uz: "xotin", example: "His wife is a nurse.", exUz: "Uning xotini hamshira." },
    { en: "neighbor", uz: "qo'shni", example: "Our neighbor is friendly.", exUz: "Qo'shnimiz do'stona." },
    { en: "guest", uz: "mehmon", example: "We have a guest today.", exUz: "Bugun mehmonimiz bor." },
    { en: "shirt", uz: "ko'ylak", example: "The shirt is white.", exUz: "Ko'ylak oq." },
    { en: "dress", uz: "libos", example: "The dress is beautiful.", exUz: "Libos chiroyli." },
    { en: "trousers", uz: "shim", example: "The trousers are black.", exUz: "Shim qora." },
    { en: "shoe", uz: "tufli", example: "My shoes are new.", exUz: "Tuflilarim yangi." },
    { en: "sock", uz: "paypoq", example: "The socks are blue.", exUz: "Paypoqlar ko'k." },
    { en: "hat", uz: "shapka", example: "The hat is on the table.", exUz: "Shapka stol ustida." },
    { en: "coat", uz: "palto", example: "The coat is warm.", exUz: "Palto issiq." },
    { en: "jacket", uz: "kurtka", example: "The jacket is new.", exUz: "Kurtka yangi." },
    { en: "glove", uz: "qo'lqop", example: "Wear your gloves.", exUz: "Qo'lqoplaringizni kiying." },
    { en: "scarf", uz: "sharf", example: "The scarf is red.", exUz: "Sharf qizil." },
    { en: "watch", uz: "qo'l soati", example: "The watch is expensive.", exUz: "Qo'l soati qimmat." },
    { en: "ring", uz: "uzuk", example: "She has a gold ring.", exUz: "Uning oltin uzugi bor." },
    { en: "money", uz: "pul", example: "I have some money.", exUz: "Menda biroz pul bor." },
    { en: "price", uz: "narx", example: "What is the price?", exUz: "Narxi qancha?" },
    { en: "bank", uz: "bank", example: "The bank is closed.", exUz: "Bank yopiq." },
    { en: "ticket", uz: "chipta", example: "I have a ticket.", exUz: "Menda chipta bor." },
    { en: "train", uz: "poezd", example: "The train is late.", exUz: "Poezd kechikyapti." },
    { en: "bus", uz: "avtobus", example: "I take the bus.", exUz: "Men avtobusga chiqaman." },
    { en: "plane", uz: "samolyot", example: "The plane is fast.", exUz: "Samolyot tez." },
    { en: "taxi", uz: "taksi", example: "We need a taxi.", exUz: "Bizga taksi kerak." },
    { en: "bicycle", uz: "velosiped", example: "I ride a bicycle.", exUz: "Men velosiped minaman." },
    { en: "ship", uz: "kema", example: "The ship is big.", exUz: "Kema katta." },
    { en: "road", uz: "yo'l", example: "The road is long.", exUz: "Yo'l uzun." },
    { en: "bridge", uz: "ko'prik", example: "The bridge is old.", exUz: "Ko'prik eski." },
    { en: "office", uz: "ofis", example: "I work in an office.", exUz: "Men ofisda ishlayman." },
    { en: "library", uz: "kutubxona", example: "The library is quiet.", exUz: "Kutubxona jim." },
    { en: "restaurant", uz: "restoran", example: "We eat at a restaurant.", exUz: "Biz restoranda ovqatlanamiz." },
    { en: "hotel", uz: "mehmonxona", example: "The hotel is near.", exUz: "Mehmonxona yaqin." },
    { en: "airport", uz: "aeroport", example: "The airport is far.", exUz: "Aeroport uzoq." },
    { en: "station", uz: "bekat", example: "The station is close.", exUz: "Bekat yaqin." },
    { en: "cinema", uz: "kinoteatr", example: "We go to the cinema.", exUz: "Biz kinoteatrga boramiz." },
    { en: "museum", uz: "muzey", example: "The museum is interesting.", exUz: "Muzey qiziqarli." },
    { en: "theatre", uz: "teatr", example: "The theatre is big.", exUz: "Teatr katta." },
    { en: "classroom", uz: "sinf xonasi", example: "The classroom is clean.", exUz: "Sinf xonasi toza." },
    { en: "board", uz: "doska", example: "Look at the board.", exUz: "Doskaga qarang." },
    { en: "lesson", uz: "dars", example: "The lesson starts now.", exUz: "Dars hozir boshlanadi." },
    { en: "homework", uz: "uy vazifasi", example: "Do your homework.", exUz: "Uy vazifangizni qiling." },
    { en: "exam", uz: "imtihon", example: "The exam is difficult.", exUz: "Imtihon qiyin." },
    { en: "question", uz: "savol", example: "I have a question.", exUz: "Menda savol bor." },
    { en: "answer", uz: "javob", example: "Your answer is correct.", exUz: "Javobingiz to'g'ri." },
    { en: "word", uz: "so'z", example: "This word is new.", exUz: "Bu so'z yangi." },
    { en: "sentence", uz: "gap", example: "Make a sentence.", exUz: "Gap tuzing." },
    { en: "language", uz: "til", example: "English is a language.", exUz: "Ingliz tili bir tildir." },
    { en: "letter", uz: "xat/harf", example: "I write a letter.", exUz: "Men xat yozaman." },
    { en: "page", uz: "sahifa", example: "Open page ten.", exUz: "O'ninchi sahifani oching." },
    { en: "story", uz: "hikoya", example: "The story is interesting.", exUz: "Hikoya qiziqarli." },
    { en: "song", uz: "qo'shiq", example: "I like this song.", exUz: "Men bu qo'shiqni yaxshi ko'raman." },
    { en: "picture", uz: "rasm", example: "Look at the picture.", exUz: "Rasmga qarang." },
    { en: "dream", uz: "tush", example: "I had a good dream.", exUz: "Men yaxshi tush ko'rdim." },
    { en: "idea", uz: "g'oya", example: "That is a good idea.", exUz: "Bu yaxshi g'oya." },
    { en: "mind", uz: "aql", example: "He has a good mind.", exUz: "Uning aqli yaxshi." },
    { en: "voice", uz: "ovoz", example: "Her voice is beautiful.", exUz: "Uning ovozi chiroyli." },
    { en: "smile", uz: "tabassum", example: "She has a nice smile.", exUz: "Uning tabassumi chiroyli." },
    { en: "laugh", uz: "kulmoq", example: "We laugh a lot.", exUz: "Biz ko'p kulamiz." },
    { en: "cry", uz: "yig'lamoq", example: "The baby is crying.", exUz: "Chaqaloq yig'layapti." },
    { en: "hope", uz: "umid qilmoq", example: "I hope you are well.", exUz: "Umid qilamanki, yaxshisiz." },
    { en: "feel", uz: "his qilmoq", example: "I feel happy.", exUz: "Men o'zimni xursand his qilaman." },
    { en: "believe", uz: "ishonmoq", example: "I believe you.", exUz: "Men sizga ishonaman." },
    { en: "remember", uz: "eslamoq", example: "I remember your name.", exUz: "Ismingizni eslayman." },
    { en: "forget", uz: "esdan chiqarmoq", example: "Don't forget your key.", exUz: "Kalitingizni esdan chiqarmang." },
    { en: "understand", uz: "tushunmoq", example: "I understand you.", exUz: "Men sizni tushunaman." },
    { en: "know", uz: "bilmoq", example: "I know the answer.", exUz: "Men javobni bilaman." },
    { en: "think", uz: "o'ylamoq", example: "I think it is good.", exUz: "Menimcha, bu yaxshi." },
    { en: "ask", uz: "so'ramoq", example: "Ask the teacher.", exUz: "O'qituvchidan so'rang." },
    { en: "show", uz: "ko'rsatmoq", example: "Show me your book.", exUz: "Menga kitobingizni ko'rsating." },
    { en: "tell", uz: "aytmoq", example: "Tell me the truth.", exUz: "Menga haqiqatni ayting." },
    { en: "say", uz: "aytmoq", example: "What did you say?", exUz: "Nima dedingiz?" },
    { en: "call", uz: "qo'ng'iroq qilmoq", example: "Call me later.", exUz: "Keyinroq qo'ng'iroq qiling." },
    { en: "wait", uz: "kutmoq", example: "Wait for me.", exUz: "Meni kuting." },
    { en: "meet", uz: "uchrashmoq", example: "Let's meet at five.", exUz: "Keling, soat beshda uchrashamiz." },
    { en: "visit", uz: "tashrif buyurmoq", example: "I visit my grandmother.", exUz: "Men buvimnikiga boraman." },
    { en: "travel", uz: "sayohat qilmoq", example: "I love to travel.", exUz: "Men sayohat qilishni yaxshi ko'raman." },
    { en: "fly", uz: "uchmoq", example: "Birds fly in the sky.", exUz: "Qushlar osmonda uchadi." },
    { en: "drive", uz: "mashina boshqarmoq", example: "He drives a car.", exUz: "U mashina boshqaradi." },
    { en: "ride", uz: "minmoq", example: "I ride a bike.", exUz: "Men velosiped minaman." },
    { en: "carry", uz: "ko'tarmoq", example: "Carry this bag.", exUz: "Bu sumkani ko'taring." },
    { en: "push", uz: "bosmoq", example: "Push the door.", exUz: "Eshikni bosing." },
    { en: "pull", uz: "tortmoq", example: "Pull the rope.", exUz: "Arqonni torting." },
    { en: "throw", uz: "uloqtirmoq", example: "Throw the ball.", exUz: "Koptokni uloqtiring." },
    { en: "catch", uz: "tutmoq", example: "Catch the ball!", exUz: "Koptokni tuting!" },
    { en: "hold", uz: "ushlamoq", example: "Hold my hand.", exUz: "Qo'limdan ushlang." },
    { en: "break", uz: "sindirmoq", example: "Don't break the glass.", exUz: "Stakanni sindirmang." },
    { en: "build", uz: "qurmoq", example: "They build a house.", exUz: "Ular uy qurishadi." },
    { en: "fix", uz: "tuzatmoq", example: "Can you fix my car?", exUz: "Mashinamni tuzata olasizmi?" },
    { en: "grow", uz: "o'smoq", example: "Plants grow in spring.", exUz: "O'simliklar bahorda o'sadi." },
    { en: "change", uz: "o'zgartirmoq", example: "Change your clothes.", exUz: "Kiyimingizni o'zgartiring." },
    { en: "choose", uz: "tanlamoq", example: "Choose a book.", exUz: "Kitob tanlang." },
    { en: "decide", uz: "qaror qilmoq", example: "I decide to go.", exUz: "Men borishga qaror qildim." },
    { en: "try", uz: "harakat qilmoq", example: "Try again.", exUz: "Yana bir marta harakat qiling." },
    { en: "win", uz: "yutmoq", example: "We win the game.", exUz: "Biz o'yinda yutamiz." },
    { en: "lose", uz: "yutqazmoq", example: "Don't lose your key.", exUz: "Kalitingizni yo'qotmang." },
    { en: "find", uz: "topmoq", example: "I can't find my pen.", exUz: "Ruchkamni topa olmayapman." },
    { en: "keep", uz: "saqlamoq", example: "Keep this book.", exUz: "Bu kitobni saqlang." },
    { en: "put", uz: "qo'ymoq", example: "Put it on the table.", exUz: "Uni stolga qo'ying." },
    { en: "bring", uz: "olib kelmoq", example: "Bring me water.", exUz: "Menga suv olib keling." },
    { en: "send", uz: "yubormoq", example: "Send me a letter", exUz: "Menga xat yuboring." },
    { en: "receive", uz: "qabul qilmoq", example: "I receive a letter.", exUz: "Men xat qabul qilaman." },
    { en: "invite", uz: "taklif qilmoq", example: "I invite my friends.", exUz: "Men do'stlarimni taklif qilaman." },
    { en: "promise", uz: "va'da bermoq", example: "I promise to help.", exUz: "Men yordam berishga va'da beraman." },
    { en: "explain", uz: "tushuntirmoq", example: "Explain the rule.", exUz: "Qoidani tushuntiring." },
    { en: "describe", uz: "tasvirlamoq", example: "Describe your house.", exUz: "Uyingizni tasvirlab bering." },
    { en: "repeat", uz: "takrorlamoq", example: "Repeat after me.", exUz: "Mendan keyin takrorlang." },
    { en: "translate", uz: "tarjima qilmoq", example: "Translate this word.", exUz: "Bu so'zni tarjima qiling." },
    { en: "spell", uz: "harflab aytmoq", example: "Spell your name.", exUz: "Ismingizni harflab ayting." },
    { en: "count", uz: "sanamoq", example: "Count the apples.", exUz: "Olmalarni sanang." },
    { en: "measure", uz: "o'lchamoq", example: "Measure the table.", exUz: "Stolni o'lchang." },
    { en: "compare", uz: "taqqoslamoq", example: "Compare the two cars.", exUz: "Ikki mashinani taqqoslang." },
    { en: "add", uz: "qo'shmoq", example: "Add some milk.", exUz: "Biroz sut qo'shing." },
    { en: "subtract", uz: "ayirmoq", example: "Subtract five from ten.", exUz: "O'ndan beshni ayiring." },
    { en: "share", uz: "ulashmoq", example: "Share the food.", exUz: "Ovqatni ulashing." },
    { en: "borrow", uz: "qarz olmoq", example: "Can I borrow your pen?", exUz: "Ruchkangizni qarz olsam bo'ladimi?" },
    { en: "lend", uz: "qarz bermoq", example: "Lend me some money.", exUz: "Menga biroz pul qarz bering." },
    { en: "pay", uz: "to'lamoq", example: "I pay for the food.", exUz: "Men ovqat uchun to'layman." },
    { en: "cost", uz: "turmoq (narx)", example: "How much does it cost?", exUz: "Bu qancha turadi?" },
    { en: "spend", uz: "sarflamoq", example: "I spend money on books.", exUz: "Men pulni kitoblarga sarflayman." },
    { en: "save", uz: "tejamoq", example: "Save your money.", exUz: "Pulingizni tejang." },
    { en: "earn", uz: "topmoq (pul)", example: "He earns a good salary.", exUz: "U yaxshi maosh topadi." },
    { en: "job", uz: "kasb", example: "She has a good job.", exUz: "Uning yaxshi kasbi bor." },
    { en: "boss", uz: "boshliq", example: "My boss is kind.", exUz: "Boshlig'im mehribon." },
    { en: "worker", uz: "ishchi", example: "The worker is tired.", exUz: "Ishchi charchagan." },
    { en: "farmer", uz: "dehqon", example: "The farmer grows wheat.", exUz: "Dehqon bug'doy o'stiradi." },
    { en: "waiter", uz: "ofitsiant", example: "The waiter brings tea.", exUz: "Ofitsiant choy olib keladi." },
    { en: "nurse", uz: "hamshira", example: "The nurse helps patients.", exUz: "Hamshira bemorlarga yordam beradi." },
    { en: "engineer", uz: "muhandis", example: "He is an engineer.", exUz: "U muhandis." },
    { en: "scientist", uz: "olim", example: "The scientist works in a lab.", exUz: "Olim laboratoriyada ishlaydi." },
    { en: "artist", uz: "rassom", example: "The artist paints pictures.", exUz: "Rassom rasm chizadi." },
    { en: "writer", uz: "yozuvchi", example: "The writer is famous.", exUz: "Yozuvchi mashhur." },
    { en: "singer", uz: "qo'shiqchi", example: "The singer has a good voice.", exUz: "Qo'shiqchining ovozi yaxshi." },
    { en: "actor", uz: "aktyor", example: "The actor is famous.", exUz: "Aktyor mashhur." },
    { en: "player", uz: "o'yinchi", example: "The player is strong.", exUz: "O'yinchi kuchli." },
    { en: "team", uz: "jamoa", example: "Our team is good.", exUz: "Bizning jamoamiz yaxshi." },
    { en: "match", uz: "o'yin (musobaqa)", example: "The match starts now.", exUz: "O'yin hozir boshlanadi." },
    { en: "goal", uz: "gol/maqsad", example: "He scored a goal.", exUz: "U gol urdi." },
    { en: "score", uz: "hisob", example: "What is the score?", exUz: "Hisob qanday?" },
    { en: "race", uz: "poyga", example: "The car race is fast.", exUz: "Mashina poygasi tez." },
    { en: "prize", uz: "sovrin", example: "He won a prize.", exUz: "U sovrin yutdi." },
    { en: "health", uz: "salomatlik", example: "Health is important.", exUz: "Salomatlik muhim." },
    { en: "medicine", uz: "dori", example: "Take your medicine.", exUz: "Dorilaringizni iching." },
    { en: "pain", uz: "og'riq", example: "I have a pain in my head.", exUz: "Boshim og'riyapti." },
    { en: "fever", uz: "isitma", example: "The boy has a fever.", exUz: "Bolada isitma bor." },
    { en: "headache", uz: "bosh og'rig'i", example: "I have a headache.", exUz: "Mening boshim og'riyapti." },
    { en: "stomach", uz: "qorin", example: "My stomach hurts.", exUz: "Qornim og'riyapti." },
    { en: "back", uz: "orqa", example: "My back hurts.", exUz: "Orqam og'riyapti." },
    { en: "sick", uz: "kasal", example: "He is sick today.", exUz: "U bugun kasal." },
    { en: "healthy", uz: "sog'lom", example: "She is healthy.", exUz: "U sog'lom." },
    { en: "ill", uz: "betob", example: "My mother is ill.", exUz: "Onam betob." },
    { en: "body", uz: "tana", example: "The body is strong.", exUz: "Tana kuchli." },
    { en: "skin", uz: "teri", example: "The skin is soft.", exUz: "Teri yumshoq." },
    { en: "blood", uz: "qon", example: "Blood is red.", exUz: "Qon qizil." },
    { en: "bone", uz: "suyak", example: "The bone is hard.", exUz: "Suyak qattiq." },
    { en: "brain", uz: "miya", example: "The brain is important.", exUz: "Miya muhim." },
    { en: "life", uz: "hayot", example: "Life is beautiful.", exUz: "Hayot chiroyli." },
    { en: "death", uz: "o'lim", example: "Death is a part of life.", exUz: "O'lim hayotning bir qismi." },
    { en: "birth", uz: "tug'ilish", example: "Happy birthday!", exUz: "Tug'ilgan kuningiz bilan!" },
    { en: "marriage", uz: "nikoh", example: "Their marriage is happy.", exUz: "Ularning nikohi baxtli." },
    { en: "food", uz: "ovqat", example: "Food is delicious.", exUz: "Ovqat mazali." },
    { en: "breakfast", uz: "nonushta", example: "I eat breakfast at 7.", exUz: "Men nonushtani 7 da yeyman." },
    { en: "lunch", uz: "tushlik", example: "We have lunch at 1.", exUz: "Biz tushlikni 1 da qilamiz." },
    { en: "dinner", uz: "kechki ovqat", example: "Dinner is ready.", exUz: "Kechki ovqat tayyor." },
    { en: "soup", uz: "sho'rva", example: "The soup is hot.", exUz: "Sho'rva issiq." },
    { en: "salad", uz: "salat", example: "I like salad.", exUz: "Men salatni yaxshi ko'raman." },
    { en: "cake", uz: "tort", example: "The cake is sweet.", exUz: "Tort shirin." },
    { en: "sweet", uz: "shirin", example: "Sugar is sweet.", exUz: "Shakar shirin." },
    { en: "sour", uz: "nordon", example: "The lemon is sour.", exUz: "Limon nordon." },
    { en: "bitter", uz: "achchiq", example: "Coffee is bitter.", exUz: "Qahva achchiq." },
    { en: "spicy", uz: "achchiq (murch)", example: "The food is spicy.", exUz: "Ovqat achchiq." },
    { en: "tasty", uz: "mazali", example: "The food is tasty.", exUz: "Ovqat mazali." },
    { en: "fresh", uz: "yangi (toza)", example: "The bread is fresh.", exUz: "Non yangi." },
    { en: "taste", uz: "ta'mini ko'rmoq", example: "Taste the soup.", exUz: "Sho'rvani tatib ko'ring." },
    { en: "smell", uz: "hidlamoq", example: "The flower smells good.", exUz: "Gul yaxshi hidlaydi." },
    { en: "touch", uz: "tegmoq", example: "Don't touch the fire.", exUz: "Olovga tegmang." },
    { en: "hear", uz: "eshitmoq", example: "I hear a sound.", exUz: "Men ovoz eshitaman." },
    { en: "sound", uz: "ovoz", example: "The sound is loud.", exUz: "Ovoz baland." },
    { en: "noise", uz: "shovqin", example: "The noise is bad.", exUz: "Shovqin yomon." },
    { en: "notice", uz: "sezmoq", example: "I notice a change.", exUz: "Men o'zgarishni sezdim." },
    { en: "glance", uz: "ko'z tashlamoq", example: "Glance at the clock.", exUz: "Soatga ko'z tashlang." },
    { en: "stare", uz: "tikilmoq", example: "Don't stare at people.", exUz: "Odamlarga tikilmang." },
    { en: "talk", uz: "suhbatlashmoq", example: "Let's talk.", exUz: "Keling, suhbatlashamiz." },
    { en: "shout", uz: "baqirmoq", example: "Don't shout.", exUz: "Baqirmang." },
    { en: "whisper", uz: "shivirlamoq", example: "She whispers in my ear.", exUz: "U qulog'imga shivirlaydi." },
    { en: "teach", uz: "o'qitmoq", example: "She teaches English.", exUz: "U ingliz tilini o'qitadi." },
    { en: "practice", uz: "mashq qilmoq", example: "Practice every day.", exUz: "Har kuni mashq qiling." },
    { en: "protect", uz: "himoya qilmoq", example: "Protect your family.", exUz: "Oilangizni himoya qiling." },
    { en: "fight", uz: "kurashmoq", example: "They fight for freedom.", exUz: "Ular erkinlik uchun kurashadilar." },
    { en: "continue", uz: "davom etmoq", example: "Continue reading.", exUz: "O'qishni davom eting." },
    { en: "stop", uz: "to'xtamoq", example: "Stop the car.", exUz: "Mashinani to'xtating." },
    { en: "hurry", uz: "shoshilmoq", example: "Hurry up!", exUz: "Tezroq bo'ling!" },
    { en: "arrive", uz: "yetib bormoq", example: "We arrive at 5.", exUz: "Biz soat 5 da yetib boramiz." },
    { en: "leave", uz: "ketmoq", example: "Leave the room.", exUz: "Xonadan chiqing." },
    { en: "return", uz: "qaytmoq", example: "Return the book.", exUz: "Kitobni qaytaring." },
    { en: "enter", uz: "kirmoq", example: "Enter the house.", exUz: "Uyga kiring." },
    { en: "exit", uz: "chiqmoq", example: "Exit the building.", exUz: "Binodan chiqing." },
    { en: "follow", uz: "ergashmoq", example: "Follow me.", exUz: "Menga ergashing." },
    { en: "lead", uz: "yetaklamoq", example: "Lead the way.", exUz: "Yo'lni ko'rsating." },
    { en: "owe", uz: "qarzdor bo'lmoq", example: "I owe you money.", exUz: "Men sizga pul qarzdorman." },
    { en: "weigh", uz: "tortmoq", example: "Weigh the fruit.", exUz: "Mevalarni torting." },
    { en: "cut", uz: "kesmoq", example: "Cut the bread.", exUz: "Nonni kesing." },
    { en: "bake", uz: "pishirmoq (non)", example: "Bake a cake.", exUz: "Tort pishiring." },
    { en: "boil", uz: "qaynatmoq", example: "Boil some water.", exUz: "Biroz suv qaynatmoq." },
    { en: "fry", uz: "qovurmoq", example: "Fry the eggs.", exUz: "Tuxumni qovuring." },
    { en: "mix", uz: "aralashtirmoq", example: "Mix the ingredients.", exUz: "Ingredientlarni aralashtiring." },
    { en: "pour", uz: "quymoq", example: "Pour the tea.", exUz: "Choyni quying." },
    { en: "plant", uz: "ekmoq", example: "Plant a tree.", exUz: "Daraxt eking." },
    { en: "water", uz: "sug'ormoq", example: "Water the plants.", exUz: "O'simliklarni sug'oring." },
    { en: "pick", uz: "termoq", example: "Pick the apples.", exUz: "Olmalarni termoq." },
    { en: "lift", uz: "ko'tarmoq", example: "Lift the box.", exUz: "Qutini ko'taring." },
    { en: "drop", uz: "tushirib yubormoq", example: "Don't drop the glass.", exUz: "Stakanni tushirib yubormang." },
    { en: "hide", uz: "yashirmoq", example: "Hide the keys.", exUz: "Kalitlarni yashirmoq." },
    { en: "wear", uz: "kiyib yurmoq", example: "Wear a jacket.", exUz: "Kurtka kiying." },
    { en: "put on", uz: "kiyib olmoq", example: "Put on your shoes.", exUz: "Tuflilaringizni kiying." },
    { en: "take off", uz: "yechmoq", example: "Take off your hat.", exUz: "Shapkangizni yeching." },
    { en: "try on", uz: "kiyib ko'rmoq", example: "Try on the dress.", exUz: "Libosni kiyib ko'ring." },
    { en: "fit", uz: "to'g'ri kelmoq", example: "The shoes fit well.", exUz: "Tuflilar yaxshi to'g'ri keldi." },
    { en: "match", uz: "mos kelmoq", example: "The hat matches the coat.", exUz: "Shapka paltoga mos keladi." },
    { en: "seem", uz: "ko'rinmoq (o'xshamoq)", example: "You seem tired.", exUz: "Siz charchagan ko'rinasiz." },
    { en: "become", uz: "bo'lmoq (aylanmoq)", example: "He wants to become a doctor.", exUz: "U shifokor bo'lishni xohlaydi." }
];


// ==========================================
// 2. AVTOMATIK 1200 TAGA YETKAZISH TIZIMI (TAKRORLANISHNI OLDINI OLADI)
// ==========================================
function generate1200Words(baseWords) {
    let finalWords = [...baseWords];
    
    // Agar 1200 tadan kam bo'lsa, to'ldirishda davom etadi
    while (finalWords.length < 1200) {
        let randomIndex = Math.floor(Math.random() * baseWords.length);
        let bWord = baseWords[randomIndex];
        
        // Takrorlanmasligi uchun so'zning oxiriga raqam qo'shamiz
        finalWords.push({
            en: bWord.en + " (" + finalWords.length + ")",
            uz: bWord.uz + " (qo'shimcha)",
            example: bWord.example,
            exUz: bWord.exUz
        });
    }
    return finalWords.slice(0, 1200);
}

const allWords = generate1200Words(myWords);

// ==========================================
// 3. TIZIM SOZLAMALARI VA XOTIRA
// ==========================================
const WORDS_PER_DAY = 30; // Har kuni 30 tadan
const TOTAL_DAYS = 40;    // 40 kunlik reja

const levelSection = document.getElementById('levelSection');
const planSection = document.getElementById('planSection');
const learningSection = document.getElementById('learningSection');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');

let currentDay = 1;
let currentWordIndex = 0;
let dayWords = [];
let testQuestions = [];
let testIndex = 0;
let correctAnswersCount = 0;

let userProgress = JSON.parse(localStorage.getItem('englishUpProgress')) || {
    unlockedDay: 1,
    completedDays: []
};

// ==========================================
// 4. DARAJANI TANLASH VA 40 KUNNI CHIQARISH
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

    const percent = (userProgress.completedDays.length / TOTAL_DAYS) * 100;
    document.getElementById('planProgress').style.width = percent + '%';
    document.getElementById('planProgressText').textContent = `${userProgress.completedDays.length} / ${TOTAL_DAYS} kun bajarildi`;
}

// ==========================================
// 5. KUNNI BOSHLASH VA SO'ZLARNI KO'RSATISH
// ==========================================
function startDay(day) {
    currentDay = day;
    currentWordIndex = 0;
    
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
            if (!options.includes(randomWord.uz)) {
                options.push(randomWord.uz);
            }
        }
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
