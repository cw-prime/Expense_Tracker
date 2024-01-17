const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  receipt: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }]
});

module.exports = mongoose.model('Expense', ExpenseSchema);
