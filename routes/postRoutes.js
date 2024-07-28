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
import { isAuthenticated, isAuthorized } from '../middleware/isAuthenticated.js';  // Include isAuthorized

// Initialize Express router
const router = express.Router();

// Routes configuration

// GET / - Route to retrieve all items
// Accessible to any user, no authentication required
router.get('/', getAllItems);

// GET /contests - Route to retrieve all contests
// Accessible to any user, no authentication required
router.get('/contests', getAllContests);

// POST / - Route to add a new item
// Requires authentication: only authenticated users can add items
router.post('/', isAuthenticated, addItem);

// POST /multi - Route to add multiple items
// Requires authentication: ensures only authenticated users can add multiple items at once
router.post('/multi', isAuthenticated, addMultipleItems);

// PUT /:id - Route to update an existing item by its ID
// Requires authentication and authorization: only authorized users can update an item
router.put('/:id', isAuthenticated, isAuthorized, updateItem);

// DELETE /:id - Route to delete an existing item by its ID
// Requires authentication and authorization: only authorized users can delete an item
router.delete('/:id', isAuthenticated, isAuthorized, deleteItem);

// Export the configured router to be used by the main application
export default router;
