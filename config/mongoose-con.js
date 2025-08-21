const mongoose  = require("mongoose");
let db;
require('dotenv').config();
try{
   mongoose.connect(`${process.env.MONGO_URI}`);
   
console.log("ram")
   db = mongoose.connection;
   db.once('open',()=>{
     console.log("mongoDB connected..");
   })
}catch(err){
console.error("mongo connection failed",err.message);
}

module.exports = db;