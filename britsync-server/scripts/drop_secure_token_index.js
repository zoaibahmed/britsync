const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/britsync';

async function dropIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    
    // Get the collection
    const collection = mongoose.connection.db.collection('docu_documents');
    
    console.log('Checking indexes on docu_documents...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);
    
    const indexExists = indexes.some(idx => idx.name === 'secure_token_1');
    if (indexExists) {
      console.log('Index secure_token_1 found. Dropping it...');
      await collection.dropIndex('secure_token_1');
      console.log('Dropped secure_token_1 successfully.');
    } else {
      console.log('Index secure_token_1 not found.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error dropping index:', err);
    process.exit(1);
  }
}

dropIndex();
