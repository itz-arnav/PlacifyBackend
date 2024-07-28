import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to simply authenticate based on JWT
export const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded payload to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (e) {
    return res.status(401).send({ error: 'Invalid token, please authenticate correctly.' });
  }
};

// Middleware to authorize based on user role
export const isAuthorized = (req, res, next) => {
  const userRoles = req.user.authority;

  if (['Moderator', 'Administrator'].includes(userRoles)) {
    next(); // User has the required role, proceed to the next middleware or route handler
  } else {
    return res.status(403).send({ error: 'Access denied: insufficient privileges.' });
  }
};