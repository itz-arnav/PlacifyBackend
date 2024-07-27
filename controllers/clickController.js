import Click from '../models/Click.js';

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

        const clicks = await Click.find().exec();

        let todayCount = 0, weekCount = 0, monthCount = 0, yearCount = 0;

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

export const addCount = async (req, res, next) => {
    try {
        const newClick = new Click({ timestamp: new Date() });
        await newClick.save();

        res.status(200).send({ message: 'Click added successfully' });
    } catch (err) {
        next(err);
    }
};
