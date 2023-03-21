const express = require('express');
require('../db/mongoose')
const {Customer} = require('../models/customer')


const app = express()
app.use(express.json());
const port = process.env.PORT || 3000

app.post('/add/customers', async (req, res) => {
    const customer = new Customer(req.body)
    //console.log(customer)
    try{
        await customer.save()
        res.status(201).send(customer)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.get('/all', async (req, res) => {
    try{
        const customer = await Customer.find()
        res.send(customer)
    } catch(e) {
        res.status(400).send(e)
    }
})
app.get('/customer/:id', async (req, res) => {
    
    const getCustomerByCustomerNumber = await Customer.findOne({'customerNumber': req.params.id})
    try{
        if(!getCustomerByCustomerNumber) {
            throw new Error()
        } 
        res.send(getCustomerByCustomerNumber)
    } catch(e) {
        res.status(400).send(e)
    }
})
app.patch('/customer/:id', async (req, res) => {
    
    try{
        const UpdateCustomerByCustomerNumber = await Customer.findOneAndUpdate({'customerNumber': req.params.id}, req.body , { new: true, runValidators: true })
        res.send(UpdateCustomerByCustomerNumber)

    } catch(e) {
        res.status(400).send(e)
    }
})
app.delete('customer/:id', async (req, res) => {
    try{
        const customer = await Customer.findOneAndDelete({'customerNumber': req.params.id})
        res.send(customer)
    }catch(e) {
        res.status(400).send(e)
    }
})

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})