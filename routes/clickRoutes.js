import express from 'express';
import { getTotalCount, addCount } from '../controllers/clickController.js';

const router = express.Router();

router.get('/', getTotalCount);

router.post('/', addCount);

export default router;
