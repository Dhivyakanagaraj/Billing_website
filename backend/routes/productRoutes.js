const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add new product
router.post('/add', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    await product.save();
    res.status(201).json({ msg: 'Product added', product });
  } catch (err) {
    res.status(400).json({ msg: 'Error adding product', error: err.message });
  }
});

// Get all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching products', error: err.message });
  }
});

// Get product by name (for billing)
router.get('/get/:name', async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.name });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Error retrieving product', error: err.message });
  }
});

// Update product by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(400).json({ msg: 'Error updating product', error: err.message });
  }
});

// Delete product by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ msg: 'Error deleting product', error: err.message });
  }
});

module.exports = router;
