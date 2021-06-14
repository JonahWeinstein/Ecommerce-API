const Product = require('../../src/models/product')
const Cart = require('../../src/models/cart')

const productOne = {
    name: "product_1",
    description: "this is a product",
    price: 19.99,
    quantity: 15
}
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
    await Product.destroy({truncate: true})
    await Cart.destroy({truncate: true})

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
    productTwo,
    cartItemOne,
    cartItemTwo,
    setUpDatabase
}