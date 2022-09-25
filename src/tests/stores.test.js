const puppeteer = require('puppeteer');
const { getContentsOf, login } = require('./helpers/page');

// globally scoped variables which are available in all tests
let page, browser;
jest.setTimeout(30000);

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false
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
})
