const argon2 = require('argon2');

async function verifyPassword(storedHash, plainText) {
  try {
    const isValid = await argon2.verify(storedHash, plainText);
    return isValid;  // Returns true if the password matches, false otherwise
  } catch (error) {
    console.error('Error during verification:', error);
    throw new Error('Verification failed');
  }
}

module.exports = verifyPassword;
