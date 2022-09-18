const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const { User } = require('./sequelize')

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {

  User.findByPk(id).then(function (user) {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

passport.use('login', new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  async function (username, password, done) {
    try {
      const user = await User.findOne({ where: { email: username } })

      if (!user) { return done(null, false); }
      if (!user.validPass(password)) { return done(null, false); }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }


  }

));

passport.use('signup', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    // passes request object to callback
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    try {
      const name = req.body.name
      const user = User.build({ name, email, password })
      await user.save()
      req.login(user, (err) => {
        done(err, null)
      })
      return done(null, user);
    } catch (e) {
      
      if(e.name == 'SequelizeUniqueConstraintError'){
        return done({message: 'there is already an account with this email'})
    }
      done(e);
    }

  }
))