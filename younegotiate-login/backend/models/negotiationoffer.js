const mongoose = require('mongoose');

const negotiationOfferSchema = new mongoose.Schema({
    offertype: { type: String, required: true },
    paymentdiscount: { type: Number, required: true },
    installmentamount: { type: Number },
    duration: { type: Number },
    paymentdate: { type: Date, required: true },
    note: { type: String },
    creditor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creditor', // assuming your creditor model is named 'Creditor'
        required: true
    },
    consumer: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer', // make sure this matches your Consumer model name
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},
);
module.exports = mongoose.model('NegotiationOffer', negotiationOfferSchema);
