import { Router } from "express";
import ReviewCtrl from "../controllers/ReviewCtrl";
import { verifyAuthToken } from "../utils/authentication";
import { validate } from "../middlewares/validate";
import { reviewListingValidator } from "../validators/reviewValidator";

class ReviewRoutes{
    public router = Router();

    private reviewCtrl = new ReviewCtrl();
    constructor(){
        this.initializeroutes();
    }
    initializeroutes(){
        this.router.route('/reviewListing').post(verifyAuthToken, validate(reviewListingValidator),this.reviewCtrl.reviewListing)
    }
}