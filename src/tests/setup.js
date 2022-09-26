const { User } = require('../sequelize')
const { Store } = require('../sequelize')
const { testUser, testStore, testStore2, testProduct} = require('./fixtures')

module.exports = async () => {
  try {
    // delete test user and all th data (will be created again with userfactory)
    await User.destroy({where: {email: testUser.email}})
    const user = await User.build(testUser).save()
    await Store.build({...testStore, UserId: user.id}).save()
    await Store.build({...testStore2, UserId: user.id}).save()
    
  } catch(e) {
    console.log(e)
  }
  
   
}

