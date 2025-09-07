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
    googleId: {
        type: String,
        unique: true,   // one user per Google account
        sparse: true    // allows other users without GoogleId (if you support local login too)
    },
    profilePic: {
        data: Buffer,
        contentType: String,
    }
    ,
    password: {
        type: String,
        // required: true
    },
    location:{
          type:String
    },
    phoneNumber: {
        type: Number,
    },
    createdCompany: {
        type: [Object],

    },

})

module.exports = mongoose.model("user", userSchema);