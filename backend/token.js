import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

/*
const authenticateJWT = (req, res, next) => {
    console.log("All headers received:", JSON.stringify(req.headers, null, 2));
    console.log("Cookies received:", req.cookies);
    
    // Normalize header key to lowercase to avoid case-sensitivity issues
    //const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const authToken = req.cookies.jwt;
    console.log("Token:", token);

    if (authToken) {
        const parts = authToken.split(' ');
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
*/
const authenticateJWT = (req, res, next) => {
    console.log("Cookies received:", req.cookies);  // Log the cookies to verify they're being received

    // Retrieve the JWT from the 'jwt' cookie directly
    const token = req.cookies.jwt;
    console.log("JWT Token from cookies:", token);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.sendStatus(403); // Invalid token, send a 403 Forbidden response
            }
            req.user = decoded;  // Set the decoded user information on the request object
            next();  // Proceed to the next middleware or route handler
        });
    } else {
        console.error("No JWT token found in cookies");
        res.sendStatus(401); // No token provided, send a 401 Unauthorized response
    }
};

export default authenticateJWT;
