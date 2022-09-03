const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const passport = require('passport');

const cookieSession = require('cookie-session');

const productRouter = require('./routers/product_router')
const cartRouter = require('./routers/cart_router')
const userRouter = require('./routers/user_router')
const storeRouter = require('./routers/store_router')
const imageRouter = require('./routers/image_router')
require('./passport')

const app = express()

// parses cookies and stores them in req.cookeis
app.use(cookieParser())

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['123123']
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors())
app.use(express.json());
app.use(productRouter)
app.use(cartRouter)
app.use(userRouter)
app.use(storeRouter)
app.use(imageRouter)


module.exports = app