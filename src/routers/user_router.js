const express = require('express')
const passport = require('passport')
const { User } = require('../sequelize')


const router = new express.Router();



// create new user
router.post('/api/users', async (req, res, next) => {
    
    try {
        const {name, email, password} = req.body
        const user = User.build({ name, email, password })
        await user.save()
        req.login(user, (err) => {
          return next(err, null)
        })
        res.send(user)
      } catch (e) {
        console.log(e)
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
router.get('/api/users/logout', function (req, res) {
    req.logout()
    res.redirect('/');
});



module.exports = router