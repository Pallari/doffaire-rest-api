import { Router } from "express";
import GroomerCtrl from "../../controllers/groomer/GroomerCtrl";
class CourseRoutes {
  router = Router();
  coursesCtrl = new GroomerCtrl();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.route("/").get(this.coursesCtrl.userRegistration);
  }
}
export default new CourseRoutes().router;
