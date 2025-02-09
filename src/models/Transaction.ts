import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    merchantTransactionId: {type:String},
    transactionId: {type:String},
    amount:{type:String},
    currency:{type:String},
    paymentMode:{type:String},
    paymentStatus:{type:String},
    transactionDate: {type:String},
    responseCode:{type:String},
    paymentCode:{type:String},
    errorMessage:{type:String},
    merchantId:{type:String},
    paymentInstrument:{
        type:{type:String},
        cardType:{type:String},
        pgTransactionId:{type:String},
        bankTransactionId:{type:String},
        pgAuthorizationCode:{type:String},
        arn:{type:String},
        bankId:{type:String},
        brn:{type:String},
    },
    _class:{type:String}
},
{
  timestamps: true,
})

export const Transaction = mongoose.model('transaction',transactionSchema)
