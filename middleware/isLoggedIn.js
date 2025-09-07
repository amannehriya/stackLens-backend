const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");


module.exports = async(req,res,next)=>{
    try{
        // console.log("hit")
  const token = req?.cookies?.token;
    if(!token){
     return  res.status(400).json({status:false,error: "you need to login first"});
;
    }

     let decoded = jwt.verify(token,process.env.JWT_KEY);

     let user =  await userModel
     .findOne({email:decoded.email})
     .select("-password")  //esa krne se user ke password ke alava hmko saari detail mil jayegi
     
       if (!user) return res.status(400).json({ status: false, message: "Invalid Token" })
    //  res.status(201).json({status:true,message:"profile data",data:user})
     next();
    }
    catch(err){
       console.log(err.message);
       console.log("token not varified")
       return res.status(500).json({error:"failed to generate varified"})
    }
}