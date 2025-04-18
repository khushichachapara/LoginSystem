const express = require('express');
const router = express.Router();
const Creditor = require('../models/creditor');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken'); // Import the verifyToken middleware

const JWT_SECRET = 'yourSecretKey';

//register a creditor
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    //console.log("Data Received",req.body);

    //check email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Password must be valid' });
    }

    //check password simple validation
    if (password.length < 1 || password.length > 8) {
        return res.status(400).json({ message: 'Password must be between 1 and 8 characters' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await Creditor.findOne({
            $or: [{ email }, { name }]
        });
        if (existingUser.email === email) {
            return res.status(400).json({ message: 'User with Email already exists' });
        }
        if (existingUser.name === name) {
            return res.status(400).json({ message: 'User with Name already exists' });
        }
        // Create a new creditor instance
        const newCreditor = new Creditor({ name, email, password });
        await newCreditor.save(); // this creates the document in MongoDB
        res.status(201).json({ message: 'Creditor registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

//login a creditor

router.get('/dashboard', verifyToken, (req, res) => {
    // If the token is valid and not expired, this will be executed
    res.status(200).json({ message: "Welcome to your dashboard", user: req.user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //console.log("Data Received",req.body);

    // Check if both fields are filled
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password' });
    }

    try {
        // Find creditor with matching email and password
        const creditor = await Creditor.findOne({ email, password });

        if (!creditor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: creditor._id, email: creditor.email},
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: 'Login successfully',
            token: token,
            user: { id: creditor._id, name: creditor.name, email: creditor.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

//Logout a creditor

router.post('/logout', async (req, res) => {

    res.status(200).json({ message: 'Logout successful (frontend should delete token)' });

});

module.exports = router;
