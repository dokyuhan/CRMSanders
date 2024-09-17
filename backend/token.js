import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    console.log("All headers received:", req.headers);
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    console.log("Authorization header:", authHeader);  // For debugging

    if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            const token = parts[1];

            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    console.error("Token verification error:", err);
                    return res.sendStatus(403);  // Invalid token
                }
                req.user = user;
                next();
            });
        } else {
            console.error("Authorization header format is incorrect");
            res.sendStatus(401);  // Incorrect authorization header format
        }
    } else {
        console.error("No Authorization header found");
        res.sendStatus(401);  // No token provided
    }
};

export default authenticateJWT;