import { apiErrorHandler } from "../handlers/errorHandler";

export default class ReviewCtrl {
    constructor(){}

    async reviewListing(req,res){
        try {
            
        } catch (error) {
            apiErrorHandler(error, req, res, 'Listing failed.');
        }
    }
}