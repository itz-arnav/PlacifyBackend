import Click from '../models/Click.js';

// Function to get count of clicks for today, this week, and this month
export const getTotalCount = async (req, res, next) => {
    try {
        // Set up date boundaries for filtering clicks
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        // Fetch all clicks from the database
        const clicks = await Click.find().exec();

        // Initialize counters
        let todayCount = 0, weekCount = 0, monthCount = 0;

        // Iterate over fetched clicks to count those within set date boundaries
        clicks.forEach(click => {
            const timestamp = click.timestamp;
            if (timestamp >= todayStart) {
                todayCount++;
                weekCount++;
                monthCount++;
            } else if (timestamp >= weekStart) {
                weekCount++;
                monthCount++;
            } else if (timestamp >= monthStart) {
                monthCount++;
            }
        });

        // Return counted data as JSON
        res.json({
            today: todayCount,
            thisWeek: weekCount,
            thisMonth: monthCount,
            total: clicks.length
        });
    } catch (error) {
        // Handle errors by passing them to the error middleware
        next(error);
    }
};

// Function to add a new click record
export const addCount = async (req, res, next) => {
    try {
        // Create and save a new click record with current timestamp
        const newClick = new Click({ timestamp: new Date() });
        await newClick.save();
    } catch (error) {
        // Handle errors by passing them to the error middleware
        next(error);
    }
};
