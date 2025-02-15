const mongoose = require('mongoose');
const {Schema} = mongoose;
const PassportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // optional; allows multiple users if you have local + google logins
    },
})


// Will provide username and password field with required attributes
UserSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);