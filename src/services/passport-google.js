const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const { User } = require('../sequelize')


passport.use('google', new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: '/api/oauth2/redirect/google',
    scope: [ 'profile', 'email'],
    proxy: true
  },  
  async (accessToken, refreshToken, profile, done) => {
    try { 
      // try and find user by googleId
      const existingUser = await User.findOne({where: {googleId: profile.id}})
      if (existingUser) {
        return done(null, existingUser)
      }
      // check if user exists but just isn't linked to google 
      const user = await User.findOne({where: {email: profile.email}})
      if(user) {
        await User.update({googleId: profile.id}, {where: {email: profile.email}})
        return done(null, user)
      }
      // if there is no existing user create one and save it
      const userObj = User.build({
        email: profile.email,
        name: profile.given_name,
        googleId: profile.id
      })
      const newUser = await userObj.save({validate: false})
      return done(null, newUser)
      
    } catch(err) {
      done(err, null)
    }
    
    }
  ))