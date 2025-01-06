import { Router } from "express";
import GroomerCtrl from "../../controllers/groomer/GroomerCtrl";
class GroomerRoutes {
  router = Router();
  groomerCtrl = new GroomerCtrl();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {

    // GET APIs
    this.router.route("/").get(this.groomerCtrl.getGroomer);

    // POST APIs
    this.router.route("/registration").post(this.groomerCtrl.groomerRegistration);
    this.router.route("/verification").post(this.groomerCtrl.verification);

    // PUT APIs

    // DELETE APIs
  }
}
export default new GroomerRoutes().router;
