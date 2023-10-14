// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');

router.post('/add-to-cart/:productId', protect, addToCart);
router.get('/get-cart', protect, getCart);
router.delete('/remove-from-cart/:productId', protect, removeFromCart);

module.exports = router;