const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');


app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected:=',process.env.MONGO_URI))
  .catch(err => console.log(err));

// Import route
const creditorRoutes = require('./routes/creditor');
app.use('/api/creditor', creditorRoutes);

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
