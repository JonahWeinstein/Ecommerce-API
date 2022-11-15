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

    test('can add product', async () => {
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
            page.waitForSelector('button#deleteProduct')
        ])
        // if product is successfully added then cta will now say update product
        const action = await getContentsOf(page, 'button[type="submit"]')
        expect(action).toEqual('Update Product')
    })

    test('Can update product', async () => {
        await Promise.all([
            // click on product to go to edit page
            page.click('div.h1'),
            // wait for page to load
            page.waitForSelector('input[name="name"]')
        ]) 
        // change product name
        await page.$eval('input[name="name"]', el => el.value = '')
        await page.type('input[name="name"]', 'updated test name')

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForSelector('form p')
        ])
        const text = await getContentsOf(page, 'form p')
        expect(text).toEqual('Updated')
    })
})