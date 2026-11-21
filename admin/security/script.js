
(() => {
  "use strict";

  const securityStatus = document.getElementById("securityStatus");

  // Bu sahifa hozircha xavfsizlik talablarini ko‘rsatadi.
  // Haqiqiy tekshiruvlar Firebase integratsiyasidan keyin bajariladi.

  const checks = [
    "Admin hisobini Firebase orqali tasdiqlash",
    "Admin custom claims o‘rnatish",
    "Firestore Security Rules yozish",
    "O‘quvchi ma’lumotlarini UID bilan ajratish",
    "Server tomonida muhim amallarni tekshirish",
    "Xavfsizlik hodisalarini qayd etish"
  ];

  if (securityStatus) {
    securityStatus.textContent =
      "Firebase xavfsizlik integratsiyasi kutilmoqda";
  }

  // Sahifada ko‘rsatilgan talablar sonini tekshirish.
  const displayedTasks = document.querySelectorAll(".check-row");

  if (displayedTasks.length !== checks.length) {
    console.warn("Security checklist elementlari soni mos emas.");
  }

  // Xavfsizlik holati Firebase ulanmaguncha tasdiqlanmaydi.
  document.querySelectorAll(".security-state").forEach((item) => {
    item.textContent = "Integratsiya kutilmoqda";
    item.classList.add("pending");
  });

  console.info("English Up Security UI yuklandi.");
})();
