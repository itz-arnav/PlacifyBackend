import Click from '../models/Click.js';

// Fetch all upcoming items
export const getTotalCount = async (req, res, next) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        
        // Fetch clicks within the desired time range (you can adjust the range as needed)
        const clicks = await Click.find().exec();

        // Initialize counts
        let todayCount = 0, weekCount = 0, monthCount = 0, yearCount = 0;

        // Loop through clicks to process counts
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

        // Respond with the counts
        res.json({
            today: todayCount,
            thisWeek: weekCount,
            thisMonth: monthCount,
            total: clicks.length
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Add new click count
export const addCount = async (req, res, next) => {
    try {
      // Create a new click with the current timestamp
      const newClick = new Click({ timestamp: new Date() });
  
      // Save the click to the database
      await newClick.save();
  
      // Return a success response
      res.status(200).send({ message: 'Click added successfully' });
    } catch (err) {
      next(err);
    }
  };
  