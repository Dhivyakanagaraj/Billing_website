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

exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBill = await Bill.findByIdAndDelete(id);
    if (!deletedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Server error while deleting bill' });
  }
};
