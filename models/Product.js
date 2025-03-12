const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);