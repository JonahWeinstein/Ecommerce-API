const express = require('express')
const passport = require('passport')
const {User} = require('../sequelize')


const router = new express.Router();



// create new user
router.post('/api/users', async (req, res) => {
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
            res.status(400).send('Unable to Register')
        }
        
 
    }
 })

 // login existing user 

 router.post(
    '/api/users/login', 
    passport.authenticate("local"),
    (req, res) => {
        res.send(req.user)
     }
 )
 router.get('/api/users/logout', function(req, res, next) {
    req.logout()
    console.log(req.user)
    res.redirect('/');
  });



 module.exports = router