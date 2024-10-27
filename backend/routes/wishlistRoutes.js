const express = require('express');
const Wishlist = require('../models/Wishlist');

const router = express.Router();

// Get wishlist items
router.get('/', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne().populate('items.productId');
    res.json(wishlist || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to wishlist
router.post('/', async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne();
    if (!wishlist) {
      wishlist = new Wishlist({ items: [] });
    }

    const existingItem = wishlist.items.find(item => item.productId.toString() === productId);
    if (!existingItem) {
      wishlist.items.push({ productId });
      await wishlist.save();
    }

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove item from wishlist
router.delete('/:productId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne();
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== req.params.productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Move item from wishlist to cart
router.post('/move-to-cart/:productId', async (req, res) => {
  const Cart = require('../models/Cart'); // Import here to avoid circular dependency
  try {
    const wishlist = await Wishlist.findOne();
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    const item = wishlist.items.find(item => item.productId.toString() === req.params.productId);
    if (item) {
      // Remove item from wishlist
      // wishlist.items = wishlist.items.filter(i => i.productId.toString() !== req.params.productId);
      // await wishlist.save();

      // Add item to cart
      let cart = await Cart.findOne();
      if (!cart) {
        cart = new Cart({ items: [] });
      }

      const existingCartItem = cart.items.find(cartItem => cartItem.productId.toString() === req.params.productId);
      if (existingCartItem) {
        existingCartItem.quantity += 1;
      } else {
        cart.items.push({ productId: req.params.productId, quantity: 1 });
      }
      await cart.save();

      res.json({ message: 'Item moved to cart', wishlist, cart });
    } else {
      res.status(404).json({ message: 'Item not found in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
