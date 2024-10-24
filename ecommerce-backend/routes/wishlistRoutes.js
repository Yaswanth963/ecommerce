const express = require('express');
const router = express.Router();
const wishlistService = require('../services/wishlistService');

// Get user wishlist
router.get('/', async (req, res) => {
  const wishlist = await wishlistService.getWishlistByUserId(req.params.userId);
  res.json(wishlist);
});

// Add product to wishlist
router.post('/:productId', async (req, res) => {
  const wishlist = await wishlistService.addToWishlist(req.params.userId, req.params.productId);
  res.json(wishlist);
});

// Remove product from wishlist
router.delete('/:productId', async (req, res) => {
  const wishlist = await wishlistService.removeFromWishlist(req.params.userId, req.params.productId);
  res.json(wishlist);
});

router.get('/', async (req, res) => {
  try {
    const wishlistItems = await wishlistService.getWishlistItems();
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist items', error });
  }
});

module.exports = router;
