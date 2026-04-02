// Middleware to require admin role before doing anything. This prevents users from editing their tokens to gain admin access, since the role is checked against the MongoDB record, not the token claim.
module.exports = function isAdmin(req, res, next) {
  if (!req.userRole) return res.status(401).json({ error: "Access denied" }); // just in case the auth middlware didnt run
  if (req.userRole !== "admin") return res.status(403).json({ error: "Forbidden: admin only area!!!" }); // 403 forbidden!!! Unauthorized. 
  next();
};
