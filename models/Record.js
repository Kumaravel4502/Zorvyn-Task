const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify the type (income or expense)']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please specify the date of the transaction'],
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

RecordSchema.index({ date: -1, type: 1 });
RecordSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Record', RecordSchema);
