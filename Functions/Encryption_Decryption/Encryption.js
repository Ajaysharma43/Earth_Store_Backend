const Cryptojs = require('crypto-js')

const Key = process.env.ENCRYPTION_DECRYPTION_KEY;

function Encryption(Plaintext){
    const Encrypted = Cryptojs.AES.encrypt(Plaintext , Key).toString();
    return Encrypted
}

module.exports = Encryption