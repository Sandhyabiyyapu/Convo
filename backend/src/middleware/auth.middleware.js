import jwt from 'jsonwebtoken';
import User from '../models/User.js';



export const protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt; // Get the JWT token from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized-Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Find the user by ID and exclude password and version
        if (!user) {
            return res.status(401).json({ message: "Unauthorized-User not found" });
        }
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
}