const mongoose = require('mongoose');

const creditorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true } // store only this, never confirmPassword
});

module.exports = mongoose.model('Creditor', creditorSchema);
