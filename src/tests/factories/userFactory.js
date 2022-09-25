const { User } = require('../../sequelize')

module.exports = (name, email, password) => {
     const exisitingUser = User.findOne({where: {email: email}})
     if (exisitingUser) return exisitingUser
     // returns a promise (must be awaited)
     const user = User.build({name, email, password}).save();
     return user
}
