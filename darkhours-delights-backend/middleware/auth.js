const admin = require("firebase-admin");

const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("No token provided in Authorization header");
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split("Bearer ")[1];
        console.log("Verifying token:", token.slice(0, 20) + "..."); // Debug

        // Verify token and get claims
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("Decoded token:", decodedToken); // Debug

        // Check for admin claim
        if (!decodedToken.admin) {
            console.error("User is not an admin, claims:", decodedToken);
            return res.status(403).json({ error: "Forbidden: Admin access required" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message, "Code:", error.code); // Debug
        res.status(401).json({ error: "Unauthorized: Invalid token", details: error.message });
    }
};

module.exports = authenticateAdmin;