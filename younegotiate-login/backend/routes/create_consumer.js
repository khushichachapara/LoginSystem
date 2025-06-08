const express = require('express');
const router = express.Router();
const Consumer = require('../models/create_consumer');
const Creditor = require('../models/creditor');
const NegotiationOffer = require('../models/negotiationoffer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require("../middleware/verifyToken");
const Offer = require('../models/Counteroffer');
const JWT_SECRET = process.env.JWT_SECRET;

//create consumer

router.post('/create', verifyToken, async (req, res) => {
    const { firstname, lastname, dob, email, ssn, mobilenumber, balance, accountnumber } = req.body;


    if (!firstname || !lastname || !dob || !email || !ssn || !balance || !accountnumber || !mobilenumber) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }

    try {
        const consumerExist = await Consumer.findOne({ email: email });
        // const lastnameExist = await Consumer.findOne({ lastname: lastname });
        const ssnExist = await Consumer.findOne({ ssn: ssn });
        const accountnumberExist = await Consumer.findOne({ accountnumber: accountnumber });

        if (consumerExist) {
            return res.status(422).json({ error: "Email already exists", field: "email" });
            // } else if (lastnameExist) {
            //     return res.status(422).json({ error: "LastName already exists ", field: "lastname" });
        } else if (ssnExist) {
            return res.status(422).json({ error: "SSN already exists", field: "ssn" });
        } else if (accountnumberExist) {
            return res.status(422).json({ error: "Account number already exists", field: "accountnumber" });
        }

        const hashedSSN = await bcrypt.hash(ssn, 10);
        const ssnLast4 = ssn.slice(-4); // get last 4 digits only

        const consumer = new Consumer({
            firstname, lastname, dob, email, ssn: hashedSSN, ssnLast4, mobilenumber, balance, accountnumber, creditor: req.user.id,
        });
        await consumer.save();
        res.status(201).json({ message: "Consumer created successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: "Failed to create consumer" });

    }
});

//consumer Logged in

router.post('/consumerlogin', async (req, res) => {
    const { lastname, dob, ssn } = req.body;
    if (!lastname || !dob || !ssn) {
        return res.status(400).json({ message: "Please Enter All the Fields" });
    }
    try {
        const consumer = await Consumer.findOne({ lastname, dob });

        if (!consumer) {
            return res.status(400).json({ message: 'Invalid consumer!' })
        }
        const isMatch = await bcrypt.compare(ssn, consumer.ssn);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid consumer!' });
        }
        const token = jwt.sign(
            { id: consumer._id.toString(), ssn: consumer.ssn },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(200).json({
            message: 'Login successfully',
            token: token,
            consumerId: consumer._id,
            user: { id: consumer.id, lastname: consumer.lastname, ssn: consumer.ssn }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//get consumer details

router.get('/getConsumers', verifyToken, async (req, res) => {
    const { id } = req.user; // Get the user ID from the token destructured from req.user
    try {

        if (req.query.id) { // If `id` is passed as a query parameter, fetch that specific consumer
            const consumer = await Consumer.findOne({ _id: req.query.id, creditor: req.user.id });
            if (!consumer) {
                return res.status(404).json({ error: "Consumer not found" });
            }
            return res.status(200).json({ consumer });
        }

        const consumers = await Consumer.find({ creditor: req.user.id }); // Fetch all consumers
        //console.log(consumers)
        res.status(200).json({ consumers }); // Send consumers as a response
    } catch (err) {
        console.error("Error fetching consumers: ", err);
        res.status(500).json({ error: "Failed to fetch consumers" });
    }
});

//get consumer details by id

router.get("/getConsumerById/:id", verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const consumer = await Consumer.findById(id)
            .populate("creditor", "name email ") // populate only name and email from creditor
            .select("-ssn"); // exclude sensitive field

        //console.log("Fetched consumer =>", consumer);


        if (!consumer) {
            return res.status(404).json({ error: "Consumer not found" });
        }

        res.status(200).json(consumer);



    } catch (error) {
        console.error("Error fetching consumer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//submit negotiation request

router.post('/sendnegotiationoffer', verifyToken, async (req, res) => {
    const { offertype, paymentdiscount, installmentamount, duration, paymentdate, note } = req.body;
    const consumerId = req.user.id;



    if (!offertype || !paymentdiscount || !paymentdate || !consumerId) {
        return res.status(422).json({ message: ' please fill all reqired fiels...' });
    }

    try {
        const consumer = await Consumer.findById(consumerId).populate('creditor');

        if (!consumer) {
            return res.status(400).json({ message: 'Consumer not found' });
        }
       const creditorId = consumer.creditor._id;

   
        if (!creditorId) {
            return res.status(400).json({ message: 'Creditor not found for this consumer' });
        }

        if ((installmentamount && !duration) || (!installmentamount && duration)) {
            return res.status(422).json({ message: 'When you have Select Installment Type You have to Provide Both Installment Amount and Duration' });
        }

        const negotiationoffer = new NegotiationOffer({
            offertype, paymentdiscount, installmentamount, duration, paymentdate, note, creditor: creditorId, consumer:consumerId , status: req.body.status || 'pending',
        });
        const savedOffer =  await negotiationoffer.save();
        res.status(201).json({ message: "offer save successfully", offerId: savedOffer._id });

    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: "Failed to create negotiation offer", details: err.message });

    }

});

//get counter offer by creditor this can be get by creditor and consumer both

router.get("/getcounteroffer", async (req, res) => {
  const { consumerId, creditorId } = req.query; 
  
  //console.log('res query param',req.query);

  if (!consumerId && !creditorId) {
    return res.status(400).json({ error: "consumerId or creditorId is required" });
  }

  try {
    let offers;
    
    // Fetch offers based on which ID is provided
    if (consumerId) {
      // If consumerId is provided, fetch offers given to the consumer
      offers = await Offer.find({ consumerId });
    } else if (creditorId) {
      // If creditorId is provided, fetch offers made by the creditor
      offers = await Offer.find({ creditorId });
    } else {
      return res.status(400).json({ error: "Either consumerId or creditorId must be provided" });
    }

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching offers" });
  }
});

//get negotiation theire own by consumer them selves

router.get("/getbyconsumer", async (req, res) => {
    //console.log("Query Param consumerId:", req.query.consumerId);
    const { consumerId } = req.query;

  if (!consumerId) {
    return res.status(400).json({ error: "consumerId is required" });
  }

  try {
    const offers = await NegotiationOffer.find({ consumer: consumerId })
      .populate("creditor") // optional, agar creditor ka naam bhi chahiye
      .sort({ createdAt: -1 });

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch negotiation offers for consumer" });
  }
});

module.exports = router;


