const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/:id', userController.getUserById);
router.get('/products', userController.getAllProducts);
router.get('/products/:category', userController.getProductsByCategory);
router.get('/products/search/:search', userController.getProductsBySearch);
router.post('/login', userController.logIn);
router.post('/register', userController.registerUser);

module.exports = router;