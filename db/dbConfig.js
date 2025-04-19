const mongoose = require('mongoose');
const config = require('../config'); // or wherever your config is

// Connect to MongoDB
const dbConnect = async () => {
  try {
    await mongoose.connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    if (process.send) process.send('ready'); // Only call if running as a child process
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1); // Optional: exit on failure
  }
};

// Disconnect from MongoDB
const dbDisconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Disconnection error:', error);
  }
};

module.exports = { dbConnect, dbDisconnect };