const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Change this line
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema] // Removed userId as per your request
});

module.exports = mongoose.model('Cart', cartSchema);