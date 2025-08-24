const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
   name:{
    type:String,
    required:true,
    trim:true,
    unique:true,
   },
   languages:{
    type:[String],
    required:true,
   },
   salary:{
    fresher:{
        type:Number,
        // required:true,
    },
      experienced: {
        type: Number,
        // required:true,
      },
   },
      jobAvailability: {
      type: Boolean, // true = hiring, false = not hiring
      default: true,
    },
    minKnowledge: {
      type: String, // e.g. "Basics of JavaScript", "DSA + SQL"
      // required: true,
    },
    location: {
      type: String, // e.g. "Remote", "San Francisco, USA"
      default: "Remote",
    },
    companySize: {
      type: String, // e.g. "Startup", "Mid-size", "Enterprise"
      enum: ["Startup", "Mid-size", "Enterprise"],
      default: "Startup",
    },
    website: {
      type: String, // optional field
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    logo:{
     data:Buffer,
     contentType:String,
    }
})

module.exports = mongoose.model("company",companySchema);