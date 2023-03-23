const mongoose = require('mongoose')

const transferDetailsSchema = new mongoose.Schema({
    fromAccountNumber: {
        type: Number,
        required: true,
        trim: true
    },
    toAccountNumber: {
        type: Number,
        required: true,
        trim: true
    },
    transferAmount: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const TransferAmount = mongoose.model('TransferAmount', transferDetailsSchema)

module.exports = {
    TransferAmount
}