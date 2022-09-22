const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport');

const cookieSession = require('cookie-session');
const bodyParser = require('body-parser')

const productRouter = require('./routers/product_router')
const cartRouter = require('./routers/cart_router')
const userRouter = require('./routers/user_router')
const storeRouter = require('./routers/store_router')
const imageRouter = require('./routers/image_router')
require('./services/passport-local')
require('./services/passport-google')



const app = express()

app.use(bodyParser.json());

// parses cookies and stores them in req.cookeis
app.use(cookieParser())
const corsOptions = {
  origin:'http://localhost:8080',
  credentials:true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE" 
  
}
app.use(cors(corsOptions))

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(productRouter)
app.use(cartRouter)
app.use(userRouter)
app.use(storeRouter)
app.use(imageRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`)
})



