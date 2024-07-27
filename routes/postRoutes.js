// Importing necessary modules
import express from 'express';
import { 
  getAllItems, 
  addItem, 
  updateItem, 
  deleteItem, 
  addMultipleItems, 
  getAllContests 
} from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

// Initialize the router
const router = express.Router();

// Routes configuration

// GET / - Retrieves all items
router.get('/', getAllItems);

// GET /contests - Retrieves all contests
router.get('/contests', getAllContests);

// POST / - Adds a new item, requires authentication
router.post('/', isAuthenticated, addItem);

// POST /multi - Adds multiple items, requires authentication
router.post('/multi', isAuthenticated, addMultipleItems);

// PUT /:id - Updates an existing item by id, requires authentication
router.put('/:id', isAuthenticated, updateItem);

// DELETE /:id - Deletes an existing item by id, requires authentication
router.delete('/:id', isAuthenticated, deleteItem);

// Export the router for use in the main application
export default router;
