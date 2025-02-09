import axios from 'axios';
import { apiErrorHandler } from '../handlers/errorHandler';
import { Booking } from '../models/Booking';
import { User } from '../models/User';
import { SMS_API_KEY, TWO_FACTOR_SMS_API } from '../constants/constants-info';

export default class BookingCtrl {
  emailTransport: any;
  constructor() {}

  async bookingListing(req, res) {
    try {
      const data = req.body;
      const serviceProviderId = req.user._id
      const currentTime = new Date();

      let searchQuery ={ serviceProviderId }
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

      if (data.pageName === 'ongoing') {
        const ongoingQuery = {
          startTime: { $gt: currentTime },
          endTime: { $lt: currentTime },
        };
        searchQuery = { ...searchQuery, ...ongoingQuery };
      } else if (data.pageName === 'upcoming') {
        const upcomingQuery = {
          startTime: { $gt: currentTime },
          endTime: { $gt: currentTime },
        };
        searchQuery = { ...searchQuery, ...upcomingQuery };
      } else if (data.pageName === 'past') {
        const pastQuery = { startTime: { $lt: currentTime } };
        searchQuery = { ...searchQuery, ...pastQuery };
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
      apiErrorHandler(error, req, res, 'Listing failed.');
    }
  }

  async rescheduleBooking(req, res) {
    try {
      const data = req.body;
      const updateData = {
        status: 'rescheduleRequest',
        startTime: data.startTime,
        endTime: data.endTime,
      };
      const bookingData = await Booking.updateOne(
        { _id: data.bookingId },
        { $set: updateData }
      );

      if (bookingData)
        return res.json({
          success: true,
          message: 'Booking Rescheduled Successfully',
        });

      return res.json({
        success: false,
        message: 'Failing Rescheuled Booking',
      });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Reschedule Booking failed.');
    }
  }

  async rescheduleListing(req,res) {
    try {
        const data = req.body;
        const serviceProviderId = req.user._id
        let searchQuery = { serviceProviderId, 
            $or: [
              {
                status: 'rescheduled'
              },
              {
                status: 'rescheduleRequest'
              }
        ]}
          
        let sort = data.sortBy ? data.sortBy : 'createdAt';
  
        if (data.searchString) {
          let query =  { status: { $regex: data.searchString, $options: 'i' } };
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
      apiErrorHandler(error, req, res, 'Listing failed.');  
    }
  }

  async sendVerificationCode(req,res){
    try {
        const data = req.body
        const bookingData = await Booking.findById(data.bookingId).lean().exec()

        if(!bookingData) return res.json({ success: false, message: 'No Bookings found' });

        const userData = await User.findById(bookingData.userId).lean().exec()
        if(!userData) return res.json({ success: false, message: 'No User found' });
        
        const otp = Math.floor(Math.random() * ((9999 - 1000 + 1)) + 1000);
        await axios.get(`${TWO_FACTOR_SMS_API}/${SMS_API_KEY}/SMS/${userData.phoneNumber}/${otp}`)
        .then(async (response) => {
  
          if (response.statusText === 'OK') return res.json({ success: true, message: 'Otp Sent Successfully' });
  
          return res.json({ success: false, message: `Error while saving Data` });
        })
        .catch((error) => {
          apiErrorHandler(error, req, res, 'Sending Sms failed.');
        });

    } catch (error) {
      apiErrorHandler(error, req, res, 'Send Verification Failed');
    }
  }

  async serviceVerification(req,res) {
    try {
        const data = req.body
        const bookingData = await Booking.findById(data.bookingId).lean().exec()

        if(!bookingData) return res.json({ success: false, message: 'No Bookings found' });

        const userData = await User.findById(bookingData.userId).lean().exec()
        if(!userData) return res.json({ success: false, message: 'No User found' });


        await axios.get(`${TWO_FACTOR_SMS_API}/${SMS_API_KEY}/SMS/VERIFY3/${userData.phoneNumber}/${data.otp}`)
        .then(async (response) => {
          if (response.data.Status === 'Success') {
            await Booking.updateOne({ _id: data.bookingId }, { $set: { status: data.status } });
            return res.json({ success: true, message: 'Verification Success' });
          }
          return res.json({ success: false, message: 'Verification Failed' });
        })
        .catch(() => {
          return res.json({ success: false, message: 'Verification Failed' });
        });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Service Verification failed.');  
    }
  }

  async updateBookingStatus(req,res){
    try {
        const {bookingId, status} = req.body
        const bookingData = await Booking.findByIdAndUpdate({ _id:bookingId }, { $set: { status } }, { new: true });
    
          if (bookingData){
              const userId = bookingData.createdBy;
              // sending mail to user for accepting the booking
              if(status === 'confirmed'){
                const emailData = {
                  to: userId,
                  subject: `Booking Accepted`,
                  text: `Your Booking is confimed`
                };
            
                await this.emailTransport.sentVerificationEmail(emailData)
              }

                // sending mail to user for rejecting the booking
                if(status === 'rejectByProvider'){
                  const emailData = {
                    to: userId,
                    subject: `Booking Rejected`,
                    text: `Your Booking is rejected.`
                  };
              
                  await this.emailTransport.sentVerificationEmail(emailData)
                }
                
               // sending mail to user for cancel the booking
               if(status === 'cancelByProvider'){
                const emailData = {
                  to: userId,
                  subject: `Booking Cancelled`,
                  text: `Your Booking is cancelled.`
                };
            
                await this.emailTransport.sentVerificationEmail(emailData)
              }

               // sending mail to user for rescheduling the booking
               if(status === 'rescheduleByProvider'){
                const emailData = {
                  to: userId,
                  subject: `Booking Rescheduled`,
                  text: `Your booking is rescheduled. Kindly check your booking for the update.`
                };
            
                await this.emailTransport.sentVerificationEmail(emailData)
              }


            return res.json({
              success: true,
              message: 'Booking Status updated Successfully',
            });
          }
           
    
          return res.json({
            success: false,
            message: 'Updating Booking Status failed',
          });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Update Booking failed.');  
    }
  }
}
