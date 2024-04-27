const dbName = process.env.DATABASE_NAME;

exports.getAllStates = async (req, res) => {
    try {
        const result = await client.db(dbName).collection("YourCollectionName").find().toArray();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving states from the database.");
    }
};