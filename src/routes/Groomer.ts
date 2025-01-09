import { Router } from 'express';
import GroomerCtrl from '../controllers/GroomerCtrl';
class GroomerRoutes {
  public router = Router();
  
  private groomerCtrl = new GroomerCtrl();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.route('/').get(this.groomerCtrl.getGroomer);
  }
}

export default new GroomerRoutes().router;
