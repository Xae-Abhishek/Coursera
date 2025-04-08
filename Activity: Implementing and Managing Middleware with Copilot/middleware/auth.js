// middleware/auth.js
function auth(req, res, next) {
    const token = req.headers['authorization'];

    if (!token || token !== 'Bearer mysecrettoken') {
        return res.status(401).json({ error: 'Unauthorized access. Invalid or missing token.' });
    }

    next();
}

module.exports = auth;
