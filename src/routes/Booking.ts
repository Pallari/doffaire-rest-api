import { Router } from 'express';
import BookingCtrl from '../controllers/BookingCtrl';
import { listing } from '../validators/bookingValidator';
import { validate } from '../middlewares/validate';


class BookingRoutes {
  public router = Router();
  private bookingCtrl = new BookingCtrl()

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    this.router.route('/').post(validate(listing), this.bookingCtrl.bookingListing);

  }
}
export default new BookingRoutes().router;
