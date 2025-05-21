const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Add new customer
router.post('/add', async (req, res) => {
  try {
    const { name, mobile, email, address } = req.body;
    const customer = new Customer({ name, mobile, email, address });
    await customer.save();
    res.status(201).json({ msg: 'Customer added', customer });
  } catch (err) {
    res.status(400).json({ msg: 'Error adding customer', error: err.message });
  }
});

// Get all customers
router.get('/all', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching customers', error: err.message });
  }
});

// Get customer by name
router.get('/:mobile', async (req, res) => {
    try {
      const customer = await Customer.findOne({ mobile: req.params.mobile });
      if (!customer) {
        return res.status(404).json({ msg: 'Customer not found' });
      }
      res.json(customer);
    } catch (err) {
      res.status(500).json({ msg: 'Error fetching customer', error: err.message });
    }
  });
  

// Update customer
router.put('/update/:id', async (req, res) => {
  try {
    const { name, mobile, email, address } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, mobile, email, address },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json({ msg: 'Customer updated', updatedCustomer });
  } catch (err) {
    res.status(400).json({ msg: 'Error updating customer', error: err.message });
  }
});

// Delete customer
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json({ msg: 'Customer deleted', deletedCustomer });
  } catch (err) {
    res.status(400).json({ msg: 'Error deleting customer', error: err.message });
  }
});

module.exports = router;
