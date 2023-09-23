import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String, required: true },
  closingDate: { type: Date, required: true, index: { expires: '4h' } },
  type: { type: String, enum: ['hackathon', 'job', 'internship', 'contest'], required: true },
  imageIcon: { type: String },
  company: { type: String},
  ctc: { type: String },
  batchEligible: { type: String },
});


const Item = mongoose.model('Item', itemSchema);

export default Item;
