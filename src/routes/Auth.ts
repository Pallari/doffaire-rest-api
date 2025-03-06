import { Router } from 'express';
import AuthCtrl from '../controllers/AuthCtrl';
import { validate } from '../middlewares/validate';
import { register, verification, login, forgotPassword, resendOtp } from '../validators/authValidator';
import { verifyAuthToken } from '../utils/authentication';
class AuthRoutes {
  public router = Router();
  private authCtrl = new AuthCtrl();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.route('/registration').post(validate(register), this.authCtrl.registration);

    this.router.route('/verification').post(validate(verification), this.authCtrl.verification);

    this.router.route('/resendOtp').post(validate(resendOtp), this.authCtrl.resendOtp);

    this.router.route('/login').post(validate(login), this.authCtrl.login);

    this.router.route('/forgotPassword').post(validate(forgotPassword), this.authCtrl.forgotPassword);

    this.router.route('/refreshToken').post(verifyAuthToken, this.authCtrl.refreshToken);

    this.router.route('/validateToken').get(verifyAuthToken, this.authCtrl.validateToken);

    this.router.route('/logout').post(verifyAuthToken, this.authCtrl.logout);

    this.router.route('/deleteAccount/:businessCategory').delete(verifyAuthToken, this.authCtrl.deleteUser);

  }
}
export default new AuthRoutes().router;
