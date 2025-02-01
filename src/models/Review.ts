import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewerName: {type:String},
    reviewerTitle: {type:String},
    reviewDescription: {type:String},
    rating: {type:String},
    reviewStatus: {type:String},
    reviewImages: {type:String},
    reviewDateTime: {type:String},
    reviewUpdateTime: {type:String},
    _class: {type:String}
},
{
    timestamps: true,
})

export const Review = mongoose.model('review',reviewSchema)