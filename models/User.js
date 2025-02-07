const mongoose = require('mongoose');
const {Schema} = mongoose;
const PassportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})


// Will provide username and password field with required attributes
UserSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);