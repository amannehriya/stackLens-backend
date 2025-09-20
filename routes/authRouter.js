const express= require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../utills/generateToken');
const jwt = ('jsonWebToken') 
router.get("/google",passport.authenticate('google',{scope:['profile','email']},
(req,res)=>{
    console.log("user:"); 
}
));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log(req.user)
    const token = generateToken(req.user);
    // console.log("Callback route hit, req.user:");
     res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set true in production with HTTPS
      sameSite: "none"
    });

     res.redirect(`https://stacklens.onrender.com/google/authHandle`)
  }
);
module.exports = router;