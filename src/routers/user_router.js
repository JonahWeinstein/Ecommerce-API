const express = require('express')
const {User} = require('../sequelize')


const router = new express.Router();



// create new user
router.post('/users', async (req, res) => {
    try{
        const {name, email, password} = req.body
        if(!name || !email || !password) {
            return res.status(400).send({error: 'cannot have null fields'})
        }
        const user = User.build(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        if(e.name == 'SequelizeUniqueConstraintError'){
            res.status(400).send('there is already an account with this email')
        }
        else {
            res.status(400).send(e)
        }
        
 
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