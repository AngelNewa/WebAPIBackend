const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    image: {
        type: String
    },
    username: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});
const user = mongoose.model('users', userSchema);
module.exports = user;