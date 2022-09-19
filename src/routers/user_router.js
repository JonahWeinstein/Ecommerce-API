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

// google oauth2.0 auth routes

router.get('/api/auth/google', passport.authenticate('google'));

router.get(
    '/api/oauth2/redirect/google',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('http://localhost:8080/UserDashboard');
    }
  );



module.exports = router