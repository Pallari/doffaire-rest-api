import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref:'user'},
    petName: {type:String},
    age: {type:String},
    gender: {type:String},
    breed: {type:String},
    aboutMe: {type:String},
    height: {
        unit: {type:String},
        value: {type:String},
    },
    weight:{
        unit: {type:String},
        value: {type:String},
    },
    petBark: {type:String},
    petNature: {type:String},
    energyLevel: {type:String},
    behaviour: {type:String},
    vaccinated: {type:Boolean},
    vaccinationCertificates: {type:Array},
    images: {type:Array},
    imageWithUser: {type:String},
    userVerified: {type:Boolean},
    termsAccepted: {type:Boolean},
    acknowledgeAccepted: {type:Boolean},
    likeList:{type:String} // TODO: add reference
},
{
  timestamps: true,
})

export const Pet = mongoose.model('pet',petSchema);