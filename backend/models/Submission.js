const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  calculationType: {
    type: String,
    enum: ['residential', 'commercial', 'wardrobe'],
    required: true
  },
  calculationData: {
    type: Object,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Submission', submissionSchema);