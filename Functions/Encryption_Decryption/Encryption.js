const argon2 = require('argon2');

async function hashPassword(plainText) {
  try {
    if (plainText instanceof Object) {
      plainText = plainText.toString();
    }

    const hashedPassword = await argon2.hash(plainText);
    return hashedPassword;
  } catch (error) {
    console.error('Error during hashing:', error);
    throw new Error('Hashing failed');
  }
}

module.exports = hashPassword;
