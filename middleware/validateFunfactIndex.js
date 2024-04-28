function validateFunfactIndex(req, res, next) {
    const { index } = req.body;

    if (index === undefined || index === null) {
        return res.status(400).json({ error: "Index is required." });
    }

    if (typeof index !== 'number' || index < 1) {
        return res.status(400).json({ error: "Invalid index: Index must be a positive integer starting from 1." });
    }

    next();
}

module.exports = validateFunfactIndex;