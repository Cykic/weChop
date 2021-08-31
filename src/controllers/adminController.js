const Admin = require('../models/adminModel');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');
const OTP = require('../../utils/OTP');
const sendSms = require('../../utils/sendSms');

const authController = require('./authController');

exports.signup = catchAsync(async (req, res, next) => {
  const otp = OTP.generate();

  const admin = new Admin();
  const { name, phone, password, confirmPassword } = req.body;

  admin.name = name;
  admin.phone = phone;
  admin.password = password;
  admin.confirmPassword = confirmPassword;
  admin.verificationCode = otp.hash;

  await admin.save();
  await sendSms(phone, `Your otp for Admin of weChop is ${otp.code}`);

  res.status(201).json({
    status: 'success',
    message: 'Your admin account has been created'
  });
});

exports.verify = catchAsync(async (req, res, next) => {
  if (!req.body.code) return next(new AppError('Please provide code', 400));

  const { code } = req.body;

  const verificationCode = OTP.hash(code);

  const admin = await Admin.findOneAndUpdate(
    { verificationCode },
    { verified: true, verifiedAt: Date.now() },
    { new: true, select: 'name phone role verified' }
  );

  if (!admin) {
    return next(new AppError('Verification failed, Invalid code', 400));
  }
  res.status(200).json({
    status: 'success',
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
  const admin = await Admin.findOne({ phone, verified: true }).select(
    '+password'
  );
  if (!admin)
    return next(new AppError('No Account found  or user not verified.', 404));

  const isPasswordCorrect = await admin.correctPassword(
    password,
    admin.password
  );

  if (!admin || !isPasswordCorrect)
    return next(new AppError('Incorrect Phone or Password', 401));

  authController.sendLoginToken(admin, 200, res);
});
