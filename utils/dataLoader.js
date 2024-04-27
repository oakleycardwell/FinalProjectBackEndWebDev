const fs = require('fs');
const path = require('path');


// Reads the JSON file and returns the parsed JSON object.
const loadStateData = () => {
    try {
        const dataPath = path.join(__dirname, '..', 'data', 'statesData.json');
        const dataBuffer = fs.readFileSync(dataPath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error) {
        console.error('Failed to load state data:', error);
        return []; // Return an empty array if there's an error
    }
};

module.exports = { loadStateData };