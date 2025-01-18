import { apiErrorHandler } from "../handlers/errorHandler";
import { Booking } from "../models/Booking";

export default class BookingCtrl {
    constructor(){
    }

    async bookingListing(req,res) {
        try {
            const data = req.body
            const currentTime = new Date()

            let searchQuery = data.business_category === 'groomer' ?  {serviceProviderType: "groomer"} : {serviceProviderType: "vet"}
            let sort = data.sortBy ? data.sortBy : 'createdAt';
        
            if(data.searchString){
                let query = {
                    $or: [
                        { status: { $regex: data.searchString, '$options': 'i'} },
                        { serviceType: { $regex: data.searchString, '$options': 'i' } },
                    ]
                };
                searchQuery =  {...searchQuery, ...query}
            }

            if(data.pageName === 'ongoing'){
                const ongoingQuery = {'startTime': {'$gt': currentTime} , 'endTime': {'$lt': currentTime}}
                searchQuery = {...searchQuery, ...ongoingQuery}
            }else if(data.pageName === 'upcoming'){
                const upcomingQuery = {'startTime': {'$gt': currentTime} , 'endTime': {'$gt': currentTime}}
                searchQuery = {...searchQuery, ...upcomingQuery}
            }else if(data.pageName === 'past'){
                const pastQuery = {'startTime': {'$lt': currentTime}}
                searchQuery = {...searchQuery, ...pastQuery}
            } 
             
            // Todo: pending Populate 
            const bookingData = await Booking.find(searchQuery).sort(sort).skip((+data.page - 1) * +data.pageSize).limit(+data.pageSize).lean().exec()
            
            // const bookingData = await Booking.find({serviceProviderType: "groomer"}).populate('createdBy')
           
            const bookingCount = await Booking.find(searchQuery).countDocuments();
            if(bookingData) return res.json({ success: true, data: bookingData, total: bookingCount });

            return res.json({success: false, message: 'No Bookings found'})
        } catch (error) {
            apiErrorHandler(error, req, res, 'Listing failed.');
        }
    }
}