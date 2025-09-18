const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utills/generateToken.js");
const userModel = require("../models/userModel");



module.exports.registerUser = async function (req, res) {
    try {
        // console.log("register")
        let { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(401).json({ status: false, error: 'provide all detail' })

        let user = await userModel.findOne({ username });
        // console.log(user)
        if (user) {
            return res.status(404).json({ status: false, error: 'please try another username' })

        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await userModel.create({
                    username,
                    password: hash,
                    email,
                });
                let token = generateToken(user);
                res.cookie("token", token,{
                                httpOnly: true,
                                 secure: true,     // must be true on HTTPS
                                  sameSite: "none"  // allow cross-site
                                         });
                return res.status(201).json({ status: true, message: 'user created successfully' });

            })
        })

    }
    catch (err) {
        console.log("error", err)
        res.status(500).json({ status: false, "err": err.message });
    }
}


module.exports.loginUser = async (req, res) => {

    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "something wents wrong" })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                let token = generateToken(user);

                res.cookie("token", token,{
                                httpOnly: true,
                                 secure: true,     // must be true on HTTPS
                                  sameSite: "none"  // allow cross-site
                                         });

                res.json({ status: true, message: "password matched" })
            }
            else {
                return res.status(401).json({ status: false, error: "something wents wrong" });
            }

        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("internal server error", err)
    }

}

module.exports.logoutUser = async (req, res) => {
    try {

        res.cookie("token", "")
        console.log("logout")
        res.status(201).json({ message: "logout" });

    } catch (err) {
        console.log(err);
    }
}

module.exports.setProfile = async (req, res) => {
    try {
        const {user_id} = req.params;
        const { name, location, phoneNumber } = req.body;
//  console.log(phoneNumber)
        const updatedData = {
            username:name,
            location,
            phoneNumber
        }
        if (req.file) {
            updatedData.profilePic = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(user_id, updatedData, {
            new: true, runValidators: true
        }).select('-password');
        if (updatedUser) res.status(201).json({ status: true, data: updatedUser,message:"profile update successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, data: error,message:"profile not update" })
    }
}
