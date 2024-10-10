import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// This middleware function will both authenticate and authorize users
const authenticateJWT = (allowedRoles) => (req, res, next) => {
    //console.log("Cookies received:", req.cookies);  // Log the cookies to verify they're being received

    const token = req.cookies.jwt;  // Retrieve the JWT from the 'jwt' cookie
    //console.log("JWT Token from cookies:", token);

    if (!token) {
        console.error("No JWT token found in cookies");
        return res.sendStatus(401); // No token provided, send a 401 Unauthorized response
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.sendStatus(403); // Invalid token, send a 403 Forbidden response
        }

        //console.log("Token is valid. Decoded:", decoded);

        // After decoding, check the user's role
        if (!allowedRoles.includes(decoded.role)) {
            console.error("Access denied: User role is not permitted to perform this action.");
            return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
        }

        req.user = decoded;  // Set the decoded user information on the request object
        next();  // User is authorized, proceed to the next middleware or route handler
    });
};

export default authenticateJWT;
