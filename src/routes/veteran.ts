import { Router } from 'express';

import VeteranCtrl from '../controllers/VeteranCtrl';

class VeteranRoutes {

    router = Router();

    veteranCtrl = new VeteranCtrl();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // GET APIs
        this.router.route("/").get(this.veteranCtrl.getVeteran);

        // POST APIs
        // this.router.route("/update").post(this.veteranCtrl.updateVeteran);

        // PUT APIs
    
        // DELETE APIs
        this.router.route("/delete").post(this.veteranCtrl.deleteVeteranInfo);
    }
}

export default new VeteranRoutes().router;
