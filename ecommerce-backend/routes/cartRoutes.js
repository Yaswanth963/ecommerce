const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');

// Get cart items
router.get('/', async (req, res) => {
  try {
    const cart = await cartService.getCart();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cart." });
  }
});


router.post('/', async (req, res) => {
  try {
    const cartItem = req.body; // Expecting cartItem to have _id and quantity
    const cart = await cartService.addToCart(cartItem);
    res.json(cart);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Failed to add item to cart." });
  }
});


router.patch("/decrement/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const updatedItem = await cartService.decrementItem(cartItemId);
    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Increment item quantity in cart
router.patch("/increment/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const updatedItem = await cartService.incrementItem(cartItemId);
    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cart = await cartService.removeFromCart(req.params.id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart." });
  }
});

module.exports = router;
