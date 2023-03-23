const mongoose = require('mongoose')
const validate = require('validator')

const branchAddressSchema = new mongoose.Schema({
    address1: {
        type: String,
        required: true,
        trim: true
    },
    address2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zip: {
        type: Number,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    }
})

const branchDetailsSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
        trim: true
    },
    branchCode: {
        type: Number,
        trim: true
    },
    branchAddress: {
        type: branchAddressSchema,
        required: true,
        trim: true
    },
    routingNumber: {
        type: Number,
        required: true,
        trim: true
    }
})

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    customerNumber: {
        type: Number,
        required: true,
        trim: true
    },
    branchDetails: {
        type: branchDetailsSchema,
        required: true,
        trim: true
    },
    accountStatus: {
        type: String,
        required: true,
        trim: true
    },
    accountType: {
        type: String,
        required: true,
        trim: true
    },
    accountBalance: {
        type: Number,
        required: true,
        trim: true
    }
},{
    timestamps: true
})

accountSchema.methods.toJSON = function () {
    const accountObject = this.toObject()

    delete accountObject._id
    delete accountObject.branchDetails._id
    delete accountObject.branchDetails.branchAddress._id
    delete accountObject.createdAt
    delete accountObject.updatedAt
    delete accountObject.__v

    return accountObject
}

const Accounts = mongoose.model('Accounts', accountSchema)
module.exports = {
    Accounts
}