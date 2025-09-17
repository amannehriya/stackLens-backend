const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require("../models/userModel");

passport.use(
    new GoogleStrategy(
        {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`  //means jese hi authentication complete ho jayegi to is url pr chalejayega
  },
  async function(accessToken, refreshToken, profile, cb) {
    // console.log("line13")
    // console.log(profile)

    let user = await userModel.findOne({googleId:profile.id});
    let email = null;
    if (profile.emails && profile.emails.length > 0) {
  email = profile.emails[0].value;
}

    if(!user){
        user = await userModel.create({
    googleId: profile.id,
    username: profile.displayName,
    email
  });
    }
  
      return cb(null,user);
  }
));

passport.serializeUser((user,done)=>{
    // console.log("Serializing:", user);  
    done(null,user.id);    //upr jo user me aaya he vo hi hme yaha milega
})

passport.deserializeUser((id,done)=>{
    // console.log("Deserializing:", id);   // 👈 check this
    done(null,id);
})