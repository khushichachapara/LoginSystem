const mongoose = require('mongoose');

const create_consumerSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true ,unique:true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    ssn: { type: String, required: true, unique: true },
    ssnLast4: {
      type: String,
      required: true
    },    
    mobilenumber: { type: String, required: true },
    balance: { type: Number, default: 0,required:true},
    accountnumber: { type: String, required: true, unique: true },
    creditor: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creditor', // assuming your creditor model is named 'Creditor'
        required: true
      },
  
  },
  
);

module.exports = mongoose.model('Consumer', create_consumerSchema);
