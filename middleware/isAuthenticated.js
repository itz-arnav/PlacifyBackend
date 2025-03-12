// isAuthenticated.js
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('Middleware: No token');
    return res.status(401).send({ error: 'Please authenticate.' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).send({ error: 'Invalid token, please authenticate correctly.' });
  }
};

export const isAuthorized = (req, res, next) => {
  if (['Moderator', 'Administrator'].includes(req.user.authority)) {
    next();
  } else {
    return res.status(403).send({ error: 'Access denied: insufficient privileges.' });
  }
};
