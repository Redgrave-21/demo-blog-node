const mongoose = require("mongoose");
const validator = require('validator')

const userSchema = new mongoose.Schema({
    user_name: { type: String, default:null},
    email: {type: String, unique: true},
    password: {type: String},
    token : {type: String},
    role : {type: String, enum:['user', 'admin'], default:'admin'},
});

module.exports= mongoose.model("user",userSchema);
