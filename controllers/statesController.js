const { getDb } = require('../mongodb'); // Adjust the path as necessary
const statesData = require('../models/statesData.json'); // Load your states data


// GET REQUESTS

exports.getAllStates = async (req, res) => {
    const { contig } = req.query;
    let filteredStates = statesData;
    if (contig === 'true') {
        filteredStates = statesData.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
        filteredStates = statesData.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    const db = await getDb();
    const collection = db.collection('states');

    try {
        const statesWithFunFacts = await Promise.all(filteredStates.map(async (state) => {
            const funFactData = await collection.findOne({ stateCode: state.code });
            return {
                ...state,
                funfacts: funFactData ? funFactData.funfacts : []
            };
        }));

        res.json(statesWithFunFacts);
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Error fetching data from database');
    }
};

exports.getStateByCode = async (req, res) => {
    const { state } = req.params;
    const stateData = statesData.find(s => s.code.toUpperCase() === state.toUpperCase());

    if (!stateData) {
        return res.status(404).send('State not found');
    }

    const db = await getDb();
    const collection = db.collection('states');
    try {
        const funFactData = await collection.findOne({ stateCode: state.toUpperCase() });
        const completeStateData = {
            ...stateData,
            funfacts: funFactData ? funFactData.funfacts : []
        };

        res.json(completeStateData);
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Database query failed');
    }
};

exports.getRandomFunFact = async (req, res) => {
    const { state } = req.params;
    const db = await getDb();
    const collection = db.collection('states');

    try {
        const stateData = await collection.findOne({ stateCode: state.toUpperCase() });
        if (!stateData) {
            return res.status(404).send(`State not found`);
        }
        if (!stateData.funfacts || stateData.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateData.name}` });
        }
        const funFact = stateData.funfacts[Math.floor(Math.random() * stateData.funfacts.length)];
        res.json({ state: stateData.name, funfact: funFact });
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Database query failed');
    }
};

exports.getCapital = (req, res) => {
    const { state } = req.params;
    const stateData = statesData.find(s => s.code === state.toUpperCase());
    if (!stateData) {
        return res.status(404).send('State not found');
    }
    res.json({ state: stateData.state, capital: stateData.capital_city });
};

exports.getNickname = (req, res) => {
    const { state } = req.params;
    const stateData = statesData.find(s => s.code === state.toUpperCase());
    if (!stateData) {
        return res.status(404).send('State not found');
    }
    res.json({ state: stateData.state, nickname: stateData.nickname });
};

exports.getPopulation = (req, res) => {
    const { state } = req.params;
    const stateData = statesData.find(s => s.code === state.toUpperCase());
    if (!stateData) {
        return res.status(404).send('State not found');
    }
    res.json({ state: stateData.state, population: stateData.population });
};

exports.getAdmissionDate = (req, res) => {
    const { state } = req.params;
    const stateData = statesData.find(s => s.code === state.toUpperCase());
    if (!stateData) {
        return res.status(404).send('State not found');
    }
    res.json({ state: stateData.state, admitted: stateData.admission_date });
};

// POST REQUESTS

exports.addFunFact = async (req, res) => {
    const { state } = req.params;
    const { funfacts } = req.body;  // Expect an array of fun facts

    const db = await getDb();
    const collection = db.collection('states');

    try {
        // Find the document for the given state
        const stateData = await collection.findOne({ stateCode: state.toUpperCase() });

        if (stateData) {
            // Update the document by pushing new fun facts into the existing array
            const updatedDocument = await collection.updateOne(
                { stateCode: state.toUpperCase() },
                { $push: { funfacts: { $each: funfacts } } }
            );
            res.json(updatedDocument);
        } else {
            // If no document exists, create a new document
            const newDocument = await collection.insertOne({
                stateCode: state.toUpperCase(),
                funfacts: funfacts
            });
            res.json(newDocument);
        }
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Database operation failed');
    }
};

// UPDATE REQUESTS

exports.updateFunFact = async (req, res) => {
    const { state } = req.params;
    const { index, funfact } = req.body;
    const db = await getDb();
    const collection = db.collection('states');

    try {
        // Convert 1-based index to 0-based index for array access
        const arrayIndex = index - 1;
        const updateQuery = { $set: { [`funfacts.${arrayIndex}`]: funfact } };

        const result = await collection.updateOne({ stateCode: state.toUpperCase() }, updateQuery);
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "State not found or index out of bounds." });
        }
        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: "No update performed. Possible out of bounds index." });
        }
        res.json({result: result });
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Database operation failed');
    }
};

// DELETE REQUESTS

exports.deleteFunFact = async (req, res) => {
    const { state } = req.params;
    const { index } = req.body;
    const db = await getDb();
    const collection = db.collection('states');

    try {
        const arrayIndex = index - 1; // Convert 1-based index to 0-based for MongoDB operation
        const updateResult = await collection.updateOne(
            { stateCode: state.toUpperCase() },
            { $unset: { [`funfacts.${arrayIndex}`]: 1 } } // Unset the funfact
        );

        // After unsetting an array element, it becomes null, so pull all nulls out
        if (updateResult.matchedCount) {
            await collection.updateOne(
                { stateCode: state.toUpperCase() },
                { $pull: { funfacts: null } } // Remove null entries from the array
            );
        }

        if (updateResult.matchedCount === 0) {
            res.status(404).json({ error: "State not found or index out of bounds." });
        } else if (updateResult.modifiedCount === 0) {
            res.status(400).json({ error: "No update performed. Possible out of bounds index." });
        } else {
            res.json({result: updateResult });
        }
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Database operation failed');
    }
};