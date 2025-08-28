const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utills/generateToken.js");
const userModel = require("../models/userModel");



module.exports.registerUser = async function (req, res) {
    try {
        console.log("register")
        let { username, email, password } = req.body;
        let user = await userModel.findOne({ username });
        if (user) {
            return res.status(404).json({ error: 'please try another username' })

        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await userModel.create({
                    username,
                    password: hash,
                    email,
                });
                let token = generateToken(user);
                res.cookie("token", token);
                return res.json({ message: 'user created successfully' });

            })
        })

    }
    catch (err) {
        res.status(500).json({"err":err.message});
    }
}


module.exports.loginUser = async (req, res) => {

    try {
        let { username, password } = req.body;
        let user = await userModel.findOne({ username });
        if (!user) {
            return res.json({ error: "something wents wrong" })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                let token = generateToken(user);

                res.cookie("token", token);

                res.json({status:true, message: "password matched" })
            }
            else {
                return res.status(401).json({status:false, error: "something wents wrong" });
            }

        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("internal server error",err)
    }

}

module.exports.logoutUser = async (req,res)=>{
try { 
   
     res.cookie("token","")
     console.log("logout")
    res.status(201).json({message:"logout"});
     
}catch(err){
    console.log(err);
}
 }