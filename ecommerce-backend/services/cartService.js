const Cart = require('../models/Cart');

exports.getCartByUserId = async (userId) => {
  return await Cart.findOne({ userId }).populate('items.productId');
};

exports.addToCart = async (userId, productId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [{ productId }] });
  } else {
    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId });
    }
  }
  return await cart.save();
};

exports.removeFromCart = async (userId, productId) => {
  let cart = await Cart.findOne({ userId });
  cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  return await cart.save();
};

exports.getCartItems = async () => {
  try {
    const cart = await Cart.find();  // Assuming you're using MongoDB or similar
    return cart;
  } catch (error) {
    throw new Error('Error fetching cart items');
  }
};