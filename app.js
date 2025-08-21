
require("dotenv").config();
const express = require('express');
const app = express();
const expressSession = require("express-session");
const flash = require("connect-flash")
const db = require("./config/mongoose-con");
const searchRoute = require('./routes/SearchEngine')
const createCompany = require('./routes/createCompany');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:"anythiing"
}))
app.use(flash());


//routers
app.get("/",(req,res)=>{
   res.send("jai shree ganesh")
})

app.use("/search",searchRoute);
app.use("/company",createCompany)

app.listen(3000);