const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Middleware to protect routes
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Now req.user.role is available
        next();
    } catch (err) {
        console.error("JWT Error:", err);
        return res.status(403).json({ message: "Token is not valid" });
    }
};



// Admin Only
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ error: "Access denide, admin only" });
    }
}

module.exports = { protect, adminOnly };