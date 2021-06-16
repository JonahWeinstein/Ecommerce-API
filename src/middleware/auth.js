const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try { 
        // get token from request Authorization header
        const token = req.header('Authorization').replace('Bearer ', '')
        // verify that token matches signature and decode into payload
        const decoded = jwt.verify(token, process.env.JWT_SIGNATURE)
        // look for a user with the right id and the recieved token in its tokens array
        const user = await User.findOne({_id: decoded._id})

        if(!user){
            throw new Error()
        }
        //store the returned user and session token in the request
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'Please Authenticate'})
    }
    
}

module.exports= auth
