const mongoose = require('mongoose');
const PaymentTerms = require('./paymentTerms'); // Assuming you have a PaymentTerms model
//         }


const creditorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,unique:true},
  password: { type: String, required: true }, // store only this, never confirmPassword
  paymentTerms: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentTerms', // Assuming the model name is PaymentTerms
  },
 
});

module.exports = mongoose.model('Creditor', creditorSchema);
