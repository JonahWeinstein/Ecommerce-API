const puppeteer = require('puppeteer');
const { getContentsOf, login } = require('./helpers/page');
const {sequelize} = require('../sequelize')

// globally scoped variables which are available in all tests
let page, browser;
jest.setTimeout(30000);

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

    beforeEach( async () => {
        await login(page)
    })

    test('can see stores in nav', async () => {
        const stores = await getContentsOf(page, 'a[href="/UserDashboard"]')
        expect(stores).toEqual('Stores')
    })

    test('clicking add store redirects to add store form', async () => {
        await Promise.all([
            page.click('a[href="/UserDashboard/AddStore"]'),
            page.waitForNavigation()
        ])
        const text = await getContentsOf(page, 'p')
        expect(text).toEqual('Pick A Name For Your Store')
    })
    test.only('adding store works', async () => {
        try {
            await page.goto('http://localhost:8080/UserDashboard/AddStore')
            await page.type('form input', 'test store')
            await Promise.all([
                page.click('button[type=submit]'),
                page.waitForNavigation()
            ])
            const storeName = await getContentsOf(page, 'h1')
            expect(storeName).toEqual('test store')
        }
        catch (e) {
            console.log(e)
        }
       
        
    })
})
