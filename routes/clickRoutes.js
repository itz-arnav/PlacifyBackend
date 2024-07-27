// Importing required modules
import express from 'express';
import { getTotalCount, addCount } from '../controllers/clickController.js';
import {
  getTotalCount as getCardCount,
  getCountForSixMonths,
  addCount as updatedAddCount,
  getMonthlyCount,
  getWeeklyCount,
  getTotalYearlyCount
} from '../controllers/updatedClickController.js';

// Initialize router from express
const router = express.Router();

// Function to retry a promise-based function a specified number of times
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
    throw error; // Propagate the error after all retries fail
}

// Handler for adding clicks with retries on failure
const handleAddClick = async (req, res, next) => {
    try {
        // Execute both addCount operations with retries and wait for both to complete
        await Promise.all([
            retryAsync(() => addCount(req, res, next)),
            retryAsync(() => updatedAddCount(req, res, next))
        ]);
        res.status(200).send({ message: 'Clicks added successfully in both collections' });
    } catch (error) {
        next(error);
    }
};

// Routes for click data retrieval and management
router.get('/', getTotalCount); // Get total count from the original clicks collection
router.post('/', handleAddClick); // Endpoint to add a click with error handling and retries
router.get('/lastweek', getWeeklyCount); // Retrieve weekly click data
router.get('/lastmonth', getMonthlyCount); // Retrieve monthly click data
router.get('/lastsixmonths', getCountForSixMonths); // Retrieve last six months click data
router.get('/lastyearcount', getTotalYearlyCount); // Retrieve yearly click data

// Export the configured router
export default router;
