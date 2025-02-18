const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: false,
    },
    password:{
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
        default: '',
    },
},
{timestamps: true}
)

UserSchema.pre('save',  async function(next){
    if(this.isModified('password')){
        this.password = await bycrypt.hashSync(this.password, 10);
    }
    next();
})

UserSchema.methods.comparePassword = function(userPwd){
    return bycrypt.compareSync(userPwd, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User