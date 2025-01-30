import { Router } from "express";
import DashboardCtrl from "../controllers/DashboardCtrl";
import { verifyAuthToken } from "../utils/authentication";
import { todaysListingValidator } from "../validators/dashboardValidator";
import { validate } from "../middlewares/validate";

class DashboardRoutes {
  public router = Router();
  
  private dashboardCtrl = new DashboardCtrl()
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.route('/todaysBooking').post(verifyAuthToken, validate(todaysListingValidator),this.dashboardCtrl.todaysBookingListing);
    this.router.route('/analyticData').get(verifyAuthToken,this.dashboardCtrl.analyticData);

  }
}

export default new DashboardRoutes().router;
