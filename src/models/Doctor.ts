import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {type:String},
    about: {type:String},
    profileImage: {type:String},
    email: {type:String},
    phone: {type:String},
    alternativePhone: {type:String},
    specializations: {type:Array},
    workExperiance: {type:String},
    consultationFee: {type:String},
    availability:{type:Array},
    reviews:{type:Array},
    rating: {type:String},
    consultationTime: {type:String},
},
{
  timestamps: true,
})

export const Doctor = mongoose.model('doctor',doctorSchema);