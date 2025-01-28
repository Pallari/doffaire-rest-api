import { apiErrorHandler } from "../handlers/errorHandler";
import { Booking } from "../models/Booking";

export default class DashboardCtrl {
    constructor(){}

    async todaysBookingListing(req,res){
           try {
             const data = req.body;
             const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
             const todayEnd = new Date(new Date().setHours(23, 59, 59, 999))
            
             console.log(`---todayStart-----`,todayStart)
             console.log(`---todayEnd-----`,todayEnd)

             const todaysQuery = {
                startTime: { $gt: todayStart },
                endTime: { $lt: todayEnd },
              };
       
             let searchQuery =
               data.business_category === 'groomer'
                 ? { serviceProviderType: 'groomer',todaysQuery }
                 : { serviceProviderType: 'vet',todaysQuery };
             let sort = data.sortBy ? data.sortBy : 'createdAt';
       
             if (data.searchString) {
               let query = {
                 $or: [
                   { status: { $regex: data.searchString, $options: 'i' } },
                   { serviceType: { $regex: data.searchString, $options: 'i' } },
                 ],
               };
               searchQuery = { ...searchQuery, ...query };
             }
             console.log(`---searchQuery-----`,searchQuery)

             const bookingData = await Booking.find(searchQuery)
               .sort(sort)
               .skip((+data.page - 1) * +data.pageSize)
               .limit(+data.pageSize)
               .populate({ path: 'userId', select: 'username' })
               .populate('petId')
               .lean()
               .exec();
       
             const bookingCount = await Booking.find(searchQuery).countDocuments();
             if (bookingData)
               return res.json({
                 success: true,
                 data: bookingData,
                 total: bookingCount,
               });
       
             return res.json({ success: false, message: 'No Bookings found' });
           } catch (error) {
            apiErrorHandler(error, req, res, `Today's Booking Listing Failed`);
        }
    }
}