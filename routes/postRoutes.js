import express from 'express';
import { getAllItems, addItem, updateItem, deleteItem } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', getAllItems);

router.post('/', isAuthenticated, addItem);

router.put('/:id', isAuthenticated, updateItem);

router.delete('/:id', isAuthenticated, deleteItem);

export default router;
