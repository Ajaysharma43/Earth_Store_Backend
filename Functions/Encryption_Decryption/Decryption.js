const CryptoJS = require('crypto-js')

function Decryption(Encrypted){
    const Decrypted = CryptoJS.AES.decrypt(String(Encrypted), process.env.ENCRYPTION_DECRYPTION_KEY);    
  return Decrypted.toString(CryptoJS.enc.Utf8)
}

module.exports = Decryption