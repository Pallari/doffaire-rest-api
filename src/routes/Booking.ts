import { Router } from 'express';
import BookingCtrl from '../controllers/BookingCtrl';


class BookingRoutes {
  public router = Router();
  private bookingCtrl = new BookingCtrl()

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    this.router.route('/').post(this.bookingCtrl.bookingListing);

  }
}
export default new BookingRoutes().router;
