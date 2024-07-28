import mongoose from 'mongoose';

// Define the schema for the 'Item' document
const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true  // Trims whitespace from both ends of the string
  },
  website: { 
    type: String, 
    required: true,
    unique: true,  // Ensures that each website is unique in the database
    trim: true
  },
  closingDate: { 
    type: Date, 
    required: true, 
    index: { expires: '4h' }  // Documents will expire 4 hours after the 'closingDate'
  },
  type: { 
    type: String, 
    enum: ['hackathon', 'job', 'internship', 'contest'], 
    required: true 
  },
  imageIcon: { 
    type: String, 
    trim: true 
  },
  company: { 
    type: String, 
    trim: true 
  },
  ctc: { 
    type: String, 
    trim: true 
  },
  batchEligible: { 
    type: String, 
    trim: true 
  },
  status: { type: String, enum: ['pending', 'accepted'], required: true }

}, {
  timestamps: true,  // Adds createdAt and updatedAt timestamps
  versionKey: false  // Disables the __v field used by Mongoose to track document revisions
});

// Create a model from the schema
const Item = mongoose.model('Item', itemSchema);

export default Item;
