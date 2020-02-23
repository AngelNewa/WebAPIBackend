const mongoose = require('mongoose');

const appoinmentSchema = new mongoose.Schema({
    counselor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'counselor'
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Appoinment', appoinmentSchema);