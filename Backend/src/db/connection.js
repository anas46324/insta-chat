const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () =>{
    try {
        await mongoose.connect(MONGO_URI,{
            // userNewUrlParser: true,
            // userUnifiedTopology: true,
        })
            console.log('Connected to the database');
         } catch(err) {
        console.log('Error connecting to the database');
        console.log(err);
    };
}

module.exports = connectDb;