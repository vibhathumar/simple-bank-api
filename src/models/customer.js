const mongoose = require('mongoose')
const validator = require('validator')


const addressSchema = new mongoose.Schema({
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

const contactSchema = new mongoose.Schema({
    emailId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
        // validate(value){
        //     if(!validator.isMobilePhoneLocales(value)){
        //         throw new Error('Phone number is invalid!')
        //     }
        // }
    },
    workPhone: {
        type: Number,
        trim: true
    }
})

const customerSchema = new mongoose.Schema({
    customerNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: addressSchema,
        required: true,
        trim: true
    },
    contact: {
        type: contactSchema,
        required: true,
        trim: true
    }
},{
    timestamps: true
})

customerSchema.methods.toJSON = function() {
    const customer = this
    const customerObject = customer.toObject()

    delete customerObject._id
    delete customerObject.address._id
    delete customerObject.contact._id
    delete customerObject.__v
    delete customerObject.createdAt
    delete customerObject.updatedAt
    return customerObject
}


const Customer = mongoose.model('Customer', customerSchema)
module.exports = {
    Customer
}