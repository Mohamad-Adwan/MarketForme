// models/Settings.js
const mongoose = require('mongoose');

const globalsSchema = new mongoose.Schema({
  showPrice: {
    type: Boolean,
    default: true,
  },
  allowmakeorder: {
    type: Boolean,
    default: true,
  }
  // Add more global toggles if needed
}, { timestamps: true });

module.exports = mongoose.model('Settings', globalsSchema);
