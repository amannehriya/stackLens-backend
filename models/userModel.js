const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
    },
    createdCompany: {
        type: [Object],

    },

})

module.exports = mongoose.model("user", userSchema);