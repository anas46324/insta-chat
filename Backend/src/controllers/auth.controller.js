const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const CryptoJS = require('crypto-js');
const bycrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateToken = require('../libs/utils');
const  cloudinary = require('../libs/cloudinary');
// const { sendEmail } = require('../libs/mailer');


const client = new OAuth2Client(process.env.Google_Client_ID)
const BASE_URL = process.env.NODE === " development" ? "http://localhost:3000" : "/"


function decrypt(password){
    let bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_SECRET);
    let decryptedPwd = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPwd;
}

    const signup = async (req, res) => {         
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        let profilePic = req.body.profilePic

        console.log(req.body)
        try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.json({ status : 201, message: 'User already exists' });
        }
        const newUser = new User({name, email, password: password, profilePic});       
        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save();
            generateSignInToken(email,password)
            res.json({ status : 200, message: 'User created', data:{
                id : newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic
            } });
        }
        else{
            res.json({ status : 400, message: 'Failed to create user' });
        }
        } catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
    }

    const signin = async (req, res) => {
            let email = req.body.email
            let password = req.body.password
            
            try {
                console.log(email, password);
                const user = await User.findOne({email});
                if(!user){
                    return res.status(201).json({ message:'User not found'});
                }
                const isMatch = await user.comparePassword(password);
                if(!isMatch){
                    return res.status(201).json({ message:'Incorrect password'});
                }
                else{
                    console.log(user._id, res.cookie)
                    generateToken(user._id, res)
                    res.status(200).json({ message: 'User Logged In Successfully', data:{
                        _id : user._id,
                        name: user.name,
                        email: user.email,
                        profilePic: user.profilePic
                    } });
                    
                }
            }
            catch(err){
                console.log(err);
                return res.status(500).send('Server error');
            }
    }

    const OAuth = async (req, res) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            return res.status(200).json({ message: `Welcome, user` });
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    }

    const googleSignup = async (req, res)=> {
        const {token} = req.body;
        console.log(req.body)

        try {
            const ticket = await client.verifyIdToken({
                idToken : token,
                audience : process.env.GOOGLE_CLIENT_ID
            })
            console.log(ticket)
            // const payload = ticket.getPayload()

        }
        catch{

        }
    }

    const logout = (req, res) => {
        try {
            res.cookie("token", "", {maxAge: 0})
            res.json({
                status: 200,
                message: 'Logged out successfully'
            })
        }
        catch (error){
            console.log("Error", error.message)
            res.json({
                status: 500,
                message: 'Internal Server Error'
            })
        }
    }

    const updateUser = async (req, res) => {
        try{
            const {profilePic} = req.body;
            const userId = req.user._id;

            if(!profilePic){
                return res.json({status:400, message: "No profile Pic detected"})
            }
            
            const uploadResponse = await cloudinary.uploader.upload(profilePic)
            const updatedUser = await User.findByIdAndUpdate(
                userId, {profilePic: uploadResponse.secure_url}, {new: true})

            res.json({ status: 200, message: "Updated User", data: updatedUser})
        }
        catch (error){
            console.log("Error", error.message)
        }
    }

    const checkAuth = async (req, res) => {
        try {
            res.status(200).json({data: req.user})
        }
        catch (error){
            console.log("Error in checkAuth controller", error.message)
            res.status(500).json({message: "Internal Server Error"})
        }
    }

    const authSignIn = async (req, res) => {
        let email
        let password
        let token = req.query.token
        console.log("Token",req.query.token)
        if(token){
            try {
                const verified = jwt.verify(token, process.env.JWT_SECRET);
                email = verified.email;
                password = verified.password;
                req.body = { email, password };
                return signin(req, res);
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token has expired. Please request a new one." });
                } else {
                    return res.status(401).json({ message: "Invalid token. Authentication failed." });
                }

        }
    }
    }


// Function to generate the token
const generateSignInToken = async (email, password) => {
  const payload = {
    email : email,
    password: password,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7D' });
  console.log(token)
//   await sendEmail(email, token)
  console.log(`${BASE_URL}/auth?token=${token}`)
  
  return token;
};


module.exports = { signup, signin, logout, updateUser ,OAuth, googleSignup, checkAuth, authSignIn, generateSignInToken };

