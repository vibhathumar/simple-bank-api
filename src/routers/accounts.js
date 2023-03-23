const express = require('express')
// require('../db/mongoose')
const generateUniqueId = require('generate-unique-id');
const {Accounts} = require('../models/accounts')
const {Customer} = require('../models/customer')
const {TransactionDetails} = require('../models/transaction-details')
const {TransferAmount} = require('../models/transfer-details')

const router = express.Router()

// const app = express()
// app.use(express.json());
// const port = process.env.PORT || 3000

// router.post('/add/account', async (req, res) => {
//     const accountNumber = generateUniqueId({
//         length: 12,
//         useLetters: false,
//         useNumbers:true
//       });
//     req.body.accountNumber = accountNumber

//     const account = new Accounts (req.body)
//     try{
//         await account.save()
//         res.status(201).send('Your account is created with this number : ' +account.accountNumber)
//     } catch(e) {
//         res.status(400).send(e)
//     }
// })

router.post('/add/account/:customerNumber', async (req, res) => {
    const customerNumber = req.params.customerNumber
    const customer = await Customer.findOne({'customerNumber': customerNumber})
    const customerAlreadyAccountExist = await Accounts.findOne({'customerNumber': customerNumber})
    if(!customer) {
        throw new Error('Cunstomer Info not found');
    } else if(customerAlreadyAccountExist){
        throw new Error('Account already exist with customer number : '+ customerNumber);
    }

    const accountNumber = generateUniqueId({
        length: 12,
        useLetters: false,
        useNumbers:true
      });
    req.body.accountNumber = accountNumber
    req.body.customerNumber = customerNumber
    const account = new Accounts (req.body)
    try{
        await account.save()
        res.status(201).send('Your account is created with this number : ' +account.accountNumber)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/all/accounts', async (req, res) => {
    try{
        const accounts = await Accounts.find()
        res.send(accounts)
    }catch (e) {
        res.status(400).send(e)
    }
})

router.get('/account/:id', async (req, res) => {
    const accountByAccountNumber = await Accounts.findOne({'accountNumber': req.params.id})
    if(!accountByAccountNumber) {
        throw new Error('Account not found!')
    }
    try{
        res.send(accountByAccountNumber)
    }catch(e) {
        res.status(400).send(e)
    }
})

router.post('/deposit', async (req, res) => {
    const depositAmount = await TransactionDetails(req.body)
    const deposit = await depositAmount.save()
    if(!deposit){
        throw new Error('Somthind went wrong!')
    }
    try{
        const accountBalance = await Accounts.findOne({'accountNumber' : deposit.accountNumber})
        const currentBalance = accountBalance.accountBalance
        const txAmount = deposit.txAmount;
        const totalBalance = currentBalance + txAmount
        const updateBalance = await Accounts.findOneAndUpdate(
            {'accountNumber': deposit.accountNumber}, {'accountBalance': totalBalance}, { new: true, runValidators: true })
        res.status(201).send('Deposit successfully!')
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/withdrawal', async (req, res) => {
    const withdrawalDetails = await TransactionDetails(req.body)
    const withdrawalAmount = withdrawalDetails.txAmount
        
    const currentDetails = await Accounts.findOne({'accountNumber': withdrawalDetails.accountNumber})
    const currentAmount = currentDetails.accountBalance
    if(withdrawalAmount > currentAmount) {
        throw new Error('Insufficient fund in account')
    }
    const withdrawal = await withdrawalDetails.save()
    if(!withdrawal){
        throw new Error('Somthing went wrong!')
    }
    try{
        const totalBalance = currentAmount - withdrawalAmount
        const updateBalance = await Accounts.findOneAndUpdate(
            {'accountNumber': withdrawalDetails.accountNumber}, 
            {'accountBalance' : totalBalance}, { new: true, runValidators: true })
        res.send('Withdrawal successfully!')
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/transfer/:customerNumber', async (req, res) => {
    const transferDetails = await TransferAmount(req.body)
    const fromAccountTransfer = transferDetails.fromAccountNumber;
    const toAccountTransfer = transferDetails.toAccountNumber;
    const transferAmount = transferDetails.transferAmount;
    const findFromAccountIsPresent = await Accounts.findOne({'accountNumber': fromAccountTransfer})
    if(!findFromAccountIsPresent) {
        throw new Error('From account number not found!')
    }
    const findToAccountIsPresent = await Accounts.findOne({'accountNumber': toAccountTransfer})
    if(!findToAccountIsPresent){
        throw new Error('To account number not found!')
    }
    const currentBalanceOfFromAccount = findFromAccountIsPresent.accountBalance
    const currentBalanceOfToAccount = findToAccountIsPresent.accountBalance
    //console.log(currentBalanceOfFromAccount)
    if(transferAmount > currentBalanceOfFromAccount){
        throw new Error('Insufficient fund in account')
    }
    try{
        const updateFromAccountTransfer = await Accounts.findOneAndUpdate(
            {'accountNumber': fromAccountTransfer}, 
            {'accountBalance': currentBalanceOfFromAccount - transferAmount}, 
            { new: true, runValidators: true }
            )
        const transactionForFromAccount = new TransactionDetails ({
            accountNumber: fromAccountTransfer,
            txType: 'debit ',
            txAmount: transferAmount
        })
        console.log(transactionForFromAccount)
        await transactionForFromAccount.save()
    
        const updateToAccountTranser = await Accounts.findOneAndUpdate(
            {'accountNumber': toAccountTransfer},
            {'accountBalance': currentBalanceOfToAccount + transferAmount},
            { new: true, runValidators: true }
        )
        const transactionForToAccount = new TransactionDetails({
            accountNumber: toAccountTransfer,
            txType: 'credit',
            txAmount: transferAmount
        })
        await transactionForToAccount.save()
        await transferDetails.save()
        res.status(201).send('Successfully tranfer!')
    }catch (e){
        res.status(400).send(e)
    }
})

router.patch('/account/:id', async (req, res) => {
    try{
        const updateAccountByAccountNumaber = await Accounts.findOneAndUpdate(
            {'accountNumber': req.params.id}, req.body , { new: true, runValidators: true })
        res.send(updateAccountByAccountNumaber)
    } catch(e) {
        res.status(400).send(e)
    }
    })

router.delete('/account/:id', async (req, res) => {
    const deleteAccount = await Accounts.findOneAndDelete({'accountNumber': req.params.id})
    if(!deleteAccount) {
        throw new Error('Account not found!')
    }
    try{
        res.send('Account Number - ' + deleteAccount.accountNumber + ' deleted successfully!')
    } catch(e){
        res.status(400).send(e)
    }
})

// app.listen(port, () => {
//     console.log('Server is up on port: ' + port)
// })

module.exports = router