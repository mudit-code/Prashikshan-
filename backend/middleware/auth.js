const jwt = require("jsonwebtoken");
const fs = require('fs');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Log request attempt
  try {
    fs.appendFileSync('debug_auth_log.txt', `[${new Date().toISOString()}] AUTH: ${req.method} ${req.originalUrl}\n`);
  } catch (e) { }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    try { fs.appendFileSync('debug_auth_log.txt', `[${new Date().toISOString()}] FAIL: No Token\n`); } catch (e) { }
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // decoded must contain: { userId, role }
    req.user = decoded;

    try { fs.appendFileSync('debug_auth_log.txt', `[${new Date().toISOString()}] SUCCESS: User ${decoded.userId}\n`); } catch (e) { }

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    try { fs.appendFileSync('debug_auth_log.txt', `[${new Date().toISOString()}] FAIL: ${err.message}\n`); } catch (e) { }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
