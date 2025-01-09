import { Router } from 'express';
import VeteranCtrl from '../controllers/VeteranCtrl';
import { validate } from '../middlewares/validate';
import { updateDetail } from '../validators/groomerValidator';
class VeteranRoutes {

    public router = Router();

    private veteranCtrl = new VeteranCtrl();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // GET APIs
        this.router.route('/').get(this.veteranCtrl.getVeteran);

        // POST APIs

        // PUT APIs
        this.router.route('/update').put(validate(updateDetail), this.veteranCtrl.updateVeteran);
    
        // DELETE APIs
        this.router.route("/delete").post(this.veteranCtrl.deleteVeteranInfo);
    }
}

export default new VeteranRoutes().router;
