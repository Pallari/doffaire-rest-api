import { Router } from "express";
import AuthCtrl from "../controllers/AuthCtrl";
import { validate } from "../middlewares/validate";
import { register } from "../validators/authValidator";
class AuthRoutes {
  router = Router();
  authCtrl = new AuthCtrl();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.route("/registration").post(validate(register), this.authCtrl.registration);
  }
}
export default new AuthRoutes().router;
