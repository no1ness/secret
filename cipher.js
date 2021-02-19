const crypto = require('crypto');

const algorithm = 'aes256';
const inputEncoding = 'utf8';
const outputEncoding = 'hex';
const ivlength = 16  // AES blocksize

function keyFromHash(hash) {
  return Buffer.from(hash.substr(7, 32), 'latin1');
}

function encrypt(info, hash) {
  const key = keyFromHash(hash);
  const iv = crypto.randomBytes(ivlength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let ciphered = cipher.update(info, inputEncoding, outputEncoding);
  ciphered += cipher.final(outputEncoding);
  const ciphertext = iv.toString(outputEncoding) + ':' + ciphered
  return ciphertext;
}

function decrypt(ciphertext, key) {
  const components = ciphertext.split(':');
  const iv_from_ciphertext = Buffer.from(components.shift(), outputEncoding);
  const decipher = crypto.createDecipheriv(algorithm, key, iv_from_ciphertext);
  let deciphered = decipher.update(components.join(':'), outputEncoding,
    inputEncoding);
  deciphered += decipher.final(inputEncoding);
  return deciphered;
}

module.exports = {
  keyFromHash,
  encrypt,
  decrypt,
}