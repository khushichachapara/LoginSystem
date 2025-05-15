const mongoose = require('mongoose');

const counterOfferSchema = new mongoose.Schema({
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NegotiationOffer', // Reference to the original offer
        required: true
    },
    consumerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer',
        required: true
    },
    creditorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creditor', // Reference to the creditor sending the counter offer
        required: true
    },
    installmentamount: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    note: {
        type: String,
    },
    paymentdate: {
        type: Date,
        required: true,
    },
    offertype: {
        type: String,
        required: true,
    },
    paymentdiscount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CounterOffer = mongoose.model('CounterOffer', counterOfferSchema);

module.exports = CounterOffer;
