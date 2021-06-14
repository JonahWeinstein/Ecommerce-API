const Product = require('../../src/models/product')
const Cart = require('../../src/models/cart')
const { sequelize } = require('../../src/models/product')

sequelize.options.logging = false
const productOneId = 1

const productOne = {
    name: "product_1",
    description: "this is a product",
    price: 19.99,
    quantity: 15
}

const productTwoId = 2
const productTwo = {
    name: "product_2",
    description: "this is another product",
    price: 14.95,
    quantity: 30
}
const cartItemOne = {
    productId: 1,
    quantity: 3
}
const cartItemTwo = {
    productId: 2,
    quantity: 2
}

const setUpDatabase = async () => {
    // clear the tables in test database
    try{
    await Product.destroy({where:{}})
    await Cart.destroy({where:{}})

    // truncate/drop not having desired effect so I have to do this to reset primary key
    await sequelize.query("ALTER TABLE Products AUTO_INCREMENT = 1;")
    await sequelize.query("ALTER TABLE Cart AUTO_INCREMENT = 1;")

    // create records for testing update/delete, etc
    await Product.create(productOne)
    await Product.create(productTwo)
    await Cart.create(cartItemOne)
    await Cart.create(cartItemTwo)
    } catch(e){
        return { error: 'Could not run setupDatabase'}
    }
}

module.exports = {
    productOne,
    productOneId,
    productTwo,
    productTwoId,
    cartItemOne,
    cartItemTwo,
    setUpDatabase
}