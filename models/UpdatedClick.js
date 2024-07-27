import mongoose from 'mongoose';

const updatedClickSchema = new mongoose.Schema({
    day: {
        type: Date,
        required: true,
        unique: true, // Ensures each day can only have one record
        index: true, // Speeds up the querying based on 'day'
        trim: true // Though not typically necessary for dates, ensuring clean data entry can sometimes prevent subtle bugs
    },
    count: {
        type: Number,
        required: true,
        default: 0,
        min: 0 // Ensure that count cannot be negative
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    versionKey: false // Disables the __v field used by Mongoose to track document revisions
});

const UpdatedClick = mongoose.model('UpdatedClick', updatedClickSchema);

export default UpdatedClick;
