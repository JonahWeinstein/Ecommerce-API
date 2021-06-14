const request = require('supertest')
const app = require('../src/app')
const Product = require('../src/models/product')



const {
    productOne,
    productOneId,
    productTwo,
    productTwoId,
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
    expect(response.body).toMatchObject({
            id: 3,
            name: "test_product",
            price: 10.99,
            quantity: 20
    })
})
test('should return all products', async() => {
    const response = await request(app).get('/products').send().expect(200)
})
test('Should delete product 2', async () => {
    const response = await request(app).delete('/products/2').send().expect(200)
    const deletedProduct = await Product.findOne({ where: { id: productTwoId }})
    expect(deletedProduct).toBeNull()
})