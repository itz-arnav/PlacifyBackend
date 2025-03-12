// authRoutes.js
import express from 'express';
import { registerUser, loginUser, verifyUser, logoutUser } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyUser);
router.post('/logout', logoutUser);
router.get('/protectedTest', isAuthenticated, (req, res) => {
  res.status(200).send({ message: 'You have access to this protected route', user: req.user });
});
export default router;
