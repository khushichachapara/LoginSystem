const mongoose = require('mongoose');

const creditorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String // store only this, never confirmPassword
});

module.exports = mongoose.model('Creditor', creditorSchema);
