import Item from '../models/Item.js';
import axios from "axios";

// Fetch all upcoming items
export const getAllItems = async (req, res, next) => {
  try {    
    const items = await Item.find().sort({ _id: -1 });
    res.status(200).send({ items });
  } catch (err) {
    next(err);
  }
};

const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

const getDatePlusTenDays = () => {
  const date = new Date();
  date.setDate(date.getDate() + 10);
  return date.toISOString().split('T')[0];
};

//Fetch contests
const fetchContests = async () => {
  const currentDate = getCurrentDate();
  const endDate = getDatePlusTenDays();
  const CLIST_API_USERNAME = process.env.CLIST_API_USERNAME;
  const CLIST_API_KEY = process.env.CLIST_API_KEY;
  const url = `https://clist.by:443/api/v4/contest/?start__gte=${currentDate}&end__lte=${endDate}&username=${CLIST_API_USERNAME}&api_key=${CLIST_API_KEY}`;
  console.log(url);
  try {
      const response = await axios.get(url);
      const contests = response.data["objects"];
      const filteredContests = contests.filter(contest =>
          [93, 1, 102, 2, 126].includes(contest.resource_id)
      );

      return filteredContests;
  } catch (error) {
      return null;
  }
};

export const getAllContests = async (req, res, next) => {
  try {    
    const items = await fetchContests();
    res.status(200).send(items);
  } catch (err) {
    next(err);
  }
};

// Add new item
export const addItem = async (req, res, next) => {
  try {
    const { 
      name, 
      website, 
      closingDate, 
      type, 
      imageIcon, 
      ctc, 
      batchEligible,
      company 
    } = req.body;

    // Check if an item with the same URL already exists
    const existingItem = await Item.findOne({ website: website });
    if (existingItem) {
      // Item with the same URL found, send an error response
      return res.status(409).send({ message: 'Item with the given URL already exists' });
    }

    // Create an object for the new item, including mandatory fields
    const newItemData = {
      name,
      website,
      closingDate: new Date(closingDate),
      type,
      imageIcon,
      company
    };

    // Add ctc and batchEligible fields based on the type
    if (type === 'job' || type === 'internship') {
      newItemData.ctc = ctc;
      newItemData.batchEligible = batchEligible;
    }

    // Create a new item and save it to the database
    const newItem = new Item(newItemData);
    await newItem.save();

    // Send a success response
    res.status(201).send({ message: 'Item added successfully' });
  } catch (err) {
    next(err);
  }
};

// Add multiple new items
export const addMultipleItems = async (req, res, next) => {
  try {
    const items = req.body; // Expecting an array of items
    let addedItemsCount = 0;

    // Iterate over each item and process them
    for (const itemData of items) {
      const { 
        name, 
        website, 
        closingDate, 
        type, 
        imageIcon, 
        ctc, 
        batchEligible,
        company 
      } = itemData;

      // Check if an item with the same URL already exists
      const existingItem = await Item.findOne({ website: website });
      if (existingItem) {
        // If item with the same URL found, skip to the next item
        continue;
      }

      // Create an object for the new item, including mandatory fields
      const newItemData = {
        name,
        website,
        closingDate: new Date(closingDate),
        type,
        imageIcon,
        company
      };

      // Add ctc and batchEligible fields based on the type
      if (type === 'job' || type === 'internship') {
        newItemData.ctc = ctc;
        newItemData.batchEligible = batchEligible;
      }

      // Create a new item and save it to the database
      const newItem = new Item(newItemData);
      await newItem.save();
      addedItemsCount++;
    }
    // Send a success response
    res.status(201).send({ message: `${addedItemsCount} items added successfully` });
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
      const _id = req.params.id; 

      const {
          name,
          website,
          closingDate,
          type,
          imageIcon,
          ctc,
          batchEligible,
          company
      } = req.body;

      // Create an object for updating the item, including mandatory fields
      const updateData = {
          name,
          website,
          closingDate: new Date(closingDate),
          type,
          imageIcon,
          company
      };

      // Conditionally add ctc and batchEligible fields based on the type
      if (type === 'job' || type === 'internship') {
          updateData.ctc = ctc;
          updateData.batchEligible = batchEligible;
      }

      const updatedItem = await Item.findByIdAndUpdate(_id, updateData, { new: true });

      if (!updatedItem) {
          res.status(404).send({ message: 'Item not found' });
          return;
      }

      res.status(200).send({ message: 'Item updated successfully', item: updatedItem });
  } catch (err) {
      res.status(555).json({ message: err.message});
  }
};


export const deleteItem = async (req, res, next) => {
  try {
      const _id = req.params.id;  // Getting the ID from route parameters

      const deletedItem = await Item.findByIdAndDelete(_id);

      if (!deletedItem) {
          res.status(404).send({ message: 'Item not found' });
          return;
      }

      res.status(200).send({ message: 'Item deleted successfully' });
  } catch (err) {
      next(err);
  }
};