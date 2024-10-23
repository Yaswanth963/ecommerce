const Wishlist = require('../models/Wishlist');

exports.getWishlistByUserId = async (userId) => {
  return await Wishlist.findOne({ userId }).populate('products');
};

exports.addToWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [productId] });
  } else if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }
  return await wishlist.save();
};

exports.removeFromWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ userId });
  wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
  return await wishlist.save();
};

exports.getWishlistItems = async () => {
  try {
    const wishlist = await Wishlist.find();  // Assuming you're using MongoDB or similar
    return wishlist;
  } catch (error) {
    throw new Error('Error fetching wishlist items');
  }
};