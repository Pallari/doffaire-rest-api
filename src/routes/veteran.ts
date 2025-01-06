import { Router } from 'express';

import VeteranCtrl from '../controllers/VeteranCtrl';

class VeteranRoutes {

    public router = Router();

    private veteranCtrl = new VeteranCtrl();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // GET APIs
        this.router.route("/").get(this.veteranCtrl.getVeteran);

        // POST APIs
        this.router.route("/update").post(this.veteranCtrl.updateVeteran);

        // PUT APIs
        this.router.route("/update").put(this.veteranCtrl.updateVeteran);

        // DELETE APIs
        this.router.route("/delete").post(this.veteranCtrl.deleteVeteranInfo);
    }
}

export default new VeteranRoutes().router;
