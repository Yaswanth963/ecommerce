const Product = require('../models/Product');

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

exports.createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};