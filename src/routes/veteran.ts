import { Router } from 'express';
import VeteranCtrl from '../controllers/VeteranCtrl';
import { validate } from '../middlewares/validate';
import { updateDetail } from '../validators/veteranValidator';
class VeteranRoutes {

    public router = Router();

    private veteranCtrl = new VeteranCtrl();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.route('/').get(this.veteranCtrl.getVeteran);
        this.router.route('/update').put(validate(updateDetail), this.veteranCtrl.updateVeteran);
        this.router.route("/updateDoctor/:id").put(this.veteranCtrl.updateDoctor);
        this.router.route("/deleteDoctor/:id/:doctorId").delete(this.veteranCtrl.deleteDoctor);
    }
}

export default new VeteranRoutes().router;
