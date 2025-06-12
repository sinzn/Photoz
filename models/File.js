const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: String,
  fileName: String,
  filePath: String,
  fileType: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
