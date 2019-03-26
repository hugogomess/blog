const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Category', CategorySchema);