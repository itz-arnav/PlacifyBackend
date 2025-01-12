import mongoose from 'mongoose';

const updatedClickSchema = new mongoose.Schema({
    day: {
        type: Date,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    count: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

const UpdatedClick = mongoose.model('UpdatedClick', updatedClickSchema);

export default UpdatedClick;
