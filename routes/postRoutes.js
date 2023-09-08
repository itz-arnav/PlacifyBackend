import express from 'express';
import { getAllItems, addItem, updateItem, deleteItem } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

// Get all posts (hackathons, jobs, etc.)
router.get('/', isAuthenticated, getAllItems);

// Create a new post
router.post('/', isAuthenticated, addItem);

// Update an existing post
router.put('/', isAuthenticated, updateItem);

// Delete an existing post
router.delete('/', isAuthenticated, deleteItem);

export default router;
