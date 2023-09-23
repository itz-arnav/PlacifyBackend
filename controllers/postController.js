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
    const { 
      name, 
      website, 
      closingDate, 
      type, 
      imageIcon, 
      ctc, 
      batchEligible 
    } = req.body;

    // Create an object for the new item, including mandatory fields
    const newItemData = {
      name,
      website,
      closingDate: new Date(closingDate),
      type,
      imageIcon
    };

    // Add ctc and batchEligible fields based on the type
    if (type === 'job' || type === 'internship') {
      newItemData.ctc = ctc;
      newItemData.batchEligible = batchEligible;
    }

    const newItem = new Item(newItemData);
    await newItem.save();

    res.status(201).send({ message: 'Item added successfully' });
  } catch (err) {
    next(err);
  }
};


export const updateItem = async (req, res, next) => {
  try {
      const _id = req.params.id;  // Getting the ID from route parameters

      const {
          name,
          website,
          closingDate,
          type,
          imageIcon,
          ctc,
          batchEligible
      } = req.body;

      // Create an object for updating the item, including mandatory fields
      const updateData = {
          name,
          website,
          closingDate: new Date(closingDate),
          type,
          imageIcon
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