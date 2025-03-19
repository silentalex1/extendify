const bcrypt = require('bcrypt');

function encrypt(data) {
  return bcrypt.hashSync(data, 12);
}

function decrypt(hash, data) {
  return bcrypt.compareSync(data, hash);
}

module.exports = { encrypt, decrypt };
