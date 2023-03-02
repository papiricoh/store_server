const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/:id', userController.getUserById);
router.post('/login', userController.logIn);
router.post('/register', userController.registerUser);

module.exports = router;