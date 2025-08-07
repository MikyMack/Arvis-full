const mongoose = require('mongoose');

const realEstateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Sale', 'Rent'],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    highlights: {
      type: [String],
      default: []
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        seoAlt: { type: String, default: '' }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RealEstate', realEstateSchema);
