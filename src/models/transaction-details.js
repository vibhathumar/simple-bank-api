const mongoose = require('mongoose')

const TransactionDetailsSchema = new mongoose.Schema({
    accountNumber: {
        type: Number,
        required: true,
        trim: true
    },
    txType: {
        type: String,
        required: true,
        trim: true
    },
    txAmount: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true
}) 

const TransactionDetails = mongoose.model ('TransactionDetails', TransactionDetailsSchema)

module.exports = {
    TransactionDetails
}