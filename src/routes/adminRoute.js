const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.route('/signup').post(adminController.signup);
router.route('/login').post(adminController.login);

module.exports = router;
