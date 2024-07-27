import Item from '../models/Item.js';
import axios from "axios";

// Utility functions to get current and future dates
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

const getDatePlusTenDays = () => {
  const date = new Date();
  date.setDate(date.getDate() + 10);
  return date.toISOString().split('T')[0];
};

// Fetch contests from an external API
const fetchContests = async () => {
  const currentDate = getCurrentDate();
  const endDate = getDatePlusTenDays();
  const CLIST_API_USERNAME = process.env.CLIST_API_USERNAME;
  const CLIST_API_KEY = process.env.CLIST_API_KEY;
  const url = `https://clist.by/api/v4/contest/?start__gte=${currentDate}&end__lte=${endDate}&username=${CLIST_API_USERNAME}&api_key=${CLIST_API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.objects.filter(contest => [93, 1, 102, 2, 126].includes(contest.resource_id));
  } catch (error) {
    console.error("Failed to fetch contests: ", error);
    return [];
  }
};

// Controller to get all contests
export const getAllContests = async (req, res, next) => {
  try {
    const contests = await fetchContests();
    res.status(200).json(contests);
  } catch (err) {
    next(err);
  }
};

// Controller to get all items
export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ _id: -1 });
    res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
};

// Controller to add a new item
export const addItem = async (req, res, next) => {
  try {
    const { name, website, closingDate, type, imageIcon, ctc, batchEligible, company } = req.body;
    const existingItem = await Item.findOne({ website });

    if (existingItem) {
      return res.status(409).json({ message: 'Item with the given URL already exists' });
    }

    const newItem = new Item({
      name, website, type, imageIcon, company,
      closingDate: new Date(closingDate),
      ...(type === 'job' || type === 'internship') && { ctc, batchEligible }
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added successfully' });
  } catch (err) {
    next(err);
  }
};

// Controller to add multiple new items
export const addMultipleItems = async (req, res, next) => {
  const items = req.body; // Expecting an array of items
  let addedItemsCount = 0;

  for (const item of items) {
    try {
      const existingItem = await Item.findOne({ website: item.website });
      if (!existingItem) {
        const newItem = new Item({
          ...item,
          closingDate: new Date(item.closingDate),
          ...(item.type === 'job' || item.type === 'internship') && { ctc: item.ctc, batchEligible: item.batchEligible }
        });
        await newItem.save();
        addedItemsCount++;
      }
    } catch (err) {
      console.error(`Failed to add item ${item.name}: `, err);
    }
  }

  res.status(201).json({ message: `${addedItemsCount} items added successfully` });
};

// Controller to update an item
export const updateItem = async (req, res, next) => {
  try {
    const updateData = { ...req.body, closingDate: new Date(req.body.closingDate) };
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to delete an item
export const deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
