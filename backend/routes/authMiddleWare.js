const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No valid token provided.' });
  }
  
  const token = authHeader.replace('Bearer ', '');

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    if (!secret) {
        return res.status(500).json({ message: 'Server configuration error.' });
    }
    const decoded = jwt.verify(token, secret);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
