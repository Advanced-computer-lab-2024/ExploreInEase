const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

require('dotenv').config({ path: 'src/.env' });

const authenticateToken = (req, res, next) => {
    if (req.path === '/register' || req.path === '/login' || req.path === '/') {
        return next();
    }
    const authHeader = req.headers['authorization'];
    console.log("Headers received:", req.headers); // Check the full headers
    console.log("authHeader:", authHeader);        // Check the authorization header
    const token = authHeader && authHeader.split(' ')[0];
    console.log("Token: ", token);

    if (token == null) {
        res.sendStatus(401);
        return;
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };