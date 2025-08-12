const mongoose = require('mongoose');

const mainBannerSchema = new mongoose.Schema({
  title: String,

  image: String,
  link: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MainBanner', mainBannerSchema);
