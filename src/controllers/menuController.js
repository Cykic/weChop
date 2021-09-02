const Menu = require('../models/menuModel');
const catchAsync = require('../error/catchAsync');
// const AppError = require('../error/appError');
const crudFactory = require('../factory/crudFactory');

exports.createMenu = catchAsync(async (req, res, next) => {
  const images = req.files.map(file => file.location);
  const { name, description, category, price } = req.body;
  const menu = await Menu.create({
    name,
    description,
    images,
    category,
    price,
    uploadedBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    message: 'Menu created successfully',
    data: { menu }
  });
});

exports.updateMenu = crudFactory.updateOne(Menu);

exports.getAllMenu = crudFactory.getAll(Menu);

exports.getMenu = crudFactory.getOne(Menu);

exports.deleteMenu = crudFactory.deleteOne(Menu);

exports.upload = crudFactory.upload;
