const { User, Store, Product } = require('../sequelize')

const { testUser, testStore, testProduct} = require('./fixtures')

module.exports = async () => {
  jest.setTimeout(30000);
  try {
    // delete test user and all their data (will be created again with userfactory)
    await User.destroy({where: {email: testUser.email}})
    const user = await User.build(testUser).save()
    const store = await Store.build({...testStore, UserId: user.id}).save()
    await Product.build({...testProduct, StoreId: store.id}).save()
    
  } catch(e) {
    console.log(e)
  }
  
   
}

