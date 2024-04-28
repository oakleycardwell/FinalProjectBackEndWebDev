function validateFunfactUpdate(req, res, next) {
    const { index, funfact } = req.body;

    if (!index || !funfact) {
        return res.status(400).json({ error: "Missing required fields: index and funfact must be provided." });
    }

    if (typeof funfact !== 'string') {
        return res.status(400).json({ error: "Invalid input: funfact must be a string." });
    }

    if (typeof index !== 'number' || index < 1) {
        return res.status(400).json({ error: "Invalid index: index must be a positive integer starting from 1." });
    }

    next();
}

module.exports = validateFunfactUpdate;