import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type:String},
    password: {type:String},
    phoneNumber: {type:String},
    active: {type:Boolean},
    roles: {type:Array},
    userName: {type:String},
    phoneValidated:{type:Boolean},
    otpSecret: {type:String},
    chatId: {type:String}, // TODO add reference
    _class: {type:String},
},
{
  timestamps: true,
});

export const User = mongoose.model('user', userSchema);