const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/', authController.getUsers);

module.exports = router;