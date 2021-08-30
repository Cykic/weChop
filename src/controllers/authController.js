const jwt = require('jsonwebtoken');

const generateToken = user =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

exports.sendLoginToken = (user, statuscode, res) => {
  const token = generateToken(user);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  // cookie
  res.cookie('jwt', token, cookieOption);

  res.status(statuscode).json({
    status: 'success',
    token
  });
};
