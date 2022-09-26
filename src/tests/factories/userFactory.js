const { User } = require('../../sequelize')
const {testUser} = require('../fixtures')

module.exports = async () => {
     const user = await User.findOne({where: {email: testUser.email}})
     return user
}
