import { Router } from "express";
import GroomerCtrl from "../../controllers/groomer/GroomerCtrl";
class GroomerRoutes {
  router = Router();
  groomerCtrl = new GroomerCtrl();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router
      .route("/registration")
      .post(this.groomerCtrl.groomerRegistration);
    this.router.route("/").get(this.groomerCtrl.getGroomer);
    this.router.route("/verification").post(this.groomerCtrl.verification);
  }
}
export default new GroomerRoutes().router;
