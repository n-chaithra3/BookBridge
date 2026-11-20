const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  price: Number,
  condition: { type: String, enum: ['Like New', 'Good', 'Fair'] },
  semester: Number,
  department: String,
  status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Book', bookSchema);
