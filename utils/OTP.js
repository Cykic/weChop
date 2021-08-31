const crypto = require('crypto');

exports.generate = function() {
  // 1.) generate random 4 digit statusCode
  const code = Math.floor(Math.random() * 8999 + 1000);
  // 2.)hash it

  const hash = crypto
    .createHash('md5')
    .update(`${code}`)
    .digest('hex');

  return { hash, code };
};

exports.hash = function(code) {
  const hash = crypto
    .createHash('md5')
    .update(`${code}`)
    .digest('hex');

  return hash;
};
