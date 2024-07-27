import UpdatedClick from '../models/UpdatedClick.js';

// Utility function to reset time to start of the day
const getStartOfDay = (dateOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + dateOffset);
    date.setHours(0, 0, 0, 0);
    return date;
};

// Controller to increment the count for today
export const addCount = async (req, res, next) => {
    try {
        const today = getStartOfDay();
        await UpdatedClick.findOneAndUpdate(
            { day: today },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        res.status(200).json({ message: 'Count updated successfully'});
    } catch (err) {
        next(err);
    }
};

// Controller to get total counts
export const getTotalCount = async (req, res, next) => {
    try {
        const todayStart = getStartOfDay();
        const weekStart = getStartOfDay(-new Date().getDay());
        const monthStart = getStartOfDay(1 - new Date().getDate());

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
        res.status(500).json({ error: 'An error occurred while fetching total counts' });
    }
};

// Controller to get counts for six months
export const getCountForSixMonths = async (req, res) => {
    try {
        const today = getStartOfDay();
        const sixMonthsAgo = getStartOfDay(-183);

        const aggregates = await UpdatedClick.aggregate([
            { $match: { day: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$day" }
                    },
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
        res.status(500).json({ error: 'An error occurred while fetching six months data' });
    }
};

// Controller to get weekly count
export const getWeeklyCount = async (req, res) => {
    try {
        const sevenDaysAgo = getStartOfDay(-6);
        const aggregates = await getAggregatedCounts(sevenDaysAgo);
        res.json(aggregates);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching weekly data' });
    }
};

// Controller to get monthly count
export const getMonthlyCount = async (req, res) => {
    try {
        const thirtyOneDaysAgo = getStartOfDay(-30);
        const aggregates = await getAggregatedCounts(thirtyOneDaysAgo);
        res.json(aggregates);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching monthly data' });
    }
};

// Controller to get total yearly count
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
                            { $arrayElemAt: [ ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], { $subtract: ["$_id.month", 1] } ] },
                            " ",
                            { $toString: "$_id.year" }
                        ]
                    },
                    clicks: "$count"
                }
            },
            { $sort: { "month": 1 } }
        ]);

        res.json(aggregates);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching yearly data' });
    }
};

// Generic function to get aggregated counts based on a start date
const getAggregatedCounts = async (startDate) => {
    return await UpdatedClick.aggregate([
        { $match: { day: { $gte: startDate } } },
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
};
