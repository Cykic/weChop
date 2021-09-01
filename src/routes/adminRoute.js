const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.route('/signup').post(adminController.signup);
router.route('/verify').post(adminController.verify);
router.route('/login').post(adminController.login);

router.route('/:id').delete(adminController.deleteAdmin);

module.exports = router;
