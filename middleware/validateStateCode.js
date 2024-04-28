const statesData = require('../models/statesData.json'); // Assuming this has all the states info

const validateStateCode = (req, res, next) => {
    const { state } = req.params;
    if (state.length !== 2 || !statesData.some(s => s.code.toUpperCase() === state.toUpperCase())) {
        return res.status(400).json({message: "Invalid state abbreviation parameter"});
    }
    next();
};

module.exports = validateStateCode;