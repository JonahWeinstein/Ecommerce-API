const { User } = require('../sequelize')


module.exports = async () => {
  try {
    // delete test user and all thier data (will be created again with userfactory)
    await User.destroy({where: {email: 'testUser@example.com'}})
    console.log('user destroyed')
  } catch(e) {
    console.log(e)
  }
  
   
}

