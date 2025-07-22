import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user.id);

        RegExp.status(200).json({token });
    } catch (error) {
        console.error("Error getting Stream token:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}