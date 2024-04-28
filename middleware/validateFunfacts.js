function validateFunfacts(req, res, next) {
    const { funfacts } = req.body;

    if (!funfacts || !Array.isArray(funfacts)) {
        return res.status(400).json({ error: "Invalid input, array of funfacts required." });
    }

    next();  // Continue to the next middleware or controller if validation passes
}

module.exports = validateFunfacts;