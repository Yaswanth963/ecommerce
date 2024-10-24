const Cart = require('../models/Cart'); // Assuming you have a Cart model

// Get cart items
const getCart = async () => {
  return await Cart.find(); // Fetch all cart items
};



const addToCart = async (cartItem) => {
  const { _id } = cartItem; // Destructure _id and quantity from the cartItem

  let cart = await Cart.findOne(); // Assuming there's only one cart
  if (!cart) {
    cart = new Cart(); // Create a new cart if one doesn't exist
  }

  console.log('Cart items',cart);
  // Check if the item already exists in the cart
  const existingItem = cart.items.find(item => item._id.toString() === _id);


  if (existingItem) {
    // Update the quantity if the item already exists
    existingItem.quantity += 1; // Adjust this as per your logic
  } else {
    // If the item doesn't exist, add it to the cart
    cart.items.push({ _id, quantity:1 }); // Use _id directly
  }

  await cart.save();
  return cart;
};

// Remove item from cart
const removeFromCart = async (id) => {
  await Cart.findByIdAndDelete(id);
  return getCart(); 
};

const decrementItem = async (cartItemId) => {
  const cart = await getCart();
  const existingItem = cart.items.find(item => item._id.toString() === cartItemId);

  if (!existingItem) {
    throw new Error("Item not found in cart.");
  }

  if (existingItem.quantity > 1) {
    existingItem.quantity -= 1; // Decrement quantity
  } else {
    // If quantity is 1, remove item
    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
  }

  await cart.save();
  return cart;
};

const incrementItem = async (cartItemId, quantity = 1) => {
  let cart = await getCart(); 
  if(cart){
    const existingItem = cart.items.find(item => item._id.toString() === cartItemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ _id: cartItemId, quantity: 1 });
    }
    await cart.save(); // Save the cart
    return cart; // Return the updated cart
  }else{
    const newCart = new Cart({_id: cartItemId, quantity: 1 })
    newCart.save();
    return newCart;
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  incrementItem,
  decrementItem
};