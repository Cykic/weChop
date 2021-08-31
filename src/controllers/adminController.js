const Admin = require('../models/adminModel');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');
const OTP = require('../../utils/OTP');
const sendSms = require('../../utils/sendSms');

const authController = require('./authController');

exports.signup = catchAsync(async (req, res, next) => {
  const otp = OTP.generate();

  const expireTime = Date.now() + process.env.OTP_EXPIRES_MINUTES * 60000;
  const admin = new Admin();
  const { name, phone, password, confirmPassword } = req.body;
  const message = `Your otp for Admin of weChop is ${otp.code} and it expires in ${process.env.OTP_EXPIRES_MINUTES} minutes`;

  admin.name = name;
  admin.phone = phone;
  admin.password = password;
  admin.confirmPassword = confirmPassword;
  admin.verificationCode = otp.hash;
  admin.verificationExpires = expireTime;

  await admin.save();
  await sendSms(phone, message);

  res.status(201).json({
    status: 'success',
    message: 'Your admin account has been created',
    data: {
      admin
    }
  });
});

exports.verify = catchAsync(async (req, res, next) => {
  if (!req.body.code || !req.body.id)
    return next(new AppError('Please provide code and id', 400));

  const { code, id } = req.body;

  const verificationCode = OTP.hash(code);

  const admin = await Admin.findById(id).select('+verificationCode');

  if (!admin) return next(new AppError('No Account found', 404));

  if (Date.now() > admin.verificationExpires)
    return next(new AppError('Verification code has expired', 400));

  if (verificationCode !== admin.verificationCode)
    return next(new AppError('Verification code is not valid', 400));

  admin.verified = true;
  admin.verifiedAt = Date.now();

  await admin.save({ validateBeforeSave: false });

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
    return next(new AppError('Incorrect Email or Password', 401));

  authController.sendLoginToken(admin, 200, res);
});
