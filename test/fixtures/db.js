const mongoose = require('mongoose')

const {Customer} = require('../../src/models/customer')

const customerOneId = new mongoose.Types.ObjectId()
const customerOne = {
    _id: customerOneId,
    customerNumber: '123',
    firstName: 'savaliya',
    lastName: 'vibha',
    status: 'pending',
    address: {
        address1: 'first',
        address2: 'second',
        city: 'stockholm',
        state: 'sweden',
        zip: '123',
        country: 'sweden'
        },
    contact: {
        emailId: 'savaliya1234.vibha@gmail.com',
        phone: '123',
        workPhone: '123'
            } 
}
const customerTwoId = new mongoose.Types.ObjectId()
const customerTwo = {
    _id: customerTwoId,
    customerNumber: '12345',
    firstName: 'savaliya',
    lastName: 'vibha',
    status: 'pending',
    address: {
        address1: 'first',
        address2: 'second',
        city: 'stockholm',
        state: 'sweden',
        zip: '123',
        country: 'sweden'
        },
    contact: {
        emailId: 'savaliya12345.vibha@gmail.com',
        phone: '123',
        workPhone: '123'
            } 
}


const setupDatabase = async () => {
    await Customer.deleteMany()
    //await Task .deleteMany()
    await new Customer(customerOne).save()
    await new Customer(customerTwo).save()
    // await new Task(taskOne).save()
    // await new Task(taskTwo).save()
    // await new Task(taskThree).save()
}

module.exports = {
    customerOneId,
    customerOne,
    customerTwoId,
    customerTwo,
    // taskOne,
    // taskTwo,
    // taskThree,
    setupDatabase
}
