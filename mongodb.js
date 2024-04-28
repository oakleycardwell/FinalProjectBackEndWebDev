const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URI;
const dbName = process.env.DATABASE_NAME

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB.");
        return client;
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

function getDb() {
    return client.db(dbName); // Replace with your DB name
}

module.exports = { connectToMongo, getDb, client };