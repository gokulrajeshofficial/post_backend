const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type :String,
        unique:[true,'Email already exists'],
    },
    password : String
})

const UserModel = mongoose.model('User',userSchema)
module.exports = UserModel;

