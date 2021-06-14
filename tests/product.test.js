const request = require('supertest')
const app = require('../src/app')
const Product = require('../src/models/product')

const {
    productOne,
    productTwo,
    cartItemOne,
    cartItemTwo,
    setUpDatabase
} = require('./fixtures/db')

// this runs before each test case (beforeAll runs once before the test suite)
beforeEach(setUpDatabase)

test('should add a new product', async () => {
    const response = await request(app).post('/products').send({
        name:"test_product",
        price: 10.99,
        quantity: 20
    }).expect(201)
    // assert that the product is in the databse
    const product = await Product.findOne({ where: { id: response.body.id }})
    expect(product).not.toBeNull()
    // make sure response has these
    // expect(response.body).toMatchObject({
    //     product: {
    //         name: "test_product",
    //         price: 10.99,
    //         quantity: 20
    //     }
    // })
})