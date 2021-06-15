const request = require('supertest')
const app = require('../src/app')
const Product = require('../src/models/product')



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
            id: 4,
            name: "test_product",
            price: 10.99,
            quantity: 20
    })
})
test('should return all products', async() => {
    const response = await request(app).get('/products').send().expect(200)
})
test('Should delete product 3', async () => {
    const response = await request(app).delete(`/products/${productThreeId}`).send().expect(200)
    const deletedProduct = await Product.findOne({ where: { id: productThreeId }})
    expect(deletedProduct).toBeNull()
})

test('Should update a product', async () => {
    const response = await request(app).patch(`/products/${productTwoId}`).send({
        description: "updated description"
    }).expect(200)
    expect(response.body).toMatchObject({
        description: "updated description"
    })
})

test('Should not update unauthorized field of a product', async () => {
    await request(app).patch(`/products/${productTwoId}`).send({
        id: 20
    }).expect(400)
})