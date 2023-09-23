import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
        index: true
    }
});

const Click = mongoose.model('Click', clickSchema);

export default Click;
