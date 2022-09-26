const { User } = require('../../sequelize')

module.exports = async (name, email, password) => {
     const exisitingUser = await User.findOne({where: {email: email}})
     
     if (exisitingUser) return exisitingUser
     // returns a promise (must be awaited)
     const user = await User.build({name, email, password}).save();
     return user
}
