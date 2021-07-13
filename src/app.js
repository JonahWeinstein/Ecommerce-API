const express = require('express')
const cors = require('cors')
const db = require('./sequelize')



const productRouter = require('./routers/product_router')
const cartRouter = require('./routers/cart_router')
const userRouter = require('./routers/user_router')
const store_router = require('./routers/store_router')

const app = express()

app.use(cors())
app.use(express.json());
app.use(productRouter)
app.use(cartRouter)
app.use(userRouter)
app.use(store_router)

module.exports = app