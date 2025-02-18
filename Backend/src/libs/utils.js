const jwt = require("jsonwebtoken")

const generateToken = (userId, res) =>{

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "1H",
    })

    res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
    
    return token
}

module.exports = generateToken