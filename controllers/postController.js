import Item from '../models/Item.js';
import axios from 'axios';

const getCurrentDate = () => new Date().toISOString().split('T')[0];
const getDatePlusTenDays = () => {
  const date = new Date();
  date.setDate(date.getDate() + 10);
  return date.toISOString().split('T')[0];
};

const fetchContests = async () => {
  const currentDate = getCurrentDate();
  const endDate = getDatePlusTenDays();
  const { CLIST_API_USERNAME, CLIST_API_KEY } = process.env;
  const url = `https://clist.by/api/v4/contest/?start__gte=${currentDate}&end__lte=${endDate}&username=${CLIST_API_USERNAME}&api_key=${CLIST_API_KEY}`;
  try {
    const response = await axios.get(url);
    const filteredContests = response.data.objects.filter(contest => [93, 1, 102, 2, 126].includes(contest.resource_id));
    filteredContests.sort((a, b) => new Date(a.start) - new Date(b.start));
    return filteredContests;
  } catch (error) {
    console.error("Failed to fetch contests:", error);
    return [];
  }
};

export const getAllContests = async (req, res, next) => {
  try {
    const contests = await fetchContests();
    res.status(200).json(contests);
  } catch (err) {
    next(err);
  }
};

export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ _id: -1 });
    res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { name, website, closingDate, type, imageIcon, ctc, batchEligible, company } = req.body;
    const userAuthority = req.user.authority;
    const existingItem = await Item.findOne({ website });
    if (existingItem) return res.status(409).json({ message: 'Item with the given URL already exists' });
    const status = userAuthority === 'Contributor' ? 'pending' : 'accepted';
    const payload = {
      name,
      website,
      type,
      imageIcon,
      company,
      status,
      closingDate: new Date(closingDate)
    };
    if (type === 'job' || type === 'internship') {
      payload.ctc = ctc;
      payload.batchEligible = batchEligible;
    }
    const newItem = new Item(payload);
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', status });
  } catch (err) {
    next(err);
  }
};

export const addMultipleItems = async (req, res, next) => {
  const items = req.body;
  let addedItemsCount = 0;
  for (const item of items) {
    try {
      const exists = await Item.findOne({ website: item.website });
      if (!exists) {
        const payload = { ...item, closingDate: new Date(item.closingDate) };
        if (item.type === 'job' || item.type === 'internship') {
          payload.ctc = item.ctc;
          payload.batchEligible = item.batchEligible;
        }
        await new Item(payload).save();
        addedItemsCount++;
      }
    } catch (err) {
      console.error(`Failed to add item ${item.name}:`, err);
    }
  }
  res.status(201).json({ message: `${addedItemsCount} items added successfully` });
};

export const updateItem = async (req, res, next) => {
  try {
    const updateData = { ...req.body, closingDate: new Date(req.body.closingDate) };
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
