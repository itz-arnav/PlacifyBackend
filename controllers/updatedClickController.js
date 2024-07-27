import UpdatedClick from '../models/UpdatedClick.js';

export const addCount = async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const updatedDocument = await UpdatedClick.findOneAndUpdate(
            { day: today },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
    } catch (err) {
        next(err);
    }
};

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

        const aggregates = await UpdatedClick.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$count" },
                    monthCount: { $sum: { $cond: [{ $gte: ["$day", monthStart] }, "$count", 0] } },
                    weekCount: { $sum: { $cond: [{ $gte: ["$day", weekStart] }, "$count", 0] } },
                    todayCount: { $sum: { $cond: [{ $gte: ["$day", todayStart] }, "$count", 0] } }
                }
            }
        ]);

        const result = aggregates.length ? aggregates[0] : { todayCount: 0, weekCount: 0, monthCount: 0, total: 0 };

        res.json({
            today: result.todayCount,
            thisWeek: result.weekCount,
            thisMonth: result.monthCount,
            total: result.total
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

export const getCountForSixMonths = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const referenceDate = new Date(today);
        referenceDate.setDate(referenceDate.getDate() - (referenceDate.getDate() % 5));

        const sixMonthsAgo = new Date(referenceDate);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const aggregates = await UpdatedClick.aggregate([
            { $match: { day: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        $add: [
                            referenceDate,
                            {
                                $multiply: [
                                    { $floor: { $divide: [{ $subtract: ["$day", referenceDate] }, 432000000] } },
                                    432000000
                                ]
                            }
                        ]
                    },
                    count: { $sum: "$count" }
                }
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$_id" } },
                    clicks: "$count"
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.json(aggregates);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching chart data' });
    }
};

export const getWeeklyCount = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Adjust to include today in the 7-day span

        const aggregates = await UpdatedClick.aggregate([
            { $match: { day: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$day" } },
                    count: { $sum: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    clicks: "$count"
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.json(aggregates);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching weekly data' });
    }
};

export const getMonthlyCount = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thirtyOneDaysAgo = new Date(today);
        thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 30); // Adjust to include today in the 31-day span

        const aggregates = await UpdatedClick.aggregate([
            { $match: { day: { $gte: thirtyOneDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$day" } },
                    count: { $sum: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    clicks: "$count"
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.json(aggregates);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching monthly data' });
    }
};

export const getTotalYearlyCount = async (req, res) => {
    try {
        const aggregates = await UpdatedClick.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$day" },
                        year: { $year: "$day" }
                    },
                    count: { $sum: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            // Map the month number to the month name
                            { $arrayElemAt: [ ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], { $subtract: ["$_id.month", 1] } ] },
                            " ",
                            { $toString: "$_id.year" } // Combine the month name with the year
                        ]
                    },
                    clicks: "$count"
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } } // Sorting by year and month numerically
        ]);

        res.json(aggregates);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching total yearly data' });
    }
};
