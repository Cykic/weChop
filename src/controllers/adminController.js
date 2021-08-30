const Admin = require('../models/adminModel');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');

const authController = require('./authController');

exports.signup = catchAsync(async (req, res, next) => {
  const admin = new Admin();
  const { name, phone, password, confirmPassword } = req.body;

  admin.name = name;
  admin.phone = phone;
  admin.password = password;
  admin.confirmPassword = confirmPassword;

  await admin.save();

  res.status(201).json({
    status: 'success',
    message: 'Your admin account has been created',
    data: { admin }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  // check if email and password parameters exist
  if (!phone || !password) {
    return next(new AppError('Please enter a valid phone and password', 400));
  }

  // check if the phone and password parameters match any existing user
  const admin = await Admin.findOne({ phone }).select('+password');
  if (!admin) return next(new AppError('No Account found for this phone', 404));

  const isPasswordCorrect = await admin.correctPassword(
    password,
    admin.password
  );

  if (!admin || !isPasswordCorrect)
    return next(new AppError('Incorrect Phone or Password', 401));

  authController.sendLoginToken(admin, 200, res);
});
