// Importing required modules
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

// Initialize router from express
const router = express.Router();

// Route Definitions

// POST /register: Register a new user
router.post('/register', registerUser);

// POST /login: Authenticate a user and issue a token
router.post('/login', loginUser);

// GET /protectedTest: A test route that requires authentication
router.get('/protectedTest', isAuthenticated, (req, res) => {
  res.status(200).send({ message: 'You have access to this protected route', user: req.user });
});

// Export the configured router
export default router;
