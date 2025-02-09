import { apiErrorHandler } from "../handlers/errorHandler";
import { Transaction } from "../models/Transaction";

export default class TransactionCtrl{
    constructor(){}

    async transactionListing(req,res){
        try {
            const data = req.body
            let sort = data.sortBy ? data.sortBy : 'createdAt';
            const transactionData = await Transaction.find().sort(sort)
            .skip((+data.page - 1) * +data.pageSize)
            .limit(+data.pageSize)
            .lean()
            .exec();

            const transactionCount = await Transaction.find().countDocuments();
            if (transactionData)
                return res.json({
                success: true,
                data: transactionData,
                total: transactionCount,
                });

            return res.json({ success: false, message: 'No Reviews found' });

        } catch (error) {
            apiErrorHandler(error, req, res, 'Listing failed.');
        }
    }
}