import { Router } from 'express';
import BookingCtrl from '../controllers/BookingCtrl';
import { listing, rescheduleBooking, rescheduleListing, sendVerificationCode, serviceVerification } from '../validators/bookingValidator';
import { validate } from '../middlewares/validate';
import { verifyAuthToken } from '../utils/authentication';


class BookingRoutes {
  public router = Router();
  private bookingCtrl = new BookingCtrl()

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    this.router.route('/listing').post(verifyAuthToken, validate(listing), this.bookingCtrl.bookingListing);
    this.router.route('/rescheduleBooking').put(verifyAuthToken, validate(rescheduleBooking), this.bookingCtrl.rescheduleBooking);
    this.router.route('/rescheduleListing').post(verifyAuthToken, validate(rescheduleListing), this.bookingCtrl.rescheduleListing);
    this.router.route('/sendVerificationCode').post(verifyAuthToken, validate(sendVerificationCode), this.bookingCtrl.sendVerificationCode);
    this.router.route('/serviceVerification').post(verifyAuthToken, validate(serviceVerification), this.bookingCtrl.serviceVerification);

  }
}
export default new BookingRoutes().router;
