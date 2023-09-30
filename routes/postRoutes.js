import express from 'express';
import { getAllItems, addItem, updateItem, deleteItem } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

// Get all posts (hackathons, jobs, etc.)
router.get('/', getAllItems);

// Create a new post
router.post('/', isAuthenticated, addItem);

// Update an existing post by its ID
router.put('/:id', isAuthenticated, updateItem);

// Delete an existing post by its ID
router.delete('/:id', isAuthenticated, deleteItem);

export default router;
