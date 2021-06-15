const request = require('supertest')
const app = require('../src/app')
const Cart = require('../src/models/cart')

const {
    productOne,
    productOneId,
    productTwo,
    productTwoId,
    productThree,
    productThreeId,
    cartItemOne,
    setUpDatabase
} = require('./fixtures/db')


// this runs before each test case (beforeAll runs once before the test suite)
beforeEach(setUpDatabase)

test('Should add a product to the cart', async () => {
    const response = await request(app).post('/cart/add').send({
        ProductId: productTwoId,
        cart_quantity: 2
    }).expect(201)
    // assert that the cart item is in the databse
    const cartItem = await Cart.findOne({ where: { ProductId: productTwoId }})
    expect(cartItem).not.toBeNull()
})

test('should fail to add a nonexistent product to cart', async () => {
    const response = await request(app).post('/cart/add').send({
        ProductId: 1000,
        cart_quantity: 2
    }).expect(400)
    // assert that the cart item is in the databse
    const cartItem = await Cart.findOne({ where: { ProductId: 1000 }})
    expect(cartItem).toBeNull()
})

test('should remove a product from cart', async () =>{ 
    const response = await request(app).patch(`/cart/change/${productOneId}`).send({
        cart_quantity: 0
    }).expect(200)
    // assert that the cart item is no the databse
    const cartItem = await Cart.findOne({ where: { ProductId: productOneId }})
    expect(cartItem).toBeNull()
})

test('Should update the quantity of a cart item', async () => {
    const response = await request(app).patch(`/cart/change/${productOneId}`).send({
        cart_quantity: 5
    }).expect(200)
    const cartItem = await Cart.findOne({ where: { ProductId: productOneId }})
    expect(cartItem).toMatchObject({
        cart_quantity: 5
    })
})

test('Should read all cart items', async () =>{
    const response = await request(app).get('/cart').expect(200)
})