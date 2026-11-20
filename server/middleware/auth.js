const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// A random signing value is created each time the server starts,
// so no secret key is stored in the code or in any config file.
const JWT_SECRET = crypto.randomBytes(32).toString('hex');

// Checks the JWT sent in the Authorization header: "Bearer <token>"
function requireLogin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Allows only admin accounts
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

module.exports = { requireLogin, requireAdmin, JWT_SECRET };
