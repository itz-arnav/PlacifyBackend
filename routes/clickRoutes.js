// Importing required modules
import express from 'express';
import {
  getTotalCount as getCardCount,
  getCountForSixMonths,
  addCount as updatedAddCount,
  getMonthlyCount,
  getWeeklyCount,
  getTotalYearlyCount
} from '../controllers/updatedClickController.js';
import UpdatedClick from '../models/UpdatedClick.js';

// Initialize router from express
const router = express.Router();

// Function to retry a promise-based function a specified number of times
async function retryAsync(fn, retries = 3) {
    let error;
    for (let i = 0; i < retries; i++) {
        try {
            await fn();
            break
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
            retryAsync(() => updatedAddCount(req, res, next))
        ]);
    } catch (error) {
        next(error);
    }
};

const migrateClickData = async () => {
    try {
        // Fetch all Clicks from the old database
        const clicks = await Click.find({});

        // Aggregate clicks by day
        const dayMap = new Map();

        clicks.forEach(click => {
            const day = click.timestamp.toISOString().split('T')[0]; // Extract date as 'YYYY-MM-DD'
            if (dayMap.has(day)) {
                dayMap.set(day, dayMap.get(day) + 1); // Increment count for the day
            } else {
                dayMap.set(day, 1); // Initialize count for new day
            }
        });

        // Update new database with aggregated data
        for (const [day, count] of dayMap.entries()) {
            const dayDate = new Date(day);
            await UpdatedClick.updateOne(
                { day: dayDate },
                { $set: { count: count } },
                { upsert: true }
            );
        }
        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Failed to migrate click data:', error);
    }
};

// Routes for click data retrieval and management
router.get('/', getCardCount); // Get total count from the new clicks collection
router.post('/', handleAddClick); // Endpoint to add a click with error handling and retries
router.get('/lastweek', getWeeklyCount); // Retrieve weekly click data
router.get('/lastmonth', getMonthlyCount); // Retrieve monthly click data
router.get('/lastsixmonths', getCountForSixMonths); // Retrieve last six months click data
router.get('/lastyearcount', getTotalYearlyCount); // Retrieve overall click data
router.get('/migrate', migrateClickData);

// Export the configured router
export default router;
