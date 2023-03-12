const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/:id', userController.getUserById);
router.get('/product/:id', userController.getProduct);
router.get('/products', userController.getAllProducts);
router.get('/products/:category', userController.getProductsByCategory);
router.get('/products/search/:search', userController.getProductsBySearch);
router.post('/login', userController.logIn);
router.post('/register', userController.registerUser);
router.post('/addToCart', userController.addToCart);

module.exports = router;