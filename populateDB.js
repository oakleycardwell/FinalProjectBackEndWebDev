require('dotenv').config();
const { getDb, connectToMongo, client } = require('./mongodb');
const statesData = require('./models/statesData.json');

const funfactsData = {
    KS: ["The state motto of Kansas is \"To the Stars Through Difficulties.\"", "The state flower of Kansas is the Sunflower.", "The state tree of Kansas is the Eastern Cottonwood."],
    MO: ["The state motto of Missouri is \"Salus Populi Suprema Lex Esto\" which is Latin for \"The welfare of the people shall be the supreme law.\"", "The state flower of Missouri is the Hawthorn.", "The state tree of Missouri is the Flowering Dogwood."],
    OK: ["The state motto of Oklahoma is \"Oklahoma - In God We Trust!\"", "The state flower of Oklahoma is the Mistletoe.", "The state tree of Oklahoma is the Eastern Redbud."],
    NE: ["The state motto of Nebraska is \"Equality before the law.\"", "The state flower of Nebraska is the Goldenrod.", "The state tree of Nebraska is the Eastern Cottonwood."],
    CO: ["The state motto of Colorado is \"Nil sine Numine\" which translates to \"Nothing without the Deity\"", "The state flower of Colorado is the Rocky Mountain Columbine.", "The state tree of Colorado is the Colorado Blue Spruce."]
};

async function populateDatabase() {
    try {
        await connectToMongo(); // Ensures the MongoDB connection is established
        const db = getDb(); // Get the database connection from the already established connection
        const states = db.collection("states");
        // Clears the collection before adding new documents
        await states.deleteMany({});

        // Map through each state in the JSON file
        const insertPromises = statesData.map(state => {
            // Check if fun facts exist for this state, otherwise insert with empty array
            const funfacts = funfactsData[state.code] || null;
            if (funfacts != null) {
                return states.insertOne({
                    stateCode: state.code,
                    funfacts: funfacts
                });
            }
            else{
                return states.insertOne({
                    stateCode: state.code
                });
            }
        });

        await Promise.all(insertPromises);
        console.log('Database populated!');
    } catch (err) {
        console.error('Error populating database:', err);
    } finally {
        // Ensure the client is closed when done or in case of error
        await client.close();
    }
}

populateDatabase();