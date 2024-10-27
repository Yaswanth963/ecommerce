const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// Get cart items
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.productId');;
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment item quantity in cart
router.put('/increment/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === req.params.productId);
    if (item) {
      item.quantity += 1;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Decrement item quantity in cart
router.put('/decrement/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === req.params.productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
      }
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Move item from cart to wishlist
router.post('/move-to-wishlist/:productId', async (req, res) => {
  const Wishlist = require('../models/Wishlist'); // Import here to avoid circular dependency
  try {
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === req.params.productId);
    if (item) {
      // Remove item from cart
      cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
      await cart.save();

      // Add item to wishlist
      let wishlist = await Wishlist.findOne();
      if (!wishlist) {
        wishlist = new Wishlist({ items: [] });
      }
      wishlist.items.push({ productId: req.params.productId });
      await wishlist.save();

      res.json({ message: 'Item moved to wishlist', cart, wishlist });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
