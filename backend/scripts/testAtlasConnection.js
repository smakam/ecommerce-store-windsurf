const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB Atlas...');
console.log(`Connection string: ${process.env.MONGO_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    console.log('Connection details:');
    console.log(`- Database name: ${mongoose.connection.name || 'Not specified in URI'}`);
    console.log(`- Host: ${mongoose.connection.host}`);
    console.log(`- Port: ${mongoose.connection.port || 'Default'}`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  });
