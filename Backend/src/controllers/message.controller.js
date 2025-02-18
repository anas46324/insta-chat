const cloudinary = require("../libs/cloudinary");
const { getReceiverSocketId, io } = require("../libs/socket");
const Message = require("../models/message");
const User = require("../models/User");

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.json({
            status: 200,
            data: filteredUsers
        })
    }
    catch (error) {
        console.log("Error in getUsersForSidebar", error.message)
        res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }

}

const getMessages = async (req, res) => {
    try {
        const {id:usertoChatID} = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or: [{
                senderId: myId,
                receiverId: usertoChatID
            },
            {
                senderId: usertoChatID,
                receiverId:myId
            }]
        })
        res.json({
            status: 200,
            data: messages
        })
    }
    catch (error){
        console.log("Error in getMessages", error.mesage)
        res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

const sendMessage = async (req, res) => {
    console.log(req.user)
    try {
        const {message, image} = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            image: imageUrl
        })
        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("NewMessage", newMessage)
        }

        res.json({
            status: 200,
            data: newMessage
        })
    }
    catch (error){
        console.log("Error in sendingMessage", error)
        res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}
module.exports = { getUsersForSidebar, getMessages, sendMessage }