
const crypto = require("crypto");

function generateCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const bytes = crypto.randomBytes(12);

  let code = "";

  for (let i = 0; i < 12; i++) {
    code += characters[bytes[i] % characters.length];
  }

  return code.match(/.{1,4}/g).join("-");
}

module.exports = generateCode;
