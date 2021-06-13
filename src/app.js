const express = require('express')


const productRouter = require('./routers/product_router')
const cartRouter = require('./routers/cart_router')

const app = express()

app.use(express.json());
app.use(productRouter)
app.use(cartRouter)

module.exports = app