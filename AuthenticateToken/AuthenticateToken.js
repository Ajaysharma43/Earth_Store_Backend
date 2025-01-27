const Jwt = require('jsonwebtoken');

const Authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization.split(' ')[1];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(' ')[1];
    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const verify = Jwt.verify(authHeader, process.env.JWT_SECRET_KEY);
        req.user = verify;
        res.json({message : "verifed"})
        next(); 
    } catch (error) {
        console.error("JWT verification error:", error);
        res.json({message : "expired"})
    }
};

module.exports = Authenticate;