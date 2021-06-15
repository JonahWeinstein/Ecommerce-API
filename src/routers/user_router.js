const express = require('express')
const User = require('../models/user')

const router = new express.Router();

router.post('/users')

// create new user
router.post('/users', async (req, res) => {
    try{
        const user = User.build(req.body)
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
 
    }
 })

 module.exports = router