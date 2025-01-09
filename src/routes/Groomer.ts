import { Router } from 'express';
import GroomerCtrl from '../controllers/GroomerCtrl';
import { validate } from '../middlewares/validate';
import { updateDetail } from '../validators/groomerValidator';
class GroomerRoutes {
  public router = Router();
  
  private groomerCtrl = new GroomerCtrl();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    
    this.router.route('/groomer').get(this.groomerCtrl.getGroomer);

    this.router.route('/groomer/update').put(validate(updateDetail), this.groomerCtrl.updateGroomer);
  }
}

export default new GroomerRoutes().router;
