const express = require('express')
const passport = require('passport')
const { User } = require('../sequelize')


const router = new express.Router();



// create new user
router.post('/api/users',
    passport.authenticate('signup'),
    async (req, res) => {
        res.send(req.user)
    })

// login existing user 

router.post(
    '/api/users/login',
    passport.authenticate("login"),
    (req, res) => {
        res.send(req.user)
    }
)
router.get('/api/users/logout', function (req, res) {
    req.logout()
    res.redirect('/');
});



module.exports = router