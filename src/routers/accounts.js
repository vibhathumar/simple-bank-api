const express = require('express')
require('../db/mongoose')
const generateUniqueId = require('generate-unique-id');
const {Accounts} = require('../models/accounts')


const app = express()
app.use(express.json());
const port = process.env.PORT || 3000

app.post('/add/account', async (req, res) => {
    const accountNumber = generateUniqueId({
        length: 12,
        useLetters: false,
        useNumbers:true
      });
    req.body.accountNumber = accountNumber

    const account = new Accounts (req.body)
    try{
        await account.save()
        res.status(201).send('Your account is created with this number : ' +account.accountNumber)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.get('/all/accounts', async (req, res) => {
    try{
        const accounts = await Accounts.find()
        res.send(accounts)
    }catch (e) {
        res.status(400).send(e)
    }
})

app.get('/account/:id', async (req, res) => {
    const accountByAccountNumber = await Accounts.findOne({'accountNumber': req.params.id})
    try{
        if(!accountByAccountNumber) {
            throw new Error()
        }
        res.send(accountByAccountNumber)
    }catch(e) {
        res.status(400).send(e)
    }
})

app.patch('/account/:id', async (req, res) => {
    try{
        const updateAccountByAccountNumaber = await Accounts.findOneAndUpdate({'accountNumber': req.params.id}, req.body , { new: true, runValidators: true })
        res.send(updateAccountByAccountNumaber)
    } catch(e) {
        res.status(400).send(e)
    }
    })

app.delete('/account/:id', async (req, res) => {
    const deleteAccount = await Accounts.findOneAndDelete({'accountNumber': req.params.id})
    try{
        if(!deleteAccount) {
            throw new Error()
        }
        res.send('Account Number - ' + deleteAccount.accountNumber + ' deleted successfully!')
    } catch(e){
        res.status(400).send(e)
    }
})

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})