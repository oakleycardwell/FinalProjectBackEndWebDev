function validateFunfactIndex(req, res, next) {
    const { index } = req.body;

    if (index === undefined || index === null) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }

    if (typeof index !== 'number' || index < 1) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }

    next();
}

module.exports = validateFunfactIndex;