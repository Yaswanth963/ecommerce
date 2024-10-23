const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Get all products
router.get('/', async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

// Get product by ID
router.get('/:id', async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json(product);
});

// Create a new product
router.post('/', async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.json(product);
});

module.exports = router;
