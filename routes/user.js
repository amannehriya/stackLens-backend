const express = require('express');
const { registerUser, loginUser, logoutUser,setProfile } = require('../controllers/authController');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn')
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const upload = require('../config/multer-config');


router.post('/register',registerUser);

router.post('/login',loginUser);

router.get('/profile',isLoggedIn,async(req,res)=>{
       
  try {

     const token = req?.cookies?.token;
  
       let decoded = jwt.verify(token,process.env.JWT_KEY);

 

       let user =  await userModel.findById(decoded.id)
       .select("-password -createdCompany") ;
     
// console.log(user);
     return  res.status(201).json({status:true,data:user})
  } catch (error) {
    return res.status(500).json({status:false,error});
  }

})

router.get('/myprofile',isLoggedIn,async(req,res)=>{
       
  try {

     const token = req?.cookies?.token;
  
       let decoded = jwt.verify(token,process.env.JWT_KEY);

 

       let user =  await userModel.findById(decoded.id)
       .select("-password -createdCompany -googleId") ;
     
// console.log(user);
    return  res.status(201).json(user)
  } catch (error) {
    return res.status(500).json(error);
  }

})
router.post('/myprofile/:user_id',isLoggedIn,upload.single('profilePic'),setProfile)

router.get('/logout',isLoggedIn,logoutUser);

router.post("/update",isLoggedIn,async(req,res)=>{
 
    try{  
        let{username,password, newpassword, confirmpassword,email} = req.body;
       let user = await userModel.findOne({username:req.user.username});
      //for confirming that the person performing change is a varified user 
      bcyrpt.compare(password,user.password,async(err,result)=>{
      if(result){
        if(newpassword==confirmpassword){
      bcyrpt.genSalt(10,(err,salt)=>{
        bcyrpt.hash(confirmpassword,salt,async(err,hash)=>{
          let updateuser = await userModel.findOneAndUpdate({email:req.user.email},{
            email,
            phone,
            address,
            password:hash,
            username
        })
       })
      })
      console.log(confirmpassword)
      
      }else{
        req.flash("notequal","password are not equal");
        res.redirect("/users/account");
      }
      
      }else{
        req.flash("error","incorrect password");
        res.redirect("/users/account");
           }
        })
        // next();
      }catch(err){
        console.log(err)
      }
})


module.exports = router;