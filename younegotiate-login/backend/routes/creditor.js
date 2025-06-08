const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Creditor = require('../models/creditor');
const Consumer = require('../models/create_consumer'); // Import the Consumer model
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken'); // Import the verifyToken middleware
const JWT_SECRET = process.env.JWT_SECRET;
const PaymentTerm = require('../models/paymentTerms'); // Import the PaymentTerm model
const NegotiationOffer = require("../models/negotiationoffer");
const CounterOffer = require('../models/Counteroffer');



//register a creditor

router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    //console.log("Data Received",req.body);

     if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    
    try {
        const existingUserByEmail = await Creditor.findOne({ email });
        const existingUserByName = await Creditor.findOne({ name });

        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (existingUserByName) {
            return res.status(400).json({ message: 'User with This Name already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new creditor instance
        const newCreditor = new Creditor({ name, email, password: hashedPassword});
        await newCreditor.save(); // this creates the document in MongoDB
        res.status(201).json({ message: 'Creditor registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});


router.get('/dashboard', verifyToken, (req, res) => {
    // If the token is valid and not expired, this will be executed
    res.status(200).json({ message: "authorized user! Welcome to your dashboard", user: req.user });
});

//login a creditor

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //console.log("Data Received",req.body);

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password' });
    }

    try {
        // Find creditor with matching email and password
        const creditor = await Creditor.findOne({ email });

        if (!creditor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, creditor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const token = jwt.sign(
            { id: creditor._id.toString(), email: creditor.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: 'Login successfully',
            token: token,
            user: { id: creditor.id, name: creditor.name, email: creditor.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

//logout a creditor not using though

router.post('/logout', async (req, res) => {

    res.status(200).json({ message: 'Logout successful (frontend should delete token)' });

});

//set payment terms of a creditor for all consumer comman

router.post('/paymentterms', verifyToken, async (req, res) => {
    const creditorId = req.user.id; // Get the creditor ID from the token

    const { fullPaymentDiscount, installmentPaymentDiscount, firstPaymentDateDuration } = req.body;

    // console.log("Creditor ID:", creditorId);
    // console.log("Payment Terms Payload:", req.body);

    if (!fullPaymentDiscount || !installmentPaymentDiscount || !firstPaymentDateDuration) {
        return res.status(400).json({ message: 'Please provide all payment term fields' });
    }

    try {
        // Check if payment terms already exist for the creditor
        let paymentTerms = await PaymentTerm.findOne({ creditorId });

        if (paymentTerms) {
            // If payment terms already exist, update them
            paymentTerms.fullPaymentDiscount = fullPaymentDiscount;
            paymentTerms.installmentPaymentDiscount = installmentPaymentDiscount;
            paymentTerms.firstPaymentDateDuration = firstPaymentDateDuration;

            await paymentTerms.save();

            await Creditor.findByIdAndUpdate(creditorId, {
                paymentTerms: paymentTerms._id
            });
            
            return res.status(200).json({ message: 'Payment terms updated successfully', paymentTerms });
        } else {
            // If payment terms don't exist, create new ones
            paymentTerms = new PaymentTerm({
                creditorId,
                fullPaymentDiscount,
                installmentPaymentDiscount,
                firstPaymentDateDuration
            });
            await paymentTerms.save();
            return res.status(201).json({ message: 'Payment terms set successfully', paymentTerms });
        }
    } catch (err) {
        console.error("Error setting payment terms:", err);
        res.status(500).json({ error: err.message });
    }
});

//get payment terms of a creditor for all consumer comman

router.get('/getpaymentterms', verifyToken, async (req, res) => {
    const queryId = req.query.id;


    const creditorId = queryId || req.user.id;
    
    
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    


    try {
        if (queryId) {
            const paymentTerms = await PaymentTerm.findOne({  creditorId });

            if (!paymentTerms) {
                return res.status(404).json({ error: "Payment terms not found" });
            }
            return res.status(200).json({ paymentTerms });

        } else {
            const paymentTerms = await PaymentTerm.find({ creditorId });
            return res.status(200).json({ paymentTerms });
        }
    } catch (err) {
        console.error("Error fetching payment terms:", err);
        res.status(500).json({ error: err.message });
    }
});

//get negotiation offer by all the consumer

router.get("/getnegotiationoffer", async (req, res) => {
   // console.log("Request query:", req.query);
    const { creditorId } = req.query; 
    //console.log(creditorId)
  if (!creditorId) {
    return res.status(400).json({ error: "creditorId is required" });
  }
  try {
    const offers = await NegotiationOffer.find({ creditor:creditorId })
      .populate("consumer") // optional
      .sort({ createdAt: -1 });
      //console.log(offers);
      
    res.status(200).json(offers);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch negotiation offers" });
  }
});

//send counter offer

router.post('/send-counter-offer', verifyToken, async (req, res) => {
    try {
        const {
            offerId,
            installmentamount,
            duration,
            note,
            paymentdate,
            offertype,
            paymentdiscount
        } = req.body;

        //  Basic required field validations
        if (!offerId|| !paymentdate || !offertype || paymentdiscount === undefined) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }
         if ((installmentamount && !duration) || (!installmentamount && duration)) {
            return res.status(400).json({ message: 'Duration is required when Installment Amount is provided.' });
        }
        const originalOffer = await NegotiationOffer.findById(offerId);
         if (!originalOffer) {
            return res.status(404).json({ message: 'Original offer not found' });
        }

        //console.log(originalOffer);
        const consumerId = originalOffer.consumer;
    
        // Save new counter offer
        const newCounterOffer = new CounterOffer({
            offerId,
            consumerId,
            creditorId: req.user.id,
            installmentamount,
            duration,
            note,
            paymentdate,
            offertype,
            paymentdiscount,
            status: req.body.status || 'pending'
        });

        const savedOffer = await newCounterOffer.save();
        //console.log(savedOffer);
        
        res.status(201).json({ message: 'Counter offer sent successfully.', data: savedOffer });

    } catch (error) {
        console.error(' Error in send-counter-offer:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}); 

//update status  

router.patch('/updatenegotiationstatus', verifyToken, async (req, res) => {
    //console.log("PATCH /updatenegotiationstatus hit"); 
    const { offerId, status } = req.body;

    if (!offerId || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid request: Offer ID or status missing/invalid' });
    }

    try {
        const offer = await NegotiationOffer.findById(offerId);

        if (!offer) {
            return res.status(404).json({ message: 'Negotiation offer not found' });
        }

        const loggedInCreditorId = req.user.id;

        if (offer.creditor.toString() !== loggedInCreditorId) {
            return res.status(403).json({ message: 'Unauthorized: You are not the assigned creditor for this offer' });
        }

        offer.status = status;
        const updatedOffer = await offer.save();

        res.status(200).json({ message: 'Offer status updated', offer: updatedOffer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error while updating offer status' });
    }
});

module.exports = router;
