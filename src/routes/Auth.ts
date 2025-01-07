import { Router } from "express";
import AuthCtrl from "../controllers/AuthCtrl";
import { validate } from "../middlewares/validate";
import { register, verification, login } from "../validators/authValidator";
class AuthRoutes {
  router = Router();
  authCtrl = new AuthCtrl();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router
      .route("/registration")
      .post(validate(register), this.authCtrl.registration);
    this.router
      .route("/verification")
      .post(validate(verification), this.authCtrl.verification);
    this.router.route("/login").post(validate(login), this.authCtrl.login);
  }
}
export default new AuthRoutes().router;
