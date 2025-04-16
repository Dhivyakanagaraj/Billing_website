const Bill = require('../models/Bill');

exports.createBill = async (req, res) => {
  try {
    console.log('Received invoice data:', req.body);
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json({ message: 'Bill saved successfully', bill });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save bill', error: error.message });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bills', error: error.message });
  }
};
