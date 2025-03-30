const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });
const { MongoClient } = require('mongodb');

async function listDatabases() {
  const client = new MongoClient(process.env.MONGO_URI);
  
  try {
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully!');
    
    // List all databases
    const databasesList = await client.db().admin().listDatabases();
    
    console.log('\nAvailable Databases:');
    databasesList.databases.forEach(db => {
      console.log(`- ${db.name} (Size: ${db.sizeOnDisk} bytes)`);
    });
    
    // For each database, list collections
    for (const db of databasesList.databases) {
      if (db.name !== 'admin' && db.name !== 'local') {
        const database = client.db(db.name);
        const collections = await database.listCollections().toArray();
        
        if (collections.length > 0) {
          console.log(`\nCollections in ${db.name}:`);
          for (const collection of collections) {
            const count = await database.collection(collection.name).countDocuments();
            console.log(`- ${collection.name} (Documents: ${count})`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
    console.log('\nConnection closed.');
  }
}

listDatabases();
