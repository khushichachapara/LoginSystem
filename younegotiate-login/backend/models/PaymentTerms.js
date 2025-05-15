const mongoose = require('mongoose');

const paymentTermsSchema = new mongoose.Schema({
    creditorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creditor',
        required: true
    },
    fullPaymentDiscount: {
        type: Number,
        required: true,
    },
    installmentPaymentDiscount: {
        type: Number,
        required: true,
    },
    firstPaymentDateDuration: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        
 },
//     updatedAt: {
//         type: Date,
//         default: Date.now,
//     },
// }, {
//     timestamps: true,
    
});
module.exports = mongoose.model('PaymentTerms', paymentTermsSchema);

