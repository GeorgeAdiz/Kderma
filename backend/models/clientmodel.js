const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    clientID: {
        type: String, 
        required: true,
        unique: true
    },
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], 
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    contactNo: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
