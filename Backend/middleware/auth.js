const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error: error.message || 'Requête non authentifiée' });
    }
};

