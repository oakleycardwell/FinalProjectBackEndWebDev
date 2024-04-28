function validateFunfacts(req, res, next) {
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({ message : "State fun facts value required" });
    }
    if (!Array.isArray(funfacts)){
        return res.status(400).json({ message : "State fun facts value must be an array" });
    }

    next();  // Continue to the next middleware or controller if validation passes
}

module.exports = validateFunfacts;