import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  closingDate: {
    type: Date,
    required: true,
    index: { expires: '4h' }
  },
  type: {
    type: String,
    enum: ['Hackathon', 'Job', 'Internship', 'Contest'],
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
  timestamps: true,
  versionKey: false
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
