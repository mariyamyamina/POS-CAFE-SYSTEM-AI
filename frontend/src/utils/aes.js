import CryptoJS from "crypto-js";

//AES Sectret Key (32 bytes for AES-256)
const KEY = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012");

export const encrypt = (text) => {
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(text, KEY, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7, //AES only encrypts data in 16-byte blocks.so padding adds extra bytes
  });

  return {
    password: encrypted.toString(),
    iv: CryptoJS.enc.Base64.stringify(iv),
  };
};