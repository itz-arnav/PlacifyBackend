import express from 'express';
import { getTotalCount, addCount } from '../controllers/clickController.js';
import { getTotalCount as getCardCount, getCountForSixMonths, addCount as updatedAddCount, getMonthlyCount, getWeeklyCount, getTotalYearlyCount } from '../controllers/updatedClickController.js';

const router = express.Router();

async function retryAsync(fn, retries = 3) {
    let error;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            error = err;
            console.log(`Attempt ${i + 1} failed. Retrying...`);
        }
    }
    throw error;
}

const handleAddClick = async (req, res, next) => {
    try {
        await Promise.all([
            retryAsync(() => addCount(req, res, next)),
            retryAsync(() => updatedAddCount(req, res, next))
        ]);
        res.status(200).send({ message: 'Clicks added successfully in both collections' });
    } catch (error) {
        next(error);
    }
};


router.get('/', getTotalCount);
router.post('/', handleAddClick);
router.get('/lastweek', getWeeklyCount);
router.get('/lastmonth', getMonthlyCount);
router.get('/lastsixmonths', getCountForSixMonths);
router.get('/lastyearcount', getTotalYearlyCount);

export default router;
