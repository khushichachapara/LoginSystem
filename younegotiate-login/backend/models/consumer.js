const mongoose = require('mongoose');
const consumerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    ssn: { type: String, required: true, unique: true },
});
module.exports = mongoose.model('Consumer', consumerSchema);