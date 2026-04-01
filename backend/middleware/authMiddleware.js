const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies JWT and loads fresh user record from DB to avoid trusting client-side token claims
async function verifyToken(req, res, next) {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  // Accept both bare token and "Bearer <token>" header formats
  if (typeof token === "string" && token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  } else if (typeof token === "string") {
    token = token.trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbackSecret");

    // Attach user id from token, then fetch the authoritative user record from DB
    req.userId = decoded.id;

    try {
      const user = await User.findById(req.userId).select("username role favourites");
      if (!user) return res.status(401).json({ error: "User not found" });

      // Use the role stored in DB (do NOT trust the token's role claim)
      req.userRole = user.role;
      req.user = user; // attach user object for convenience

      next();
    } catch (dbErr) {
      console.error("DB lookup failed in authMiddleware:", dbErr);
      res.status(500).json({ error: "Server error during authentication" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;