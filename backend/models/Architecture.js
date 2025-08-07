const mongoose = require('mongoose');

const architectureSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Urban Design'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        seoAlt: { type: String, default: '' }
      }
    ],
    description: {
      type: String,
      required: false
    },
    budgets: {
      type: String,
      required: false
    },
    highlights: {
      type: [String],
      default: []
    },
    location: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Architecture', architectureSchema);
