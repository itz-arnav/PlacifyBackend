import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate and authorize based on JWT
export const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded payload to request object
    req.user = decoded;

    // Check if user has the necessary authority level
    if (['Moderator', 'Administrator'].includes(decoded.authority)) {
      next();
    } else {
      return res.status(403).send({ error: 'Access denied: insufficient privileges.' });
    }
  } catch (e) {
    return res.status(401).send({ error: 'Please authenticate correctly.' });
  }
};
