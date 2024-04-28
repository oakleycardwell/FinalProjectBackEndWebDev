function validateFunfactUpdate(req, res, next) {
    const { index, funfact } = req.body;

    if (typeof funfact !== 'string') {
        return res.status(400).json({ message: "State fun fact value required" });
    }

    if (typeof index !== 'number' || index < 1) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }

    next();
}

module.exports = validateFunfactUpdate;