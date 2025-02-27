const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message:{
            type: String,
            required: true
        },
        image:{
            type: String,
        },
        video:{
            type: String,
        },
    },
    { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema)

module.exports = Message