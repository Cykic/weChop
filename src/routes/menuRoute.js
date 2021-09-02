const express = require('express');
const menuController = require('../controllers/menuController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protectedAdmin);
router
  .route('/')
  .get(menuController.getAllMenu)
  .post(menuController.upload.array('images', 5), menuController.createMenu);

router
  .route('/:id')
  .get(menuController.getMenu)
  .patch(menuController.updateMenu)
  .delete(menuController.deleteMenu);

module.exports = router;
