const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');

// Get user cart
router.get('/:userId', async (req, res) => {
  const cart = await cartService.getCartByUserId(req.params.userId);
  res.json(cart);
});

// Add item to cart
router.post('/:userId/:productId', async (req, res) => {
  const cart = await cartService.addToCart(req.params.userId, req.params.productId);
  res.json(cart);
});

// Remove item from cart
router.delete('/:userId/:productId', async (req, res) => {
  const cart = await cartService.removeFromCart(req.params.userId, req.params.productId);
  res.json(cart);
});

// Get all items in the cart
router.get('/', async (req, res) => {
  try {
    const cartItems = await cartService.getCartItems();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
});


module.exports = router;
