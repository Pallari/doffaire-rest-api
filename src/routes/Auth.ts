import { Router } from 'express';
import AuthCtrl from '../controllers/AuthCtrl';
import { validate } from '../middlewares/validate';
import { register, verification, login, forgotPassword } from '../validators/authValidator';
import EmailTransport from '../utils/email-transport';
import { verifyAuthToken } from '../utils/authentication';
class AuthRoutes {
  public router = Router();
  private authCtrl = new AuthCtrl();
  private emailTransport = new EmailTransport();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.route('/registration').post(validate(register), this.authCtrl.registration);

    this.router.route('/verification').post(validate(verification), this.authCtrl.verification);

    this.router.route('/login').post(validate(login), this.authCtrl.login);

    this.router.route('/forgotPassword').post(validate(forgotPassword), this.authCtrl.forgotPassword);

    this.router.route('/logout').post(verifyAuthToken ,this.authCtrl.logout);

    this.router.route('/send/email').post(this.emailTransport.sentVerificationEmail);
  }
}
export default new AuthRoutes().router;
