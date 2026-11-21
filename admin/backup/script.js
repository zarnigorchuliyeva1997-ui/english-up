
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // Hozircha haqiqiy Firebase backup tizimi ulanmagan.
  // Shu sababli backup yaratish va tiklash tugmalari o‘chiq qoladi.

  const createButton = $("createBackup");
  const restoreButton = $("restoreBackup");
  const history = $("backupHistory");

  if ($("lastBackup")) {
    $("lastBackup").textContent = "Hozircha yo‘q";
  }

  if ($("backupCount")) {
    $("backupCount").textContent = "0";
  }

  if ($("backupStatus")) {
    $("backupStatus").textContent = "Kutilmoqda";
  }

  if (createButton) {
    createButton.disabled = true;
    createButton.title = "Firebase integratsiyasi talab qilinadi";
  }

  if (restoreButton) {
    restoreButton.disabled = true;
    restoreButton.title = "Firebase integratsiyasi talab qilinadi";
  }

  if (history) {
    history.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          Hozircha backup tarixi mavjud emas.
        </td>
      </tr>
    `;
  }

  console.info("English Up Backup UI yuklandi.");
})();
