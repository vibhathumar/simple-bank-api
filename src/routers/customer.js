const express = require('express');
require('../db/mongoose')
const {Customer} = require('../models/customer')
const router = express.Router()


// const app = express()
// app.use(express.json());
// const port = process.env.PORT || 3000

router.post('/add/customers', async (req, res) => {
    const customer = new Customer(req.body)
    //console.log(customer)
    try{
        await customer.save()
        res.status(201).send(customer)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/all', async (req, res) => {
    try{
        const customer = await Customer.find()
        res.send(customer)
    } catch(e) {
        res.status(400).send(e)
    }
})
router.get('/customer/:id', async (req, res) => {
    
    const getCustomerByCustomerNumber = await Customer.findOne({'customerNumber': req.params.id})
    if(!getCustomerByCustomerNumber) {
        throw new Error('Customer not found!')
    } 
    try{
        res.send(getCustomerByCustomerNumber)
    } catch(e) {
        res.status(400).send(e)
    }
})
router.patch('/customer/:id', async (req, res) => {
    
    try{
        const UpdateCustomerByCustomerNumber = await Customer.findOneAndUpdate({'customerNumber': req.params.id}, req.body , { new: true, runValidators: true })
        res.send(UpdateCustomerByCustomerNumber)

    } catch(e) {
        res.status(400).send(e)
    }
})
router.delete('/customer/:id', async (req, res) => {
    const customer = await Customer.findOneAndDelete({'customerNumber': req.params.id})
    if(!customer){
        throw new Error('Customer not found!')
    }
    try{
        res.send(customer)
    }catch(e) {
        res.status(400).send(e)
    }
})

// app.listen(port, () => {
//     console.log('Server is up on port: ' + port)
// })

module.exports = router