const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  totalWithGST: { type: Number, required: true },
});

const billSchema = new mongoose.Schema({
  shop: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    gstin: { type: String, required: true },
  },
  customer: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    mail: { type: String },
  },
  products: [productSchema],
  totals: {
    subtotal: { type: Number, required: true },
    totalGST: { type: Number, required: true },
    totalWithGST: { type: Number, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
