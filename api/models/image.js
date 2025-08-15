import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    contributor: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Image', imageSchema);
