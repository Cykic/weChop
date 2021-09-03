const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');
const Admin = require('../models/adminModel');

const generateToken = user =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

exports.sendLoginToken = (user, statuscode, req, res) => {
  const token = generateToken(user);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };

  // cookie
  // res.cookie('accessToken', token, cookieOption);
  const { name, phone, role } = user;
  res.status(statuscode).json({
    status: 'success',
    message: 'Successfully Logged in',
    token,
    user: { name, phone, role }
  });
};

// PROTECTED ROUTES

exports.protectedAdmin = catchAsync(async (req, res, next) => {
  // Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // token = req.cookies.accessToken;

  if (!token)
    return next(
      new AppError('You are not Logged in, Login to get access', 401)
    );
  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await Admin.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('Login as Admin to get authorization', 403));
  }
  // GRANT ACCESS TO THE PROTECTED ROUTE
  req.user = freshUser;
  next();
});

// AUTHORIZATION

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user role is part of the role that hass access to the next middleware
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission for this route', 403)
      );
    }
    next();
  };
};
