import Item from '../models/Item.js';

// Fetch all upcoming items
export const getAllItems = async (req, res, next) => {
  try {    
    const items = await Item.find();

    res.status(200).send({ items });
  } catch (err) {
    next(err);
  }
};

// Add new item
export const addItem = async (req, res, next) => {
  try {
    const { name, website, closingDate, type, imageIcon, ...extraFields } = req.body;

    // Create an object for the new item, including mandatory fields
    const newItemData = {
      name,
      website,
      closingDate: new Date(closingDate),
      type,
      imageIcon,
    };

    // Conditionally add extra fields based on the type
    if (type === 'job') {
      newItemData.experience = extraFields.experience;
      newItemData.ctc = extraFields.ctc;
      newItemData.batchEligible = extraFields.batchEligible;
    } else if (type === 'hackathon') {
      newItemData.hackathonType = extraFields.hackathonType;
      newItemData.teamSize = extraFields.teamSize;
    } else if (type === 'internship') {
      newItemData.batch = extraFields.batch;
      newItemData.internshipType = extraFields.internshipType;
      newItemData.stipend = extraFields.stipend;
    } else if (type === 'contest') {
      newItemData.prizes = extraFields.prizes;
    }

    const newItem = new Item(newItemData);
    await newItem.save();

    res.status(201).send({ message: 'Item added successfully' });
  } catch (err) {
    next(err);
  }
};

// Update an existing item
export const updateItem = async (req, res, next) => {
  try {
    const { _id, name, website, closingDate, type, imageIcon, ...extraFields } = req.body;

    const updateData = {
      name,
      website,
      closingDate: new Date(closingDate),
      type,
      imageIcon,
    };

    // Conditionally add extra fields based on the type
    if (type === 'job') {
      updateData.experience = extraFields.experience;
      updateData.ctc = extraFields.ctc;
      updateData.batchEligible = extraFields.batchEligible;
    } else if (type === 'hackathon') {
      updateData.hackathonType = extraFields.hackathonType;
      updateData.teamSize = extraFields.teamSize;
    } else if (type === 'internship') {
      updateData.batch = extraFields.batch;
      updateData.internshipType = extraFields.internshipType;
      updateData.stipend = extraFields.stipend;
    } else if (type === 'contest') {
      updateData.prizes = extraFields.prizes;
    }

    const updatedItem = await Item.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedItem) {
      res.status(404).send({ message: 'Item not found' });
      return;
    }

    res.status(200).send({ message: 'Item updated successfully', item: updatedItem });
  } catch (err) {
    next(err);
  }
};

// Delete an existing item
export const deleteItem = async (req, res, next) => {
  try {
    const { _id } = req.body;

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