const seed = '01ARGOS10!';
const CryptoJS = require('crypto-js');
const { isUndefined } = require('lodash');

function decrypt(encryptedText) {
    return isUndefined(encryptedText) ? undefined : encrypt(encryptedText); 
}

function decryptAES(text) {
  const bytes  = CryptoJS.AES.decrypt(text, seed);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function encrypt(textToEncript) {
  const textCodes = textToEncript.split('').map(char => char.charCodeAt(0));
  const seedCodes = '01ARGOSSERVER10!'.split('').map(char => char.charCodeAt(0));
  const encryptedCodes = textCodes.map((code, index) => {
       return code ^ seedCodes[index % seedCodes.length];
  });

  return String.fromCharCode(...encryptedCodes);
}


module.exports = {
    decrypt,
    decryptAES,
    encrypt,
};