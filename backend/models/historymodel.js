const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    treatment: {
        type: String,
        required: true
    },
    aesthetician: {
        type: String,
        required: false
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
