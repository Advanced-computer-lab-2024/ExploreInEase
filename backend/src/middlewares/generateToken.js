const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const secret = process.env.ACCESS_TOKEN_SECRET || 'default_secret';
    return jwt.sign(user, secret, { expiresIn: '1d' });
};

module.exports = generateToken;
