
const mongoose = require('mongoose');

const counselorSchema = new mongoose.Schema({
    image: {
        type: String
    },
    counselorName: {
        type: String,
        required: true
    },
    Price: {
        type: String,
        required: true
    },
    Qualification: {
        type: String
    },
    Description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})
const counselor = mongoose.model('counselor', counselorSchema);
module.exports = counselor;