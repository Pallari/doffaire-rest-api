import { apiErrorHandler } from "../handlers/errorHandler";
import { Booking } from "../models/Booking";

export default class BookingCtrl {
    constructor(){
        this.bookingListing = this.bookingListing.bind(this)
    }

    async bookingListing(req,res) {
        try {
            const data = req.body
            let searchQuery = {}
            const x = await Booking.find(searchQuery).skip((+data.page - 1) * +data.size).limit(+data.size);

            // const total = await Booking.find(searchQuery).count();
            return res.json({ success: false, message: ` not found.` });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Listing failed.');
        }
    }
}