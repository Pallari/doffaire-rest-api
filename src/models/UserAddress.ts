import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
    addressType: {type:String},
    houseNumber: {type:String},
    area: {type:String},
    landmark: {type:String},
    city: {type:String},
    state: {type:String},
    country: {type:String},
    location:{
        type: {type:String},
        coordinates: {type:Array}
    },
    locationAddress: {type:String},
},
  {
    timestamps: true,
  });

export const UserAddress = mongoose.model('userAddress', userAddressSchema);