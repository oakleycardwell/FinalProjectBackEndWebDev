const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    stateCode: { type: String, required: true, unique: true },
    funfacts: [String]
});

const State = mongoose.model('State', stateSchema);

module.exports = State;