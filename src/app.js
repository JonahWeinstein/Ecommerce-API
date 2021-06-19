const express = require('express')
const session = require('express-session')
const db = require('./models/sequelize')



const productRouter = require('./routers/product_router')
const cartRouter = require('./routers/cart_router')
const userRouter = require('./routers/user_router')
const store_router = require('./routers/store_router')

const app = express()

app.use(session({resave: true, saveUninitialized: true, secret: 'ha45kGAGSjh3', cookie: { maxAge: 60000 }}));

app.use(express.json());
app.use(productRouter)
app.use(cartRouter)
app.use(userRouter)
app.use(store_router)

module.exports = app