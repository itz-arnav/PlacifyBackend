import express from 'express';
import { getAllItems, addItem, updateItem, deleteItem, addMultipleItems, getAllContests } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', getAllItems);

router.get('/contests', getAllContests);

router.post('/', isAuthenticated, addItem);

router.post('/multi', isAuthenticated, addMultipleItems);

router.put('/:id', isAuthenticated, updateItem);

router.delete('/:id', isAuthenticated, deleteItem);

export default router;
