import { apiErrorHandler } from "../handlers/errorHandler";
import { Booking } from "../models/Booking";
import { Groomer } from "../models/Groomer";
import { Veteran } from "../models/Veteran";

export default class DashboardCtrl {
    constructor(){}

    async todaysBookingListing(req,res){
           try {
             const data = req.body;
             const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
             const todayEnd = new Date(new Date().setHours(23, 59, 59, 999))
            
             const todaysQuery = {
                startTime: { $gt: todayStart },
                endTime: { $lt: todayEnd },
              };
       
             let searchQuery =
               data.business_category === 'groomer'
                 ? { serviceProviderType: 'groomer',...todaysQuery }
                 : { serviceProviderType: 'vet',...todaysQuery };
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

    async analyticData(req,res){
      try {        
        let serviceProviderId = req.user._id;

        // Pending: average This month,  feedbacks by users, average appointment time, repeated clients
        const data = await Booking.aggregate([
          {'$match': {serviceProviderId: serviceProviderId}},
          
          {
            $project:{
              bookingAmount: 1,
              userId: 1,
              upcomingBooking: {  $cond: [ { $eq: ["$status", 'confirmed'] },1,0]},
              completedBooking: {  $cond: [ { $eq: ["$status", 'completed'] },1,0]},
              cancelledBooking: {  $cond: [ { $eq: ["$status", 'cancelled'] },1,0]},
            }
          },
          { $group: {
            _id: 1,
            totalBooking: { $sum: 1 },
            upcomingBooking: {$sum: "$upcomingBooking"},
            completedBooking: {$sum: "$completedBooking"},
            cancelledBooking: {$sum: "$cancelledBooking"},
            totalearning:   { $sum: "$bookingAmount" },
            averageEarning: {$avg: "$bookingAmount"},
            totalClients: {$addToSet:  {$sum: "$userId"}}
        }},
        ])

        return res.json({success: true, data: data})
             
      } catch (error) {
        apiErrorHandler(error, req, res, `Analytic Data Failed`);
      }
    }
}