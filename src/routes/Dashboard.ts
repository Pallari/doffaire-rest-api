// import { Router } from "express";
// import DashboardCtrl from "../controllers/DashboardCtrl";
// import { verifyAuthToken } from "../utils/authentication";
// import { todaysListingValidator } from "../validators/dashboardValidator";
// import { validate } from "../middlewares/validate";

import { Router } from 'express';
import DashboardCtrl from "../controllers/DashboardCtrl";
class DashboardRoutes {
  public router = Router();
  
  private dashboardCtrl = new DashboardCtrl()
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.route('/todaysBooking').post(this.dashboardCtrl.todaysBookingListing);
  }
}

export default new DashboardRoutes().router;
