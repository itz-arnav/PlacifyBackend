import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String, required: true },
  closingDate: { type: Date, requirede: true, index: { expires: '4h' } },
  type: { type: String, enum: ['hackathon', 'job', 'internship', 'contst'], required: true },
  imageIcon: { type: String },
  
  // For Jobs & Internships
  experience: { type: String },
  ctc: { type: String },
  batchEligible: { type: [String] }, // Could be an array of batch years: ['2022', '2023', ...]
  
  // For Hackathons
  hackathonType: { type: String },
  teamSize: { type: Number },

});

const Item = mongoose.model('Item', itemSchema);

export default Item;
