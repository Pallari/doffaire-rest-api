import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import { apiErrorHandler } from "../handlers/errorHandler";
import { Booking } from "../models/Booking";
import { Review } from "../models/Review";
export default class DashboardCtrl {
    constructor(){}

    async todaysBookingListing(req,res){
           try {
             const data = req.body;
             const serviceProviderId = req.user._id
             const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
             const todayEnd = new Date(new Date().setHours(23, 59, 59, 999))
            
             const todaysQuery = {
                startTime: { $gt: todayStart },
                endTime: { $lt: todayEnd },
              };
       
             let searchQuery =
               data.business_category === 'groomer'
                 ? { serviceProviderId,serviceProviderType: 'groomer',...todaysQuery }
                 : { serviceProviderId,serviceProviderType: 'vet',...todaysQuery };
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
        const serviceProviderId = req.user._id;
        
        const bookingData = await Booking.aggregate([
          {'$match': {serviceProviderId:  ObjectId.createFromHexString(serviceProviderId) }},
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

       // repeated clients
        const userRelatedData = await Booking.aggregate([
            {$match: {serviceProviderId:ObjectId.createFromHexString(serviceProviderId)}},
            {$group :
                 { _id: '$userId', 
                     repeatedClients: { $sum: 1 } 
                 }
             },
             {$match: {_id :{ $ne : null } , repeatedClients : {$gt: 1} } }, 
             { $group: { _id: null, repeatedClients: { $sum: 1 } } }
        ])

        //feedbacks by users
        const clientReviewData = await Review.aggregate([
          {'$match': {serviceProviderId: ObjectId.createFromHexString(serviceProviderId) }},
          {
              '$group':{
                  _id:1,
                  totalClients: {$sum: 1},
                  averagerating: {$avg: "$rating"},
              }
          },{
              '$project':{
                  totalClients: 1,
                  averageRating: 1,
                  _id:0
              }
          }
        ])

        // average This month
        const bookingMonthData = await Booking.aggregate([
          {$match: {serviceProviderId:ObjectId.createFromHexString(serviceProviderId)}},
          {
            '$group':{
                _id: {$month: '$startTime'},
                 numberofbookings: {$sum: 1}     
            }
          }
        ])

        const data = {
          totalBooking: bookingData ? bookingData[0].todaysBooking : 0,
          upcomingBooking: bookingData ? bookingData[0].upcomingBooking : 0,
          completedBooking: bookingData ? bookingData[0].completedBooking : 0,
          cancelledBooking: bookingData ? bookingData[0].cancelledBooking : 0,
          totalearning: bookingData ? bookingData[0].totalearning : 0,
          averageEarning: bookingData ? bookingData[0].averageEarning : 0,
          // totalClients: bookingData ? bookingData[0].totalClients : 0,
          repeatedClients: userRelatedData ? userRelatedData[0].repeatedClients : 0,
          totalClients: clientReviewData ? clientReviewData[0].totalClients : 0,
          averageRating: clientReviewData ? clientReviewData[0].averageRating : 0,
         monthlydata: bookingMonthData
        }
        return res.json({success: true, data:data})
             
      } catch (error) {
        apiErrorHandler(error, req, res, `Analytic Data Failed`);
      }
    }
}