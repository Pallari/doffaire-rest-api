import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import { apiErrorHandler } from "../handlers/errorHandler";
import { Review } from "../models/Review";

export default class ReviewCtrl {
    constructor(){}

    async reviewListing(req,res){
        try {
            const data = req.body
            let sort = data.sortBy ? data.sortBy : { createdAt: 1 };
            const serviceProviderId = req.user._id
            let searchQuery = {serviceProviderId:serviceProviderId}

            if(data.sortBy === 'createdAt'){
                sort = { createdAt: -1 }
            }
            const reviewData = await Review.find(searchQuery)
            .sort(sort)
            .skip((+data.page - 1) * +data.pageSize)
            .limit(+data.pageSize).lean().exec();
           
            const reviewCount = await Review.find(searchQuery).countDocuments();
            if (reviewData)
                return res.json({
                success: true,
                data: reviewData,
                total: reviewCount,
                });

            return res.json({ success: false, message: 'No Reviews found' });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Listing failed.');
        }
    }
}