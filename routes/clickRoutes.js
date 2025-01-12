import express from 'express';
import {
    getTotalCount as getCardCount,
    getCountForSixMonths,
    addCount as updatedAddCount,
    getMonthlyCount,
    getWeeklyCount,
    getTotalYearlyCount
} from '../controllers/updatedClickController.js';

const router = express.Router();

const retryAsync = async (fn, retries = 3) => {
    let error;
    for (let i = 0; i < retries; i++) {
        try {
            await fn();
            return;
        } catch (err) {
            error = err;
            console.log(`Attempt ${i + 1} failed. Retrying...`);
        }
    }
    throw error;
};

const handleAddClick = async (req, res, next) => {
    try {
        await retryAsync(() => updatedAddCount(req, res, next));
    } catch (error) {
        next(error);
    }
};

router.get('/', getCardCount);
router.post('/', handleAddClick);
router.get('/lastweek', getWeeklyCount);
router.get('/lastmonth', getMonthlyCount);
router.get('/lastsixmonths', getCountForSixMonths);
router.get('/lastyearcount', getTotalYearlyCount);

export default router;
