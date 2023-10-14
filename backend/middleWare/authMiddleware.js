const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Define your JWT secret key
const secretKey = 'JWT_SECRET'; // Replace with your actual secret key

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token; // Assumes the token is stored in a cookie
        
        if (!token) {
            return res.status(401).json({ message: "Not authorized, please login" });
        }

        // Verify Token
        const verified = jwt.verify(token, secretKey);

        if (!verified) {
            return res.status(401).json({ message: "Token verification failed" });
        }

        // Get user information based on the token
        const user = await User.findById(verified.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach the user object to the request for further processing
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, please login" });
    }
});

module.exports = protect;
