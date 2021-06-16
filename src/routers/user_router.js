const express = require('express')
const User = require('../models/user')

const router = new express.Router();

router.post('/users')

// create new user
router.post('/users', async (req, res) => {
    try{
        const user = User.build(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
 
    }
 })

 // login existing user 

 router.post('/users/login',  async (req, res) => {
     try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
     } catch (e) {
         res.status(400).send()
     }
 })


 module.exports = router