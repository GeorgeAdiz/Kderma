const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    clientID: {
        type: String, 
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    aesthetician: {
        type: String,
        required: true
    },
    treatment: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        required: true,
        min: 0
    }
  
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
