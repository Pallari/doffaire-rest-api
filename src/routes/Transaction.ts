import { Router } from "express";
import TransactionCtrl from "../controllers/TransactionCtrl";
import { verifyAuthToken } from "../utils/authentication";

class TransactionRoutes{
    public router = Router()
    private transactionCtrl = new TransactionCtrl();
    constructor(){
        this.initializeroutes();
    }
    initializeroutes(){
        this.router.route('/transactionListing').post(verifyAuthToken,this.transactionCtrl.transactionListing)
    }
}