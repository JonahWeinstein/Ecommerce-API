const puppeteer = require('puppeteer');
const { testProduct } = require('./fixtures');
const { getContentsOf, getContentsOfArray, login } = require('./helpers/page');

let browser, page
beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: true
    })
})

beforeEach(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:8080')
})

afterAll(async () => {

    await browser.close()
})

/* TESTS THAT REQUIRE LOGIN */

describe('User is logged in', () => {

    beforeEach(async () => {
            // login and navigate to products page
            await login(page)
            await page.goto('http://localhost:8080/UserDashboard')
            // wait for stores to load
            await page.waitForSelector('div.list__item')
            await Promise.all([
                // click on store go to products list
                page.click('div.h1'),
                // wait for page to load
                page.waitForSelector('a#addProduct')
                
            ])
           
      
       
    })

    test('can see products', async () => {
        const products = await getContentsOfArray(page, 'div.h1')
        expect(products).toContain('testProduct')
    })

    test.only('can add product', async () => {
        // click on add product button
        await Promise.all([
            page.click('a.button.cta'),
            page.waitForNavigation()
        ])
        await page.type('input[name="name"]', 'test product 2')
        await page.type('textarea[name="description"]', 'product created from products test suite')
        await page.type('input[name="price"]', '10')
        await page.type('input[name="quantity"]', '30')
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForSelector('button.delete-button:last-of-type')
        ])
        // if product is successfully added then cta will now say update product
        const action = await getContentsOf(page, 'button[type="submit"]')
        expect(action).toEqual('Update Product')
    })
})