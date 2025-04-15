const express = require('express');
const router = express.Router();
const Creditor = require('../models/creditor');

// Example route to register a creditor
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log("Data Received",req.body);

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const newCreditor = new Creditor({ name, email, password });
    await newCreditor.save(); // this creates the document in MongoDB
    res.status(201).json({ message: 'Creditor registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
     
module.exports = router;
