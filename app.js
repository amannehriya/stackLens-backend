
require("dotenv").config();
const express = require('express');
const app = express();
const expressSession = require("express-session");
const flash = require("connect-flash")
const port = process.env.PORT || 3000;
const db = require("./config/mongoose-con");
const searchRoute = require('./routes/SearchEngine')
const createCompany = require('./routes/createCompany');
const userRoute = require('./routes/user');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter')
const passport = require('passport');
const comunicationRoute  = require('./routes/communication')
require('dotenv').config();
require('./config/google-strategy');
app.use(cors({
    origin:"http://localhost:5173", // React app
      credentials: true,               // Allow cookies
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:"anythiing",
    cookie:{
        httpOnly:true,
        secure:true,
        sameSite:'strict' // "none"  frontend & backend are on different domains
    }
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//routers
app.get("/",(req,res)=>{
   res.send("jai shree ganesh")
})

app.use("/search",searchRoute);
app.use("/company",createCompany)
app.use("/user",userRoute);
app.use('/auth',authRouter);
app.use('/comunication',comunicationRoute)
app.listen(port,()=>{
    console.log(`sserver is running on ${port}`)
});