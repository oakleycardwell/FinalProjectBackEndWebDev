const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const validateStateCode = require('../middleware/validateStateCode');
const validateFunfacts = require('../middleware/validateFunfacts');
const validateFunfactUpdate = require('../middleware/validateFunfactUpdate');
const validateFunfactIndex = require('../middleware/validateFunfactIndex');
const {join} = require("path");

// Handle the base route for all states data
router.get('/', statesController.getAllStates);

// State-specific routes with validation middleware
router.get('/:state', validateStateCode, statesController.getStateByCode);
router.get('/:state/funfact', validateStateCode, statesController.getRandomFunFact);
router.get('/:state/capital', validateStateCode, statesController.getCapital);
router.get('/:state/nickname', validateStateCode, statesController.getNickname);
router.get('/:state/population', validateStateCode, statesController.getPopulation);
router.get('/:state/admission', validateStateCode, statesController.getAdmissionDate);

// Route to add fun facts with validation middleware
router.post('/:state/funfact', validateStateCode, validateFunfacts, statesController.addFunFact);

// Route for updating a fun fact with validation middleware
router.patch('/:state/funfact', validateStateCode, validateFunfactUpdate, statesController.updateFunFact);

// Route for deleting a fun fact with validation middleware
router.delete('/:state/funfact', validateStateCode, validateFunfactIndex, statesController.deleteFunFact);

// Catch any undefined subpaths under "/states/*" and return a 404 error
router.all('*', (req, res) => {
    res.status(404).sendFile(join(__dirname, 'views', '404.html'));
});

module.exports = router;