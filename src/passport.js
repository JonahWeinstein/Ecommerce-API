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

passport.use('local', new LocalStrategy(
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

