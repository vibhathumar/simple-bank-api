const app = require('../src/app')
const request = require('supertest')
require('../src/db/mongoose')
const {Customer} = require('../src/models/customer')
const { customerOneId, customerTwoId, customerOne, customerTwo, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)
test('Should create a new customer', async () => {
    const response = await request(app)
                            .post('/add/customers')
                            .send({
                                customerNumber: '123456',
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
                                    emailId: 'savaliya123456.vibha@gmail.com',
                                    phone: '123',
                                    workPhone: '123'
                                      } 
                           })
                            .expect(201)
    const customer = await Customer.findOne({'customerNumber': response.body.customerNumber})
    expect(customer).not.toBeNull()
})
test('Should get a customer', async() => {
    const response = await request(app)
                                .get('/all')
                                .send()
                                .expect(200)
    expect(response.body.length).toBe(2)
})
test('Should get a customer by customer number', async() => {
    const response = await request(app)
                                .get(`/customer/${customerOne.customerNumber}`)
                                .send()
                                .expect(200)
    const customer = await Customer.findOne({'customerNumber': response.body.customerNumber})
    expect(customer).not.toBeNull()
})
test('Should update a customer by customer number', async() => {
    const response = await request(app)
                                .patch(`/customer/${customerOne.customerNumber}`)
                                .send({
                                    firstName: 'Thumar',
                                    status: 'competed'
                                })
                                .expect(200)
    const customer = await Customer.findOne({'customerNumber': response.body.customerNumber})
    expect(customer).not.toBeNull()
})
test('Should delete a customer by customer number', async() => {
    const response = await request(app)
                                .delete(`/customer/${customerOne.customerNumber}`)
                                .send()
                                .expect(200)
    const customer = await Customer.findOne({'customerNumber': response.body.customerNumber})
    expect(customer).toBeNull()
})