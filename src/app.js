const express = require('express')
require('./db/mongoose')
const accountRouter = require('./routers/accounts')
const customerRouter = require('./routers/customer')

const app = express()

app.use(express.json());
app.use(accountRouter);
app.use(customerRouter)

module.exports = app
