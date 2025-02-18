const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Calling the user Model

const protectRoute = async (req, res, next) =>{
    try {
        const token = req.cookies.token;
    
        if (!token) {
            return res.status(201).json({ message: "Unauthorized - No Token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" })
        }


        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({ message : "User not Found"})
        }

        req.user = user;

        next()
    } 
    catch(error){
        console.log("Error", error.message);
    }
}


module.exports = protectRoute;