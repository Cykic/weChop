const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');
const APIFeatures = require('../../utils/apiFeatures');

//   GET ONE
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // doc.findOne({ _id: req.params.id })

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc }
    });
  });

// GET ALL
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) filter = { id: req.params.id };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // const doc = await features.query.explain();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc
    });
  });
// UPDATE ONE
exports.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfuly updated',
      data: doc
    });
  });
};
// DELETE ONE
exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({ status: 'success', data: null });
  });
};

const s3 = new aws.S3({
  // s3-bucket image upload
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION
});

exports.upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(
        null,
        `${process.env.NODE_ENV}/menu/image-menu-${
          req.user.id
        }-${Date.now()}.jpeg`
      );
    }
  })
});
