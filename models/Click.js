import mongoose from 'mongoose';

// Define the schema for the 'Click' document
const clickSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
        index: true,  // Optimize queries that filter by timestamp
        default: Date.now  // Automatically set to the current date and time if not provided
    }
}, {
    timestamps: true,  // Automatically add 'createdAt' and 'updatedAt' fields
    versionKey: false  // Disable versioning with '__v' field if not needed
});

// Create a model from the schema
const Click = mongoose.model('Click', clickSchema);

export default Click;
