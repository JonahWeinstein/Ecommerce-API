const express = require('express')


const productRouter = require('./routers/product_router')

const app = express()

app.use(express.json());
app.use(productRouter)

module.exports = app