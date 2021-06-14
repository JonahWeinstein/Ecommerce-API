const request = require('supertest')
const app = require('../src/app')
const Cart = require('../src/models/cart')

const {
    productOne,
    productTwo,
    cartItemOne,
    cartItemTwo,
    setUpDatabase
} = require('./fixtures/db')


// this runs before each test case (beforeAll runs once before the test suite)
beforeEach(setUpDatabase)

test('Should add a product to the cart', async () => {
    const response = await request(app).post('/cart/add').send({
        ProductId: 1,
        cart_quantity: 2
    }).expect(201)
    // assert that the cart item is in the databse
    const cartItem = await Cart.findOne({ where: { ProductId: 1 }})
    expect(cartItem).not.toBeNull()
})